import React from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import http, { authHeader } from "../utils/http";
import SpoonNoteModal from "../components/SpoonNoteModal";
import { fetchUserFolders, patchReorderFolders } from "../api/userWordbook";
import TermCard from "../components/TermCard";

/** 서버 응답에서 안전하게 뽑아둘 필드들 */
type TermRow = any;
type TermItem = {
    uwtId: string;   // user_wordbook_term.id
    termId: string;  // 사전 term.id
    title: string;
    description: string;
    createdAt?: string;
    tags?: string[];
};

const UI = {
    color: {
        bg: "#ffffff",
        panel: "#f8fafc",
        text: "#111827",
        sub: "#374151",
        muted: "#6b7280",
        line: "#e5e7eb",
        indigo: "#6366f1",
        indigo50: "#eef2ff",
        primary: "#3b82f6",
        danger: "#ef4444",
    },
    radius: { xl: 20, lg: 14, md: 12, sm: 10, pill: 999 },
    shadow: {
        card: "0 1px 0 rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.06)",
        bar: "0 6px 20px rgba(0,0,0,0.06)",
        menu: "0 8px 24px rgba(0,0,0,0.12)",
    },
    space: (n: number) => `${n}px`,
    font: { h2: "22px", body: "15px", tiny: "12px" },
};

/* ---------- 상단 툴바 ---------- */
const Toolbar = styled.div`
    position: sticky;
    top: 0;
    z-index: 5;
    background: ${UI.color.bg};
    border-bottom: 1px solid ${UI.color.line};
    padding: 12px 8px;
    margin-bottom: 16px;
    box-shadow: ${UI.shadow.bar};
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: ${UI.font.h2};
    letter-spacing: -0.01em;
    color: ${UI.color.text};
`;

const Count = styled.span`
    margin-left: 8px;
    font-size: ${UI.font.body};
    color: ${UI.color.muted};
`;

const Spacer = styled.div`flex: 1 1 auto;`;

const Seg = styled.div`
    display: inline-flex;
    border: 1px solid ${UI.color.line};
    border-radius: ${UI.radius.sm}px;
    overflow: hidden;
`;
const SegBtn = styled.button<{ $active?: boolean }>`
    height: 34px;
    padding: 0 12px;
    background: ${({ $active }) => ($active ? UI.color.indigo50 : "#fff")};
    color: ${({ $active }) => ($active ? UI.color.text : UI.color.sub)};
    border: 0;
    cursor: pointer;
`;

/* ---------- 설정 버튼 + 메뉴 ---------- */
const Actions = styled.div`position: relative;`;

const SettingsBtn = styled.button`
    height: 36px;
    padding: 0 12px;
    border-radius: ${UI.radius.sm}px;
    border: 1px solid ${UI.color.line};
    background: #f3f4f6;
    color: ${UI.color.sub};
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
`;

const Gear = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.94-3.5c0-.5-.05-1-.15-1.47l2.12-1.65-2-3.46-2.5 1a7.7 7.7 0 0 0-2.54-1.47l-.38-2.67h-4l-.38 2.67A7.7 7.7 0 0 0 8.5 5.95l-2.5-1-2 3.46 2.12 1.65c-.1.48-.15.97-.15 1.47s.05.99.15 1.47L4 16.12l2 3.46 2.5-1c.78.6 1.62 1.08 2.54 1.47l.38 2.67h4l.38-2.67c.92-.39 1.76-.87 2.54-1.47l2.5 1 2-3.46-2.12-1.65c.1-.48.15-.97.15-1.47Z" fill="currentColor"/>
    </svg>
);

const Menu = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 220px;
    background: #fff;
    border: 1px solid ${UI.color.line};
    border-radius: 12px;
    box-shadow: ${UI.shadow.menu};
    padding: 6px;
    z-index: 6;
