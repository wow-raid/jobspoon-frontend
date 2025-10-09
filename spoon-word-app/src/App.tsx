import React, {useLayoutEffect} from "react";
import { Routes, Route, useNavigate, useLocation, Outlet, useSearchParams } from "react-router-dom";

import SearchBar from "./components/SearchBar";
import ExploreFilterBar, { FilterSelection } from "./components/ExploreFilterBar";
import SearchPage from "./pages/SearchPage";
import TermListPage from "./pages/TermListPage";
import SpoonNoteModal from "./components/SpoonNoteModal";
import http from "./utils/http";
import { fetchUserFolders, patchReorderFolders } from "./api/userWordbook";
import WordbookFolderPage from "./pages/WordbookFolderPage";
import FavoriteTermsPage from "./pages/FavoriteTermsPage.tsx";
import HeroBanner from "./components/HeroBanner";

// 상단 패딩 0인 컨테이너만 사용
import { PageContainerFlushTop } from "./styles/layout";
import { NarrowLeft } from "./styles/layout";

function extractTermIdFromArticle(el: HTMLElement | null): number | null {
    const article = el?.closest("article");
    if (!article) return null;
    const labelled = article.getAttribute("aria-labelledby"); // "term-<id>"
    if (!labelled) return null;
    const m = /^term-(\d+)$/.exec(labelled);
    if (!m) return null;
    const idNum = Number(m[1]);
    return Number.isFinite(idNum) ? idNum : null;
}

