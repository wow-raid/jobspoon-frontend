import React from "react";
import { Routes, Route, useNavigate, useLocation, Outlet, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./components/SearchBar";
import ExploreFilterBar, { FilterSelection } from "./components/ExploreFilterBar";
import SearchPage from "./pages/SearchPage";
import TermListPage from "./pages/TermListPage";
// import NoResultsPage from "./pages/NoResultsPage.tsx";

/** 디자인 토큰 (간단 버전) */
const TOKENS = {
    containerMaxWidth: 768,
    space: (n: number) => `${n}px`,
    color: { text: "#111827" },
    h1FontSize: "clamp(24px, 2.5vw, 30px)",
};

/** styled-components */
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

/** 라우트가 매칭되지 않을 때(또는 베이스 경로 불명확할 때) 자동으로 적절한 페이지를 보여주는 fallback */
function AutoContent() {
    const [params] = useSearchParams();
    const q = (params.get("q") ?? "").trim();
    const tag = params.get("tag") ?? "";
    const hasFilter = !!(params.get("initial") || params.get("alpha") || params.get("symbol"));
    if (tag) return <TermListPage />;
    if (q || hasFilter) return <SearchPage />;
    return null; // 홈은 AppLayout에서 index로 이미 처리됨(없으면 빈 화면 유지)
}

/** 공통 레이아웃 */
function AppLayout() {
    const nav = useNavigate();
    const location = useLocation();

    const [q, setQ] = React.useState("");

    // URL ?q= ↔ 입력값 동기화
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const qp = (params.get("q") ?? "").trim();
        if (qp !== q) setQ(qp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    /** 검색 실행 → 상대 네비게이션 (절대경로 사용 금지) */
    const handleSearch = (term: string) => {
        const t = term.trim();
        if (!t) return;
        const sp = new URLSearchParams(location.search);
        sp.set("q", t);
        sp.delete("page");
        sp.delete("tag"); // 태그 검색 상태 해제
        nav({ pathname: "search", search: `?${sp.toString()}` });
    };

    /** 필터 변경 → 상대 네비게이션 (상호 배타) */
    const handleFilterChange = (sel: FilterSelection) => {
        const sp = new URLSearchParams(location.search);
        sp.delete("initial");
        sp.delete("alpha");
        sp.delete("symbol");
        if (sel) sp.set(sel.mode, sel.value);
        sp.delete("page");
        nav({ pathname: "search", search: `?${sp.toString()}` });
    };

    /** URL → 필터바 선택값 */
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