`;

const MenuItem = styled.button<{ disabled?: boolean }>`
    width: 100%;
    text-align: left;
    border: 0;
    background: transparent;
    border-radius: 8px;
    padding: 10px 12px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    color: ${({ disabled }) => (disabled ? UI.color.muted : UI.color.text)};
    &:hover { background: ${({ disabled }) => (disabled ? "transparent" : "#f9fafb")}; }
`;

/* ---------- 리스트/카드 ---------- */
const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
`;

/** TermCard 내부의 + 버튼 숨김, 제목/설명 가리기, 연관 키워드 숨기기 */
const HideTermCardAdd = styled.div<{
    $hideTitle?: boolean;
    $hideDesc?: boolean;
}>`
    [aria-label="내 단어장에 추가"] { display: none !important; }

    /* 단어 숨기기: h3 제목 위에 f8fafc 네모 박스 덮기 */
    ${({ $hideTitle }) =>
            $hideTitle &&
            `
    article h3[id^="term-"]{
      position: relative;
      color: transparent !important;
      text-shadow: none !important;
      user-select: none;
    }
    article h3[id^="term-"]::after{
      content: "";
      position: absolute;
      left: -6px;
      right: -6px;
      top: -2px;
      bottom: -2px;
      background: ${UI.color.panel};
      border-radius: 10px;
      pointer-events: none;
    }
  `}

        /* 뜻 숨기기: 박스(InnerBox)는 유지하고 텍스트만 투명 처리 */
    ${({ $hideDesc }) =>
            $hideDesc &&
            `
    /* InnerBox 자체는 그대로 두되, 안의 설명 글자만 숨김 */
    article > div:nth-of-type(2) {
      position: relative; /* 높이 유지 + 선택 방지용 */
    }
    article > div:nth-of-type(2) p {
      color: transparent !important;
      text-shadow: none !important;
      user-select: none;
    }
    /* 드래그 시 선택 하이라이트도 보이지 않게 */
    article > div:nth-of-type(2) p::selection {
      background: transparent;
    }
  `}

        /* 연관 키워드 통째로 숨김 */
    article [aria-label="연관 키워드"] {
        display: none !important;
    }
`;

/** 카드 래퍼 — 선택해도 박스 테두리 없음 */
const CardWrap = styled.div`
    position: relative;
    border-radius: ${UI.radius.xl}px;
`;

/** 우측 상단 원형 선택 토글(선택 모드 전용) */
const SelectToggle = styled.button<{ $on?: boolean }>`
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 3;
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    border-radius: ${UI.radius.pill}px;
    border: ${({ $on }) => ($on ? "0" : "1px solid rgba(99,102,241,0.28)")};
    color: ${({ $on }) => ($on ? "#fff" : UI.color.indigo)};
    background: ${({ $on }) => ($on ? UI.color.indigo : "#fff")};
    cursor: pointer;
    line-height: 0; overflow: hidden; contain: paint; backface-visibility: hidden;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 120ms ease, border-color 120ms ease, transform 40ms ease, color 120ms ease;

    outline: none;
    &:focus { outline: none; }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }

    &:hover { background: ${({ $on }) => ($on ? UI.color.indigo : UI.color.indigo50)}; }
    &:active { transform: scale(0.98); }

    @media (pointer: coarse) { width: 40px; height: 40px; }
`;

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden="true">
        <path d="M20 7L10 17l-6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);
const Hollow = styled.span`
    width: 14px; height: 14px; border-radius: 999px; border: 2px solid ${UI.color.indigo}; display: block;
`;