/** 폴더 정규화 (프론트 로컬 중복 체크용) */
function normalizeName(s: string) {
    return (s ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

/** 라우트가 매칭되지 않을 때 자동으로 적절한 페이지를 보여주는 fallback */
function AutoContent() {
    const [params] = useSearchParams();
    const q = (params.get("q") ?? "").trim();
    const tag = params.get("tag") ?? "";
    const hasFilter = !!(params.get("initial") || params.get("alpha") || params.get("symbol"));
    if (tag) return <TermListPage />;
    if (q || hasFilter) return <SearchPage />;
    console.debug("[AutoContent] fallback rendered (no search/filter).");
    return null;
}

/** 공통 레이아웃 */
function AppLayout() {
    const nav = useNavigate();
    const location = useLocation();
    console.debug("[AppLayout] pathname =", location.pathname);

    const isFolderRoute =
        location.pathname.startsWith("/spoon-word/folders") ||
        location.pathname.startsWith("/folders/");

    const [q, setQ] = React.useState("");

    // 모달/노트 상태
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedTermId, setSelectedTermId] = React.useState<number | null>(null);
    const [notebooks, setNotebooks] = React.useState<{ id: string; name: string }[]>([]);

    // 폴더 순서 저장
    const handleReorder = React.useCallback(async (orderedIds: string[]) => {
        let serverOk = true;
        try {
            await patchReorderFolders(orderedIds as unknown as Array<string | number>);
        } catch (e: any) {
            serverOk = false;
            if (e?.message === "NON_NUMERIC_ID") {
                console.warn("[reorder] 서버 저장 생략: 숫자 id가 아님", orderedIds);
            } else {
                console.error("[reorder] 서버 오류:", e);
                return;
            }
        }

        setNotebooks((prev) => {
            const map = new Map(prev.map((n) => [n.id, n]));
            const next = orderedIds.map((id) => map.get(id)).filter(Boolean) as typeof prev;
            const leftovers = prev.filter((n) => !orderedIds.includes(n.id));
            return [...next, ...leftovers];
        });

        if (serverOk) console.debug("[reorder] 서버 저장 완료", orderedIds);
    }, []);

    // 모달 열릴 때 폴더 로드
    React.useEffect(() => {
        if (!modalOpen) return;
        if (notebooks.length > 0) return;

        let aborted = false;
        (async () => {
            try {
                const list = await fetchUserFolders();
                if (!aborted) setNotebooks(list);
            } catch (e) {
                console.warn("[folders] 목록 조회 실패", e);
            }
        })();
        return () => {
            aborted = true;
        };
    }, [modalOpen, notebooks.length]);

    const closeModal = React.useCallback(() => {
        setModalOpen(false);
        setSelectedTermId(null);
    }, []);

    // 서버 연동: 새 폴더 생성 (모달 닫지 않음)
    const handleCreateNotebook = React.useCallback(
        async (name: string) => {
            const raw = name;
            const normalized = normalizeName(raw);
            if (!normalized) throw new Error("EMPTY_NAME");
            const localDup = notebooks.some((n) => normalizeName(n.name) === normalized);
            if (localDup) throw new Error("DUPLICATE_LOCAL");

            try {
                const { data } = await http.post("/me/folders", { folderName: raw });
                const newId: string = String(data.id);
                const newName: string = data.folderName ?? raw;
                setNotebooks((prev) => [{ id: newId, name: newName }, ...prev]);
                console.debug("[createFolder] created id/name =", newId, newName);
                return newId;
            } catch (err: any) {
                const status = err?.response?.status;
                const msg: string | undefined = err?.response?.data?.message;
                if (status === 409 || msg?.includes("이미 존재")) throw new Error("DUPLICATE_SERVER");
                if (status === 400 || msg?.includes("폴더명") || msg?.includes("입력")) throw new Error("EMPTY_NAME");
                throw err;
            }
        },
        [notebooks]
    );

    // 서버 연동: 용어를 폴더에 저장(attach)
    const handleSaveToNotebook = React.useCallback(
        async (notebookId: string) => {
            if (!selectedTermId) return;

            try {
                await http.post(`/me/folders/${notebookId}/terms`, { termId: selectedTermId });
                console.debug("[attach] term", selectedTermId, "-> folder", notebookId, "OK");
                closeModal();
            } catch (err: any) {
                const status = err?.response?.status;
                if (status === 401) {
                    closeModal();
                    nav("/login", { state: { from: `/spoon-word/folders/${notebookId}` } });
                } else {
                    console.error("[attach] 폴더에 용어 추가 실패:", err);
                }
            }
        },
        [selectedTermId, closeModal, nav]
    );

    // URL ?q= ↔ 입력값 동기화
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const qp = (params.get("q") ?? "").trim();
        if (qp !== q) setQ(qp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    React.useEffect(() => {
        function onDocClick(e: MouseEvent) {
            // 버튼 측에서 preventDefault() 했으면 무시
            if (e.defaultPrevented) return;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            // TermCard의 + 버튼(aria-label 고정 사용)
            const addBtn = target.closest('button[aria-label="내 단어장에 추가"]') as HTMLElement | null;
            if (!addBtn) return;
            if (modalOpen) return;

            // 미로그인이라면 모달 열지 않음
            const loggedIn = !!localStorage.getItem("isLoggedIn");
            if (!loggedIn) return;

            const termId = extractTermIdFromArticle(addBtn);
            if (!termId) return;

            setSelectedTermId(termId);
            setModalOpen(true);
        }

        // 버블 단계로 변경 (false) — 버튼의 stopPropagation()이 유효해짐
        document.addEventListener("click", onDocClick, false);
        return () => document.removeEventListener("click", onDocClick, false);
    }, [modalOpen]);

    const handleSearch = (term: string) => {
        const t = term.trim();
        if (!t) return;
        const sp = new URLSearchParams(location.search);
        sp.set("q", t);
        sp.delete("page");
        sp.delete("tag");
        console.debug("[search] -> /search?q=%s", t);
        nav({ pathname: "search", search: `?${sp.toString()}` });
    };

    const handleFilterChange = (sel: FilterSelection) => {
        const sp = new URLSearchParams(location.search);
        sp.delete("initial");
        sp.delete("alpha");
        sp.delete("symbol");
        if (sel) sp.set(sel.mode, sel.value);
        sp.delete("page");
        console.debug("[filter] -> /search with", sel);
        nav({ pathname: "search", search: `?${sp.toString()}` });
    };

    const currentSelection: FilterSelection = React.useMemo(() => {
        const sp = new URLSearchParams(location.search);
        const initial = sp.get("initial");
        const alpha = sp.get("alpha");
        const symbol = sp.get("symbol");
        if (initial) return { mode: "initial", value: initial };
        if (alpha) return { mode: "alpha", value: alpha };
        if (symbol) return { mode: "symbol", value: symbol };
        return null;
    }, [location.search]);

    const handleGoToFolder = React.useCallback(
        (folderId: string, name?: string) => {
            console.debug("[goToFolder] id=", folderId, "name=", name, "from", location.pathname);
            closeModal();
            // 호스트가 /spoon-word/* 또는 루트에 마운트되어도 안전하게
            if (location.pathname.startsWith("/spoon-word")) {
                nav(`/spoon-word/folders/${folderId}`, { state: { folderName: name } });
            } else {
                nav(`/folders/${folderId}`, { state: { folderName: name } });
            }
        },
        [closeModal, nav, location.pathname]
    );

    useLayoutEffect(() => {
        const setShellInsets = () => {
            // 헤더 안쪽 래퍼(Inner) 잡기
            const brand = document.querySelector('header a[aria-label="JobSpoon 홈"]') as HTMLElement | null;
            const inner = brand?.closest('div') as HTMLElement | null; // styled Inner

            if (!inner) return;

            const rect = inner.getBoundingClientRect();
            const cs = getComputedStyle(inner);
            const padL = parseFloat(cs.paddingLeft) || 0;
            const padR = parseFloat(cs.paddingRight) || 0;

            const left  = Math.max(0, Math.round(rect.left  + padL));
            const right = Math.max(0, Math.round(window.innerWidth - rect.right + padR));

            document.documentElement.style.setProperty("--shell-left",  `${left}px`);
            document.documentElement.style.setProperty("--shell-right", `${right}px`);
        };

        setShellInsets();
        window.addEventListener("resize", setShellInsets);
        return () => window.removeEventListener("resize", setShellInsets);
    }, []);

    return (
        <PageContainerFlushTop>
            <HeroBanner
                align="left"
                narrow
                floatingIcons={[
                    "http://localhost:3006/hero/icon-1.png",
                    "http://localhost:3006/hero/icon-2.png",
                    "http://localhost:3006/hero/icon-3.png",
                ]}
                assetHost={process.env.MFE_PUBLIC_SERVICE || "http://localhost:3006"}
                iconProps={{
                    // 전체 박스 크기/위치 (원하면 같이 조절)
                    width:  "360px",
                    height: "240px",
                    top: "28px",
                    rightOffset: 0,

                    // ✨ 각 아이콘 개별 위치(%)
                    positions: [
                        { left: 20, top: 30 }, // icon-1
                        { left: 66, top: 12 }, // icon-2
                        { left: 45, top: 62 }, // icon-3
                    ],

                    // 필요시 크기·그림자
                    maxIconWidthPercent: 38,
                    withShadow: false,
                    // scales: [1.0, 0.9, 0.95], // 개별 스케일도 가능
                }}
            />

            <NarrowLeft>
                <SearchBar value={q} onChange={setQ} onSearch={handleSearch} />
            </NarrowLeft>

            {!isFolderRoute && (
                <NarrowLeft>
                    <ExploreFilterBar value={currentSelection} onChange={handleFilterChange} />
                </NarrowLeft>
            )}

            <Outlet />

            <SpoonNoteModal
                open={modalOpen}
                notebooks={notebooks}
                onClose={closeModal}
                onCreate={handleCreateNotebook}
                onSave={handleSaveToNotebook}
                onReorder={handleReorder}
                onGoToFolder={handleGoToFolder}
            />
        </PageContainerFlushTop>
    );
}

/** 홈(빈 본문 허용) */
function HomePage() {
    return null;
}

/** 라우트 구성 — 폴더 라우트를 캐치올보다 먼저(+ 경로 2가지 모두 지원) */
export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="terms/by-tag" element={<TermListPage />} />

                {/* 폴더 상세: 두 경로 모두 지원 */}
                <Route path="spoon-word/folders/:folderId" element={<WordbookFolderPage />} />
                <Route path="folders/:folderId" element={<WordbookFolderPage />} />
                <Route path="favorites" element={<FavoriteTermsPage />} />

                {/* 캐치올은 맨 마지막 */}
                <Route path="*" element={<AutoContent />} />
            </Route>
        </Routes>
    );
}
