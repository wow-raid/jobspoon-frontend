import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "../components/SearchBar";
import ExploreFilterBar, { FilterSelection } from "../components/ExploreFilterBar";
import SpoonWordHeroBanner from "../components/SpoonWordHeroBanner.tsx";
import SpoonNoteHeroBanner from "../components/SpoonNoteHeroBanner";
import { NarrowLeft } from "../styles/layout";
import icon1 from "../assets/hero/icon-1.png";
import icon2 from "../assets/hero/icon-2.png";
import icon3 from "../assets/hero/icon-3.png";
import icon4 from "../assets/hero/icon-4.png";

const RUNTIME: any =
    (typeof window !== "undefined" && (window as any).__APP_CONFIG__) || {};

const UI = {
    line: "#e5e7eb",
    primary: "#3E63E0",
    primarySoft: "#eef2ff",
    text: "#0f172a",
    panel: "#ffffff",
    shadow: "0 20px 60px rgba(62,99,224,.08)",
};

const Shell = styled.div<{ $noSide?: boolean }>`
    display: grid;
    grid-template-columns: ${p => (p.$noSide ? "1fr" : "220px 1fr")};
    gap: 24px;
    padding: 0 0 40px;
    margin-left: ${p => (p.$noSide ? "0" : "-170px")};
    margin-right: ${p => (p.$noSide ? "0" : "100px")};
`;

const Side = styled.nav`
    background: ${UI.panel};
    border: 1px solid ${UI.line};
    border-radius: 14px;
    padding: 14px;
    position: sticky;
    top: var(--side-top, 20px);
    align-self: start;
    margin-top: var(--side-mt, 0px);
`;

const TitleLink = styled(NavLink)`
    display: block;
    font-weight: 750;
    font-size: 18px;
    letter-spacing: -0.02em;
    color: ${UI.text};
    background: #eef4ff;
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 8px;
    text-decoration: none;
    &:hover { background: #e6eeff; }
    &.active {
        outline: 2px solid ${UI.primary};
        color: ${UI.primary};
    }
`;

const List = styled.ul`
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: grid;
    gap: 6px;
`;

const ItemLink = styled(NavLink)`
    display: block;
    padding: 12px 12px;
    border-radius: 10px;
    font-weight: 700;
    color: ${UI.text};
    text-decoration: none;
    border: 1px solid transparent;
    &.active {
        background: ${UI.primarySoft};
        color: ${UI.primary};
        border-color: ${UI.primary};
    }
    &:hover { background: #f8fafc; }
`;

const Main = styled.main``;

export default function SpoonWordLayout() {
    const loc = useLocation();
    const nav = useNavigate();

    const under = (base: string) =>
        loc.pathname === base || loc.pathname.startsWith(base + "/");

    // 히어로 숨김 :'퀴즈'
    const hideGlobalHero = under("/spoon-word/quiz");

    // OX·초성·오늘의 등 “퀴즈 모드” 화면에서는 사이드 숨김
    const isQuizModePage = /^\/spoon-word\/quiz\/(ox|today|initials)(\/|$)/.test(loc.pathname);

    // 라우트 분기
    const isNotesRoute = under("/spoon-word/notes");
    const isFolderRoute = under("/spoon-word/folders");

    // 노출 플래그
    const showNoteHero = !hideGlobalHero && (isNotesRoute || isFolderRoute);
    const showWordHero = !hideGlobalHero && !showNoteHero;
    const showSearchBars = !hideGlobalHero && !(isNotesRoute || isFolderRoute); // notes/폴더 상세에서는 숨김

    // ── 검색/필터 상태 동기화 ──
    const [q, setQ] = React.useState("");
    React.useEffect(() => {
        const sp = new URLSearchParams(loc.search);
        setQ((sp.get("q") ?? "").trim());
    }, [loc.search]);

    const handleSearch = (term: string) => {
        const t = term.trim();
        if (!t) return;
        const sp = new URLSearchParams(loc.search);
        sp.set("q", t);
        sp.delete("page");
        sp.delete("tag");
        nav({ pathname: "/spoon-word/search", search: `?${sp.toString()}` });
    };

    const [selection, setSelection] = React.useState<FilterSelection>(null);
    React.useEffect(() => {
        const sp = new URLSearchParams(loc.search);
        const initial = sp.get("initial");
        const alpha = sp.get("alpha");
        const symbol = sp.get("symbol");
        if (initial) setSelection({ mode: "initial", value: initial });
        else if (alpha) setSelection({ mode: "alpha", value: alpha });
        else if (symbol) setSelection({ mode: "symbol", value: symbol });
        else setSelection(null);
    }, [loc.search]);

    const handleFilterChange = (sel: FilterSelection) => {
        const sp = new URLSearchParams(loc.search);
        sp.delete("initial"); sp.delete("alpha"); sp.delete("symbol");
        if (sel) sp.set(sel.mode, sel.value);
        sp.delete("page");
        nav({ pathname: "/spoon-word/search", search: `?${sp.toString()}` });
    };

    return (
        <>
            {/* 라우트별 히어로 */}
            {showWordHero && (
                <SpoonWordHeroBanner
                    align="left"
                    narrow
                    floatingIcons={[icon1, icon2, icon3]}
                    iconProps={{
                        width: "360px",
                        height: "240px",
                        top: "28px",
                        rightOffset: 0,
                        positions: [
                            { left: 20, top: 30 },
                            { left: 66, top: 30 },
                            { left: 45, top: 55 },
                        ],
                        maxIconWidthPercent: 38,
                        withShadow: false,
                    }}
                />
            )}

            {showNoteHero && (
                <SpoonNoteHeroBanner
                    align="left"
                    narrow
                    floatingIcons={[icon4]}
                    iconProps={{
                        width: "360px",
                        height: "240px",
                        top: "70px",
                        rightOffset: 0,
                        maxIconWidthPercent: 100,
                        positions: [{ left: 30, top: 22 }],
                        scales: [1.05],
                        withShadow: false,
                    }}
                />
            )}

            {/* 히어로 아래 레이아웃 */}
            <Shell
                data-testid="spoonword-shell"
                $noSide={isQuizModePage}
                style={{
                    ['--side-top' as any]: hideGlobalHero ? 'calc(110px + 16px)' : '20px',
                    ['--side-mt'  as any]: hideGlobalHero ? '12px' : '0px',
                }}
            >
                {!isQuizModePage && (
                    <Side aria-label="스푼워드 네비게이션">
                        <TitleLink to="/spoon-word" end aria-label="스푼워드 홈으로">스푼워드</TitleLink>
                        <List>
                            <li><ItemLink to="/spoon-word/notes" end>스푼노트</ItemLink></li>
                            <li><ItemLink to="/spoon-word/quiz">스푼퀴즈</ItemLink></li>
                            <li><ItemLink to="/spoon-word/book">스푼북</ItemLink></li>
                        </List>
                    </Side>
                )}

                <Main>
                    {showSearchBars && (
                        <>
                            <NarrowLeft>
                                <SearchBar value={q} onChange={setQ} onSearch={handleSearch} />
                            </NarrowLeft>
                            <NarrowLeft>
                                <ExploreFilterBar value={selection} onChange={handleFilterChange} />
                            </NarrowLeft>
                        </>
                    )}
                    <Outlet />
                </Main>
            </Shell>
        </>
    );
}