/** 타이틀 옆 '미암기 ↔ 암기 완료' 토글 버튼 */
const StatusBtn = styled.button<{ $done?: boolean; $shift?: boolean }>`
    position: absolute;
    top: 20px;
    right: ${({ $shift }) => ($shift ? "56px" : "20px")}; /* 선택 토글이 있을 땐 살짝 왼쪽으로 이동 */
    z-index: 2;
    height: 28px;
    padding: 0 10px;
    border-radius: ${UI.radius.sm}px;
    border: 1px solid ${UI.color.line};
    background: ${({ $done }) => ($done ? UI.color.indigo50 : "#fff")};
    color: ${({ $done }) => ($done ? UI.color.indigo : UI.color.sub)};
    font-size: ${UI.font.tiny};
    font-weight: 700;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 120ms ease, color 120ms ease, transform 40ms ease, border-color 120ms ease;

    &:hover { background: #f9fafb; }
    &:active { transform: scale(0.98); }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.20); }
`;

/* ----- 카드별 보기 제어(학습 모드: 단어/뜻 숨김) ----- */
const LearnRow = styled.div`
    margin-top: 12px;
    margin-left: 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
`;

const LearnLabel = styled.span`
    font-size: ${UI.font.tiny};
    font-weight: 700;
    color: ${UI.color.muted};
`;

const LearnSeg = styled.div`
    display: inline-flex;
    border: 1px solid ${UI.color.line};
    border-radius: ${UI.radius.sm}px;
    overflow: hidden;
`;

const LearnBtn = styled.button<{ $active?: boolean }>`
    height: 28px;
    padding: 0 10px;
    background: ${({ $active }) => ($active ? UI.color.indigo50 : "#fff")};
    color: ${({ $active }) => ($active ? UI.color.text : UI.color.sub)};
    border: 0;
    cursor: pointer;
    font-size: ${UI.font.tiny};
    font-weight: 700;
    &:hover { background: #f9fafb; }
`;

/* 빈 상태/더보기 */
const Empty = styled.div`
    border: 1px dashed ${UI.color.line};
    border-radius: ${UI.radius.xl}px;
    padding: 32px;
    text-align: center;
    color: ${UI.color.muted};
`;

const LoadMore = styled.button`
    display: block;
    margin: 20px auto 0;
    height: 40px;
    padding: 0 16px;
    border-radius: ${UI.radius.sm}px;
    border: 1px solid ${UI.color.line};
    background: #fff;
    cursor: pointer;
`;

/* ---------- 이동(폴더 선택) 모달 재사용 ---------- */
type Notebook = { id: string; name: string };

// 전체 보기 모드: 상속/전체숨김/전체표시
type ViewMode = "inherit" | "allHidden" | "allShown";

