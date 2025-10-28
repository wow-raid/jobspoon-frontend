import React, { useLayoutEffect } from "react";
import {
    Routes, Route, useNavigate, useLocation, Outlet,
    useSearchParams, Navigate, NavLink
} from "react-router-dom";

import SpoonWordLayout from "./layouts/SpoonWordLayout";
import SearchBar from "./components/SearchBar";
import ExploreFilterBar, { FilterSelection } from "./components/ExploreFilterBar";
import SearchPage from "./pages/SearchPage";
import TermListPage from "./pages/TermListPage";
import SpoonNoteModal from "./components/SpoonNoteModal";
import http from "./utils/http";
import { fetchUserFolders, patchReorderFolders } from "./api/userWordbook";
import WordbookFolderPage from "./pages/WordbookFolderPage";
import FavoriteTermsPage from "./pages/FavoriteTermsPage";
import SpoonWordHeroBanner from "./components/SpoonWordHeroBanner.tsx";
import QuizHomePage from "./pages/QuizHomePage.tsx";
import QuizPlayPage from "./pages/QuizPlayPage";
import SpoonNoteHomePage from "./pages/SpoonNoteHomePage.tsx";
import {SpoonDialogProvider} from "./components/SpoonDialog.tsx";

import { PageContainerFlushTop, NarrowLeft } from "./styles/layout";
import { goToAccountLogin } from "./utils/auth";
import OXQuizPage from "./pages/OXQuizPage.tsx";
import {GlobalFonts} from "./styles/GlobalFonts.tsx";
import InitialsQuizPage from "./pages/InitialsQuizPage.tsx";
import QuizChoicePage from "./pages/QuizChoicePage.tsx";
import QuizResultRoute from "./routes/QuizResultRoute.tsx";

// notes 전용 로그인 가드
function NotesGuard() {
    const location = useLocation();
    const loggedIn = !!localStorage.getItem("isLoggedIn");

    React.useEffect(() => {
        if (!loggedIn) {
            // 로그인 후 돌아올 경로 유지
            goToAccountLogin(location.pathname + location.search);
        }
    }, [loggedIn, location.pathname, location.search]);

    if (!loggedIn) {
        return <div style={{ padding: 24 }}>로그인 페이지로 이동 중…</div>;
    }
    // 로그인 상태라면 내 단어장 페이지 렌더
    return <WordbookFolderPage />;
}

/* == 유틸 == */
function extractTermIdFromArticle(el: HTMLElement | null): number | null {
    const article = el?.closest("article");
    if (!article) return null;
    const labelled = article.getAttribute("aria-labelledby");
    if (!labelled) return null;
    const m = /^term-(\d+)$/.exec(labelled);
    if (!m) return null;
    const idNum = Number(m[1]);
    return Number.isFinite(idNum) ? idNum : null;
}
function normalizeName(s: string) {
    return (s ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

/* == 라우트 미매칭 fallback == */
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

/* == 서버 로그인 호환 라우트 == */
function RedirectToAccountLogin() {
    const location = useLocation();
    React.useEffect(() => {
        const backTo = location.pathname + location.search;
        goToAccountLogin(backTo);
    }, [location.pathname, location.search]);
    return <div style={{ padding: 24 }}>로그인 페이지로 이동 중…</div>;
}

/* 디버그/랜딩: /spoon-word 첫 화면 */
function SpoonWordIndex() {
    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginTop: 0 }}>스푼워드</h2>
            <p>좌측 사이드바에서 페이지를 선택하세요.</p>
            <ul>
                <li><NavLink to="/spoon-word/notes">스푼노트</NavLink></li>
                <li><NavLink to="/spoon-word/quiz">스푼퀴즈</NavLink></li>
                <li><NavLink to="/spoon-word/book">스푼북</NavLink></li>
            </ul>
        </div>
    );
}

