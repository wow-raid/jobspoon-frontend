import React from "react";
import { Routes, Route, useNavigate, useLocation, Outlet, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./components/SearchBar";
import ExploreFilterBar, { FilterSelection } from "./components/ExploreFilterBar";
import SearchPage from "./pages/SearchPage";
import TermListPage from "./pages/TermListPage";
// import NoResultsPage from "./pages/NoResultsPage.tsx";
import SpoonNoteModal from "./components/SpoonNoteModal";
import http, { authHeader } from "./utils/http";

const TOKENS = {
    containerMaxWidth: 768,
    space: (n: number) => `${n}px`,
    color: { text: "#111827" },
    h1FontSize: "clamp(24px, 2.5vw, 30px)",
};

const Container = styled.div`
    margin-left: auto;
    margin-right: auto;
    max-width: ${TOKENS.containerMaxWidth}px;
    padding-left: ${TOKENS.space(16)};
    padding-right: ${TOKENS.space(16)};
    padding-top: ${TOKENS.space(40)};
    padding-bottom: ${TOKENS.space(40)};
`;

const Title = styled.h1`
    font-size: ${TOKENS.h1FontSize};
    font-weight: 750;
    letter-spacing: -0.02em;
    margin: 0 0 ${TOKENS.space(16)} 0;
    color: ${TOKENS.color.text};
`;

const Content = styled.div`
    margin-top: ${TOKENS.space(24)};
`;

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
    return null;
}

/** 공통 레이아웃 */
function AppLayout() {
    const nav = useNavigate();
    const location = useLocation();

    const [q, setQ] = React.useState("");

    // 모달/노트 상태
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedTermId, setSelectedTermId] = React.useState<number | null>(null);
    const [notebooks, setNotebooks] = React.useState<{ id: string; name: string }[]>([
        { id: "nb-1", name: "내가 찾은 용어" },
        { id: "nb-2", name: "Frontend" },
    ]);

    // 전역 위임: TermCard의 + 버튼 클릭 시 모달 오픈 (로그인 체크는 TermCard 가드가 처리)
    React.useEffect(() => {
        function extractTermIdFromArticle(btnEl: HTMLElement): number | null {
            const article = btnEl.closest("article");
            if (!article) return null;
            const labelled = article.getAttribute("aria-labelledby"); // "term-<id>"
            if (!labelled) return null;
            const m = /^term-(\d+)$/.exec(labelled);
            if (!m) return null;
            const idNum = Number(m[1]);
            return Number.isFinite(idNum) ? idNum : null;
        }

        function onDocClick(e: MouseEvent) {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const addBtn = target.closest('button[aria-label="내 단어장에 추가"]') as HTMLElement | null;
            if (!addBtn) return;
            if (modalOpen) return;

            const termId = extractTermIdFromArticle(addBtn);
            if (!termId) return;

            setSelectedTermId(termId);
            setModalOpen(true);
        }

        document.addEventListener("click", onDocClick, true);
        return () => document.removeEventListener("click", onDocClick, true);
    }, [modalOpen]);

    const closeModal = React.useCallback(() => {
        setModalOpen(false);
        setSelectedTermId(null);
    }, []);

    // 서버 연동: 새 폴더 생성 (모달 닫지 않음)
    const handleCreateNotebook = React.useCallback(
        async (name: string) => {
            // 1) 로컬 프리체크 (공백/중복)
            const raw = name;
            const normalized = normalizeName(raw);
            if (!normalized) {
                // 모달에서 메시지를 보여줄 수 있도록 에러 throw
                throw new Error("EMPTY_NAME");
            }
            const localDup = notebooks.some((n) => normalizeName(n.name) === normalized);
            if (localDup) {
                throw new Error("DUPLICATE_LOCAL");
            }

            // 2) 서버 호출
            //    POST /api/user-terms/folders
            //    Body: { folderName: "<raw>" }
            //    Header: Authorization: Bearer <token>
            try {
                const { data } = await http.post(
                    "/api/user-terms/folders",
                    { folderName: raw },
                    { headers: { ...authHeader() } }
                );

                // 3) 응답 스키마 예시: { id, folderName }
                const newId: string = String(data.id);
                const newName: string = data.folderName ?? raw;

                // 4) 모달은 유지, 새 폴더를 상단에 추가하고 자동 선택되도록 id 반환
                setNotebooks((prev) => [{ id: newId, name: newName }, ...prev]);
                return newId;
            } catch (err: any) {
                // 백엔드 표준 에러 매핑
                const status = err?.response?.status;
                const msg: string | undefined = err?.response?.data?.message;

                if (status === 409 || msg?.includes("이미 존재")) {
                    // 서버 중복
                    throw new Error("DUPLICATE_SERVER");
                }
                if (status === 400 || msg?.includes("폴더명") || msg?.includes("입력")) {
                    // 서버 공백/유효성
                    throw new Error("EMPTY_NAME");
                }
                // 그 외는 상위에서 처리(토스트 등)
                throw err;
            }
        },
        [notebooks]
    );

    // 서버 연동(선택): 용어를 폴더에 저장(attach) — 엔드포인트 확정되면 교체
    const handleSaveToNotebook = React.useCallback(
        async (notebookId: string) => {
            if (!selectedTermId) return;
            // TODO: 백엔드 엔드포인트 확정 시 아래 호출로 교체
            // await http.post(
            //   `/api/user-terms/folders/${notebookId}/terms`,
            //   { termId: selectedTermId },
            //   { headers: { ...authHeader() } }
            // );

            closeModal(); // 임시 성공 처리: 저장 시에만 모달 닫기
        },
        [selectedTermId, closeModal]
    );

    // URL ?q= ↔ 입력값 동기화
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const qp = (params.get("q") ?? "").trim();
        if (qp !== q) setQ(qp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const handleSearch = (term: string) => {
        const t = term.trim();
        if (!t) return;
        const sp = new URLSearchParams(location.search);
        sp.set("q", t);
        sp.delete("page");
        sp.delete("tag");
        nav({ pathname: "search", search: `?${sp.toString()}` });
    };

    const handleFilterChange = (sel: FilterSelection) => {
        const sp = new URLSearchParams(location.search);
        sp.delete("initial");
        sp.delete("alpha");
        sp.delete("symbol");
        if (sel) sp.set(sel.mode, sel.value);
        sp.delete("page");
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

    return (
        <Container>
            <Title>잡스푼과 함께, 기술 용어를 나만의 언어로!</Title>

            <SearchBar value={q} onChange={setQ} onSearch={handleSearch} />
            <ExploreFilterBar value={currentSelection} onChange={handleFilterChange} />

            <Content>
                <Outlet />
            </Content>

            {/* 생성은 onCreate, 저장은 onSave */}
            <SpoonNoteModal
                open={modalOpen}
                notebooks={notebooks}
                onClose={closeModal}
                onCreate={handleCreateNotebook}   // ← 생성 시 모달 유지 + 새 id 반환
                onSave={handleSaveToNotebook}     // ← 저장 시에만 모달 닫힘 (엔드포인트 확정 후 교체)
            />
        </Container>
    );
}

/** 홈(빈 본문 허용) */
function HomePage() {
    return null;
}

/** 라우트 구성 — 상대 경로 + 캐치올 fallback */
export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="terms/by-tag" element={<TermListPage />} />
                {/*<Route path="terms/not-found" element={<NoResultsPage />} />*/}
                <Route path="*" element={<AutoContent />} />
            </Route>
        </Routes>
    );
}