export default function WordbookFolderPage() {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    const location = useLocation() as any;

    const [folderName, setFolderName] = React.useState<string>(location.state?.folderName ?? "내 단어장");

    const [items, setItems] = React.useState<TermItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(false);

    // 선택 모드와 선택된 항목
    const [selectMode, setSelectMode] = React.useState(false);
    const [checked, setChecked] = React.useState<Record<string, boolean>>({});
    const selectedIds = React.useMemo(() => Object.keys(checked).filter((k) => checked[k]), [checked]);
    const allOn = items.length > 0 && selectedIds.length === items.length;

    // 전체 보기 모드(마스터 스위치)
    const [titleMode, setTitleMode] = React.useState<ViewMode>("inherit");
    const [descMode, setDescMode] = React.useState<ViewMode>("inherit");

    // 카드별 보기 상태: 'none' | 'hideTitle' | 'hideDesc'
    const [cardView, setCardView] = React.useState<Record<string, "none" | "hideTitle" | "hideDesc">>({});

    // 카드별 암기 상태: 'unmemorized' | 'memorized'
    const [learn, setLearn] = React.useState<Record<string, "unmemorized" | "memorized">>({});

    // 설정 메뉴
    const [menuOpen, setMenuOpen] = React.useState(false);
    const actionsRef = React.useRef<HTMLDivElement | null>(null);

    // 이동 모달
    const [moveOpen, setMoveOpen] = React.useState(false);
    const [notebooks, setNotebooks] = React.useState<Notebook[]>([]);

    /* ------ data fetch ------ */
    const mapRow = (row: TermRow): TermItem | null => {
        const uwtId = row.userTermId ?? row.userWordbookTermId ?? row.id;
        const description = row.description ?? row.term?.description ?? row.explain ?? "";
        const termId = row.termId ?? row.term?.id ?? row.id;
        if (uwtId == null || termId == null) return null;

        const title = row.word ?? row.title ?? row.term?.title ?? "(제목 없음)";
        const createdAt = row.createdAt ?? row.created_at;
        const tags: string[] = row.tags ?? row.term?.tags ?? [];

        return { uwtId: String(uwtId), termId: String(termId), title: String(title), description: String(description), createdAt, tags };
    };

    const fetchPage = React.useCallback(async (p: number) => {
        if (!folderId) return;
        setLoading(true); setError(null);
        try {
            const res = await http.get(`/api/folders/${folderId}/terms`, {
                params: { page: p, perPage: 20, sort: "createdAt,DESC" },
                headers: { ...authHeader() },
            });
            const d = res.data ?? {};
            const raw: any[] = d.userWordbookTermList || d.items || d.content || d.terms || d.data || [];
            const list = raw.map(mapRow).filter(Boolean) as TermItem[];

            const totalPages =
                (typeof d.totalPages === "number" && d.totalPages) ||
                (typeof d.totalPage === "number" && d.totalPage) ||
                (typeof d.pages === "number" && d.pages) || 1;

            setItems((prev) => (p === 0 ? list : [...prev, ...list]));
            setHasMore(p + 1 < totalPages);

            if (typeof d.folderName === "string" && d.folderName.trim()) setFolderName(d.folderName);
        } catch (err: any) {
            const s = err?.response?.status;
            if (s === 401) navigate("/login", { state: { from: `/spoon-word/folders/${folderId}` } });
            else if (s === 404 || s === 403) setError("폴더를 찾을 수 없습니다.");
            else setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }, [folderId, navigate]);

    React.useEffect(() => {
        setPage(0);
        setChecked({});
        setSelectMode(false);
        fetchPage(0);
    }, [fetchPage]);

    /* ------ selection / bulk actions ------ */
    const toggleAll = (on: boolean) => {
        const next: Record<string, boolean> = {};
        if (on) items.forEach((it) => (next[it.uwtId] = true));
        setChecked(next);
    };

    const onToggleItem = (uwtId: string) => {
        setChecked((prev) => ({ ...prev, [uwtId]: !prev[uwtId] }));
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`선택한 ${selectedIds.length}개 용어를 삭제할까요?`)) return;
        // TODO: API 연결
        setItems((prev) => prev.filter((it) => !selectedIds.includes(it.uwtId)));
        setChecked({}); setSelectMode(false); setMenuOpen(false);
    };

    const openMove = async () => {
        if (selectedIds.length === 0) return;
        try { setNotebooks(await fetchUserFolders()); } catch { setNotebooks([]); }
        setMoveOpen(true); setMenuOpen(false);
    };

    const handleConfirmMove = async (destFolderId: string) => {
        if (selectedIds.length === 0) return;
        // TODO: API 연결
        setItems((prev) => prev.filter((it) => !selectedIds.includes(it.uwtId)));
        setChecked({}); setSelectMode(false); setMoveOpen(false);
    };

    /* ------ settings menu : outside click/esc ------ */
    React.useEffect(() => {
        if (!menuOpen) return;
        const onDocClick = (e: MouseEvent) => {
            if (!actionsRef.current) return;
            const t = e.target as Node;
            if (!actionsRef.current.contains(t)) setMenuOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => { document.removeEventListener("mousedown", onDocClick); document.removeEventListener("keydown", onEsc); };
    }, [menuOpen]);

    /* ------ render ------ */
    if (loading && items.length === 0) return <p style={{ padding: 20 }}>⏳ 불러오는 중...</p>;
    if (error) return <p style={{ color: "red", padding: 20 }}>{error}</p>;

    const onLoadMore = () => { const next = page + 1; setPage(next); fetchPage(next); };

    // 상단 버튼: 모드 순환(상속 → 전체숨김 → 전체표시 → 상속)
    const cycleTitleMode = () =>
        setTitleMode((m) => (m === "inherit" ? "allHidden" : m === "allHidden" ? "allShown" : "inherit"));
    const cycleDescMode = () =>
        setDescMode((m) => (m === "inherit" ? "allHidden" : m === "allHidden" ? "allShown" : "inherit"));

    return (
        <div style={{ padding: 8 }}>
            {/* 상단 툴바 */}
            <Toolbar>
                <Row>
                    <button type="button" onClick={() => navigate(-1)} aria-label="이전으로" style={{ border: 0, background: "transparent", cursor: "pointer" }}>
                        ←
                    </button>

                    <Title>{folderName}</Title>
                    <Count>
                        {items.length.toLocaleString()}개
                        {selectMode && selectedIds.length > 0 ? ` · 선택 ${selectedIds.length}` : ""}
                    </Count>

                    <Spacer />

                    {/* 보기 옵션(전체 적용) */}
                    <Seg aria-label="보기 옵션">
                        <SegBtn $active={titleMode !== "inherit"} onClick={cycleTitleMode}>일괄 단어 숨기기</SegBtn>
                        <SegBtn $active={descMode !== "inherit"} onClick={cycleDescMode}>일괄 뜻 숨기기</SegBtn>
                    </Seg>

                    <Actions ref={actionsRef}>
                        <SettingsBtn type="button" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen}>
                            <Gear /> 설정
                        </SettingsBtn>
                        {menuOpen && (
                            <Menu role="menu" aria-label="폴더 설정">
                                {!selectMode ? (
                                    <MenuItem role="menuitem" onClick={() => { setSelectMode(true); }}>
                                        단어 선택 시작
                                    </MenuItem>
                                ) : (
                                    <>
                                        <MenuItem role="menuitem" onClick={() => toggleAll(!allOn)}>
                                            {allOn ? "전체선택 해제" : "전체선택"}
                                        </MenuItem>
                                        <MenuItem role="menuitem" disabled={selectedIds.length === 0} onClick={openMove}>
                                            선택 항목 이동
                                        </MenuItem>
                                        <MenuItem role="menuitem" disabled={selectedIds.length === 0} onClick={handleBulkDelete}>
                                            선택 항목 삭제
                                        </MenuItem>
                                        <MenuItem role="menuitem" onClick={() => { setSelectMode(false); setChecked({}); }}>
                                            선택 종료
                                        </MenuItem>
                                    </>
                                )}
                            </Menu>
                        )}
                    </Actions>
                </Row>
            </Toolbar>

            {/* 본문 */}
            {items.length === 0 ? (
                <Empty>아직 담긴 용어가 없습니다.</Empty>
            ) : (
                <>
                    <Grid>
                        {items.map((it) => {
                            const isChecked = !!checked[it.uwtId];

                            const perCard = cardView[it.uwtId] ?? "none";
                            const hideTitleForCard =
                                titleMode === "allHidden" ? true :
                                    titleMode === "allShown" ? false :
                                        perCard === "hideTitle";

                            const hideDescForCard =
                                descMode === "allHidden" ? true :
                                    descMode === "allShown" ? false :
                                        perCard === "hideDesc";

                            // 암기 상태(타이틀 옆 버튼)
                            const status = learn[it.uwtId] ?? "unmemorized";
                            const done = status === "memorized";

                            return (
                                <CardWrap key={it.uwtId}>
                                    {/* 선택 모드일 때만 우측 상단 선택 토글 */}
                                    {selectMode && (
                                        <SelectToggle
                                            $on={isChecked}
                                            aria-label={isChecked ? "선택 해제" : "선택"}
                                            title={isChecked ? "선택 해제" : "선택"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setChecked((prev) => ({ ...prev, [it.uwtId]: !prev[it.uwtId] }));
                                            }}
                                        >
                                            {isChecked ? <CheckIcon /> : <Hollow />}
                                        </SelectToggle>
                                    )}

                                    {/* 타이틀 옆 상태 토글(미암기 ↔ 암기 완료) */}
                                    <StatusBtn
                                        $done={done}
                                        $shift={selectMode}
                                        aria-pressed={done}
                                        aria-label={done ? "암기 완료로 표시됨, 클릭하면 미암기로 전환" : "미암기로 표시됨, 클릭하면 암기 완료로 전환"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLearn((prev) => ({
                                                ...prev,
                                                [it.uwtId]: prev[it.uwtId] === "memorized" ? "unmemorized" : "memorized",
                                            }));
                                            // TODO: 서버 동기화 예시
                                            // await http.post(`/api/user-terms/${it.uwtId}/learn`, { status: newStatus }, { headers: { ...authHeader() } });
                                        }}
                                    >
                                        {done ? "암기 완료" : "미암기"}
                                    </StatusBtn>

                                    {/* TermCard 내부 + 버튼 숨김 + 보기 옵션 적용 + 연관 키워드 숨김 */}
                                    <HideTermCardAdd $hideTitle={hideTitleForCard} $hideDesc={hideDescForCard}>
                                        <TermCard
                                            id={Number(it.termId || it.uwtId)}
                                            title={it.title}
                                            description={it.description}
                                            tags={it.tags ?? []}
                                        />
                                    </HideTermCardAdd>

                                    {/* 카드별 보기 제어(학습 모드: 단어/뜻 숨김) */}
                                    <LearnRow aria-label="학습 모드">
                                        <LearnLabel>학습 모드</LearnLabel>
                                        <LearnSeg role="group" aria-label="학습 모드 선택">
                                            <LearnBtn
                                                $active={perCard === "hideTitle"}
                                                aria-pressed={perCard === "hideTitle"}
                                                onClick={() =>
                                                    setCardView((prev) => ({
                                                        ...prev,
                                                        [it.uwtId]: perCard === "hideTitle" ? "none" : "hideTitle",
                                                    }))
                                                }
                                            >
                                                단어 숨기기
                                            </LearnBtn>
                                            <LearnBtn
                                                $active={perCard === "hideDesc"}
                                                aria-pressed={perCard === "hideDesc"}
                                                onClick={() =>
                                                    setCardView((prev) => ({
                                                        ...prev,
                                                        [it.uwtId]: perCard === "hideDesc" ? "none" : "hideDesc",
                                                    }))
                                                }
                                            >
                                                뜻 숨기기
                                            </LearnBtn>
                                        </LearnSeg>
                                    </LearnRow>
                                </CardWrap>
                            );
                        })}
                    </Grid>

                    {hasMore && <LoadMore onClick={onLoadMore}>더 불러오기</LoadMore>}
                </>
            )}

            {/* 이동 모달: 기존 SpoonNoteModal 재사용 */}
            <SpoonNoteModal
                open={moveOpen}
                notebooks={notebooks}
                onClose={() => setMoveOpen(false)}
                onCreate={async (name) => {
                    const { data } = await http.post("/api/user-terms/folders", { folderName: name }, { headers: { ...authHeader() } });
                    const newId = String(data.id);
                    const newName = data.folderName ?? name;
                    setNotebooks((prev) => [{ id: newId, name: newName }, ...prev]);
                    return newId;
                }}
                onReorder={async (orderedIds) => {
                    try { await patchReorderFolders(orderedIds); } catch (e) { console.warn("[folders reorder] 실패", e); }
                }}
                onSave={handleConfirmMove}
                onGoToFolder={(fid, name) => {
                    setMoveOpen(false);
                    navigate(`/spoon-word/folders/${fid}`, { state: { folderName: name } });
                }}
            />
        </div>
    );
}