/* == 공통 레이아웃 == */
function AppLayout() {
    const nav = useNavigate();
    const location = useLocation();

    const under = (base: string) =>
        location.pathname === base || location.pathname.startsWith(base + "/");

    // 스푼워드 구간 감지
    const isSpoonWordRoute = under("/spoon-word");
    const isQuizRoute =
        under("/spoon-word/quiz") || under("/spoon-quiz");
    const isFolderRoute = under("/spoon-word/folders") || under("/folders");

    const [q, setQ] = React.useState("");

    // 모달/노트 상태
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedTermId, setSelectedTermId] = React.useState<number | null>(null);
    const [notebooks, setNotebooks] = React.useState<{ id: string; name: string }[]>([]);

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
        return () => { aborted = true; };
    }, [modalOpen, notebooks.length]);

    const closeModal = React.useCallback(() => {
        setModalOpen(false);
        setSelectedTermId(null);
    }, []);

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
                    goToAccountLogin(location.pathname + location.search);
                } else {
                    console.error("[attach] 폴더에 용어 추가 실패:", err);
                }
            }
        },
        [selectedTermId, closeModal, location.pathname, location.search]
    );

    // URL ?q= ↔ 입력값 동기화
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const qp = (params.get("q") ?? "").trim();
        if (qp !== q) setQ(qp);
    }, [location.search]); // eslint-disable-line

    React.useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (e.defaultPrevented) return;
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const addBtn = target.closest('button[aria-label="내 단어장에 추가"]') as HTMLElement | null;
            if (!addBtn) return;
            if (modalOpen) return;

            const loggedIn = !!localStorage.getItem("isLoggedIn");
            if (!loggedIn) return;

            const termId = extractTermIdFromArticle(addBtn);
            if (!termId) return;

            setSelectedTermId(termId);
            setModalOpen(true);
        }

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
        nav({ pathname: "search", search: `?${sp.toString()}` }); // 훅 재호출 금지, nav 사용
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

    useLayoutEffect(() => {
        const setShellInsets = () => {
            const brand = document.querySelector('header a[aria-label="JobSpoon 홈"]') as HTMLElement | null;
            const inner = brand?.closest('div') as HTMLElement | null;
            if (!inner) return;

            const rect = inner.getBoundingClientRect();
            const cs = getComputedStyle(inner);
            const padL = parseFloat(cs.paddingLeft) || 0;
            const padR = parseFloat(cs.paddingRight) || 0;

            const left = Math.max(0, Math.round(rect.left + padL));
            const right = Math.max(0, Math.round(window.innerWidth - rect.right + padR));

            document.documentElement.style.setProperty("--shell-left", `${left}px`);
            document.documentElement.style.setProperty("--shell-right", `${right}px`);
        };

        setShellInsets();
        window.addEventListener("resize", setShellInsets);
        return () => window.removeEventListener("resize", setShellInsets);
    }, []);

    return (
        <PageContainerFlushTop>
            {/* 스푼워드에서는 상단 요소(히어로/서치/필터) 렌더 안함
          → 스푼워드 레이아웃(Main) 칼럼에서 렌더하도록 이동 */}
            {!isQuizRoute && !isSpoonWordRoute && (
                <>
                    <SpoonWordHeroBanner
                        align="left"
                        narrow
                        floatingIcons={[
                            "http://localhost:3006/hero/icon-1.png",
                            "http://localhost:3006/hero/icon-2.png",
                            "http://localhost:3006/hero/icon-3.png",
                        ]}
                        assetHost={process.env.MFE_PUBLIC_SERVICE || "http://localhost:3006"}
                        iconProps={{
                            width: "360px",
                            height: "240px",
                            top: "28px",
                            rightOffset: 0,
                            positions: [
                                { left: 20, top: 30 },
                                { left: 66, top: 12 },
                                { left: 45, top: 62 },
                            ],
                            maxIconWidthPercent: 38,
                            withShadow: false,
                        }}
                    />

                    {!isFolderRoute && (
                        <NarrowLeft>
                            <SearchBar value={q} onChange={setQ} onSearch={handleSearch} />
                        </NarrowLeft>
                    )}

                    {!isFolderRoute && (
                        <NarrowLeft>
                            <ExploreFilterBar value={currentSelection} onChange={handleFilterChange} />
                        </NarrowLeft>
                    )}
                </>
            )}
            <Outlet />
        </PageContainerFlushTop>
    );
}

/* == 홈(빈 본문 허용) == */
function HomePage() {
    return null;
}

/* == 라우트 구성 == */
export default function App() {
    return (
        <>
            <GlobalFonts />
            <SpoonDialogProvider>
                <Routes>
                    {/* 공통 레이아웃 */}
                    <Route element={<AppLayout />}>
                        {/* 이 마이크로앱은 호스트가 /spoon-word/*에 마운트함 → 내부는 상대경로 "/*"로 베이스를 씌움 */}
                        <Route path="/*" element={<SpoonWordLayout />}>
                            {/* /spoon-word 첫 진입 시 words로 */}
                            <Route index element={<Navigate to="words" replace />} />
                            <Route path="words" element={<TermListPage />} />
                            <Route path="notes" element={<SpoonNoteHomePage />} />
                            <Route path="search" element={<SearchPage />} />
                            <Route path="quiz">
                                <Route index element={<QuizHomePage />} />
                                <Route path="play" element={<QuizPlayPage />} />
                                <Route path="today" element={<QuizChoicePage />} />
                                <Route path="ox" element={<OXQuizPage />} />
                                <Route path="initials" element={<InitialsQuizPage />} />
                                <Route path="result" element={<QuizResultRoute />} />
                            </Route>
                            <Route path="book" element={<FavoriteTermsPage />} />
                            <Route path="folders/:folderId" element={<WordbookFolderPage />} />
                        </Route>

                        {/* 기타 경로들 */}
                        <Route path="login" element={<RedirectToAccountLogin />} />
                        <Route path="*" element={<AutoContent />} />
                    </Route>
                </Routes>
            </SpoonDialogProvider>
        </>
    );
}
