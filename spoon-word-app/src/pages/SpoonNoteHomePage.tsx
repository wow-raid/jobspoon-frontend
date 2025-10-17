import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import http from "../utils/http";
import { fetchUserFolders } from "../api/userWordbook";
import { goToAccountLogin } from "../utils/auth";
import { NarrowLeft } from "../styles/layout";

/* ===== UI tokens (WordbookFolderPage와 일치) ===== */
const UI = {
    color: {
        bg: "#ffffff",
        text: "#111827",
        muted: "#6b7280",
        line: "#e5e7eb",
        primary: "#4F76F1",
        primaryStrong: "#3E63E0",
        indigo50: "#eef2ff",
        indigo200: "#c7d2fe",
    },
    gradient: {
        brand: "linear-gradient(135deg, #4F76F1 0%, #3E63E0 100%)",
    },
    radius: { xl: 20, lg: 14, md: 12, sm: 10, pill: 999 },
    shadow: {
        card: "0 1px 0 rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.06)",
        bar: "0 6px 20px rgba(0,0,0,0.06)",
        menu: "0 8px 24px rgba(0,0,0,0.12)",
    },
    font: { h2: "22px", body: "15px", tiny: "12px" },
};

/* ===== 상단 툴바 (WordbookFolderPage 스타일) ===== */
const Toolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  background: ${UI.color.bg};
  padding: 12px 8px;
  margin-bottom: 16px;
`;

const RowFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackBtn = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 6px 8px;
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
  font-weight: 400;
  letter-spacing: -0.02em;
  color: ${UI.color.muted};
  line-height: 1;
`;

const Spacer = styled.div` flex: 1 1 auto; `;

/* ===== 인라인 정렬 팝업 (WordbookFolderPage 포맷) ===== */
const SortInlineWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  isolation: isolate;
`;
const SortInlineBtn = styled.button`
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: ${UI.font.body};
  font-weight: 400;
  letter-spacing: -0.02em;
  color: ${UI.color.muted};
  cursor: pointer;
  line-height: 1;
  border-radius: ${UI.radius.pill}px;
  -webkit-tap-highlight-color: transparent;

  &::after{
    content:"";
    position:absolute; inset:-6px -10px;
    background:#fafafa; border-radius:10px; opacity:0;
    transition:opacity .12s ease; pointer-events:none;
  }
  &:hover::after,
  &:focus-visible::after,
  &[aria-expanded="true"]::after { opacity:1; }
  &:focus-visible { outline:none; box-shadow:0 0 0 3px rgba(79,118,241,.25); }
`;
const SortPopup = styled.div`
  position: absolute;
  top: 22px; left: -8px;
  min-width: 200px;
  background: #fff;
  border: 1px solid ${UI.color.line};
  border-radius: 12px;
  box-shadow: ${UI.shadow.menu};
  padding: 6px; z-index: 8;
`;
const RadioItem = styled.button<{ $checked?: boolean }>`
  width: 100%;
  text-align: left;
  border: 0; background: transparent;
  border-radius: 8px; padding: 10px 12px; cursor: pointer;
  display:flex; align-items:center; gap:10px;
  &:hover{ background:#f9fafb; }
  & > span:first-child{
    display:inline-flex; width:16px; height:16px; border-radius:999px;
    border:2px solid ${UI.color.primaryStrong};
    background: ${({$checked}) => $checked ? UI.gradient.brand : "transparent"};
  }
`;
const Sep = styled.span` margin: 0 8px; color: ${UI.color.muted}; `;

/* ===== 검색/버튼 ===== */
const SearchInput = styled.input`
  width: 280px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid ${UI.color.line};
  padding: 0 12px 0 36px;
  background: #fff url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='7' stroke='%239aa0a6' stroke-width='2'/%3E%3Cpath d='M20 20l-3.2-3.2' stroke='%239aa0a6' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat 10px 50%;
  font-size: 14px;
  &:focus { outline: none; border-color: ${UI.color.primaryStrong}; box-shadow: 0 0 0 3px rgba(62,99,224,.16); }
`;

const Primary = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid ${UI.color.primary};
  background: ${UI.color.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: filter .15s ease, transform .08s ease;
  &:hover{ filter: brightness(.96); }
  &:active{ transform: translateY(1px); }
  &:focus-visible{ outline: none; box-shadow: 0 0 0 3px rgba(79,118,241,.25); }
`;

/* ===== 목록 패널 ===== */
const Panel = styled.div`
  border: 1px solid ${UI.color.line};
  border-radius: 12px;
  background: #fff;
  box-shadow: ${UI.shadow.card};
  overflow: hidden;
`;

const HeadRow = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 120px 220px 160px 48px;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid #eef2f7;
  background: #f8fafc;
  font-weight: 750;
  letter-spacing: -0.02em;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 120px 220px 160px 48px;
  align-items: center;
  gap: 8px;
  padding: 18px;
  border-bottom: 1px solid #eef2f7;
  &:last-child { border-bottom: 0; }
`;

const Cell = styled.div<{ $muted?: boolean }>`
  color: ${({ $muted }) => ($muted ? UI.color.muted : UI.color.text)};
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
    appearance: none;
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 3px;
    border: 1px solid #e6ebf2;
    background: linear-gradient(180deg, #f7f9fc 0%, #f3f6fb 100%);
    background-clip: padding-box;
    display: inline-grid;
    place-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    box-shadow: none;
    transition:
            border-color .15s ease,
            background-color .15s ease,
            transform .08s ease;

    &:hover {
        background: linear-gradient(180deg, #f8fbff 0%, #f1f5ff 100%);
    }
    &:active { transform: scale(.98); }

    &:focus-visible {
        outline: 2px solid rgba(79,118,241,.55);
        outline-offset: 2px;
    }

    &::after {
        content: "";
        width: 12px;
        height: 12px;
        background: center / contain no-repeat
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 7L10 17l-6-6' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        opacity: 0;
        transform: scale(.96);
        transition: opacity .06s ease-out, transform .06s ease-out;
    }

    &:checked {
        border-color: ${UI.color.primaryStrong};
        background: ${UI.gradient.brand};
    }
    &:checked::after {
        opacity: 1;
        transform: scale(1);
    }

    &:indeterminate{
        border-color: ${UI.color.primaryStrong};
        background: linear-gradient(180deg, #f7f9fc 0%, #eef3ff 100%);
    }
    &:indeterminate::after{
        content: "";
        width: 10px;
        height: 2px;
        border-radius: 2px;
        background: ${UI.color.primaryStrong};
        opacity: 1;
        transform: none;
    }
`;


const FolderName = styled.button`
  appearance: none; border: 0; background: transparent;
  font-size: 18px; font-weight: 700; letter-spacing: -0.02em;
  text-align: left; cursor: pointer; color: ${UI.color.text};
  &:hover { text-decoration: underline; }
`;

/* 진행률 바 · 컬러 통일 */
const ProgressBar = styled.div`
    width: 100%;
    height: 26px;
    border-radius: 999px;
    background: #eef2f7;
    position: relative;
    overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
    position: absolute;
    inset: 0 auto 0 0;
    width: ${({ $pct }) => Math.max(0, Math.min(100, $pct))}%;
    background: ${UI.color.primary};
    z-index: 0; /* ← 바는 아래 */
`;

const ProgressText = styled.div<{ $pct: number }>`
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    /* 진행률 낮으면(회색 바 위) 진한 텍스트, 높으면(파란 바 위) 흰 텍스트 */
    color: ${({ $pct }) => ($pct < 45 ? UI.color.text : "#fff")};
    font-weight: 600;
    font-size: 13px;
    text-shadow: none;
    z-index: 1;
    pointer-events: none;
`;

const Kebab = styled.button`
  appearance: none; border: 0; background: transparent;
  font-size: 22px; line-height: 1; cursor: pointer; color: ${UI.color.muted};
`;

// 가운데 정렬 셀 + 진행률 열용 스택 추가
const CellCenter = styled(Cell)`
  text-align: center;
`;

const CenterStack = styled.div`
    display: grid;
    gap: 6px;
    justify-items: stretch;   
    text-align: center;
`;

/* ===== Types ===== */
type Folder = {
    id: string | number;
    name: string;
    termCount?: number;
    learnedCount?: number;
    updatedAt?: string;
};

/* ===== Utils ===== */
function formatKR(dateIso?: string) {
    if (!dateIso) return "-";
    try {
        const d = new Date(dateIso);
        return `${d.getMonth() + 1}월 ${d.getDate()}일`;
    } catch {
        return "-";
    }
}

/* ===== Page ===== */
type SortKey = "title_asc" | "updated_desc" | "updated_asc" | "terms_desc" | "terms_asc";

export default function SpoonNoteHomePage() {
    const nav = useNavigate();
    const location = useLocation();

    // 로그인 가드
    React.useEffect(() => {
        const loggedIn = !!localStorage.getItem("isLoggedIn");
        if (!loggedIn) {
            goToAccountLogin(location.pathname + location.search);
        }
    }, [location.pathname, location.search]);

    // 목록
    const [all, setAll] = React.useState<Folder[]>([]);
    const [q, setQ] = React.useState("");
    const [sortKey, setSortKey] = React.useState<SortKey>("updated_desc");
    const [sortOpen, setSortOpen] = React.useState(false);

    React.useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                const list = await fetchUserFolders();
                if (cancel) return;

                const todayIso = new Date().toISOString();
                const normalized: Folder[] = (list || []).map((f: any) => ({
                    id: f.id,
                    name: f.name ?? f.folderName ?? "이름없음",
                    termCount: f.termCount ?? 0,
                    learnedCount: f.learnedCount ?? 0,
                    updatedAt: f.updatedAt ?? todayIso,
                }));
                setAll(normalized);
            } catch (e) {
                console.warn("[notes] fetchUserFolders 실패:", e);
                setAll([]);
            }
        })();
        return () => { cancel = true; };
    }, []);

    const filtered = React.useMemo(() => {
        const key = q.trim().toLowerCase();
        if (!key) return all;
        return all.filter((f) => (f.name || "").toLowerCase().includes(key));
    }, [all, q]);

    const display = React.useMemo(() => {
        const arr = [...filtered];
        const byTitle = (a: Folder, b: Folder) => (a.name || "").localeCompare(b.name || "", "ko");
        const byUpdated = (a: Folder, b: Folder) => Date.parse(b.updatedAt || "") - Date.parse(a.updatedAt || "");
        const byTerms = (a: Folder, b: Folder) => (b.termCount || 0) - (a.termCount || 0);

        switch (sortKey) {
            case "title_asc":    arr.sort(byTitle); break;
            case "updated_asc":  arr.sort((a,b)=>-byUpdated(a,b)); break;
            case "terms_desc":   arr.sort(byTerms); break;
            case "terms_asc":    arr.sort((a,b)=>-byTerms(a,b)); break;
            case "updated_desc":
            default:             arr.sort(byUpdated);
        }
        return arr;
    }, [filtered, sortKey]);

    // 선택(체크박스)
    const [selected, setSelected] = React.useState<Set<string | number>>(new Set());

    // 마스터 체크박스 ref + indeterminate 동기화
    const masterRef = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
        if (!masterRef.current) return;
        masterRef.current.indeterminate =
            selected.size > 0 && selected.size < display.length;
    }, [selected.size, display.length]);

    const toggleAll = (checked: boolean) => {
        setSelected(checked ? new Set(display.map((f) => f.id)) : new Set());
    };
    const toggleOne = (id: string | number, checked: boolean) => {
        setSelected((prev) => {
            const next = new Set(prev);
            checked ? next.add(id) : next.delete(id);
            return next;
        });
    };

    const createFolder = async () => {
        const name = window.prompt("새 폴더 이름을 입력하세요.");
        if (!name) return;
        try {
            const { data } = await http.post("/me/folders", { folderName: name });
            setAll((prev) => [
                { id: data.id, name: data.folderName ?? name, termCount: 0, learnedCount: 0, updatedAt: new Date().toISOString() },
                ...prev,
            ]);
        } catch (e: any) {
            alert(e?.response?.data?.message || "폴더 생성에 실패했습니다.");
        }
    };

    const sortLabel = React.useMemo(() => {
        switch (sortKey) {
            case "title_asc": return "제목순";
            case "updated_asc": return "오래된 업데이트";
            case "terms_desc": return "단어 수 많은순";
            case "terms_asc": return "단어 수 적은순";
            case "updated_desc":
            default: return "최근 업데이트";
        }
    }, [sortKey]);

    return (
        <NarrowLeft style={{ padding: "8px 0 24px" }}>
            {/* 상단 툴바 */}
            <Toolbar>
                <RowFlex>
                    <BackBtn onClick={() => nav(-1)} aria-label="뒤로 가기">←</BackBtn>

                    <Title>내 스푼노트</Title>
                    <Count>{display.length}개</Count>

                    <Sep aria-hidden>|</Sep>

                    <SortInlineWrap>
                        <SortInlineBtn
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={sortOpen}
                            onClick={() => setSortOpen(v => !v)}
                        >
                            {sortLabel}
                        </SortInlineBtn>

                        {sortOpen && (
                            <SortPopup role="menu" aria-label="정렬하기">
                                <RadioItem $checked={sortKey === "updated_desc"} onClick={() => { setSortKey("updated_desc"); setSortOpen(false); }}>
                                    <span /> 최근 업데이트
                                </RadioItem>
                                <RadioItem $checked={sortKey === "updated_asc"} onClick={() => { setSortKey("updated_asc"); setSortOpen(false); }}>
                                    <span /> 오래된 업데이트
                                </RadioItem>
                                <RadioItem $checked={sortKey === "title_asc"} onClick={() => { setSortKey("title_asc"); setSortOpen(false); }}>
                                    <span /> 제목순
                                </RadioItem>
                                <RadioItem $checked={sortKey === "terms_desc"} onClick={() => { setSortKey("terms_desc"); setSortOpen(false); }}>
                                    <span /> 단어 수 많은순
                                </RadioItem>
                                <RadioItem $checked={sortKey === "terms_asc"} onClick={() => { setSortKey("terms_asc"); setSortOpen(false); }}>
                                    <span /> 단어 수 적은순
                                </RadioItem>
                            </SortPopup>
                        )}
                    </SortInlineWrap>

                    <Spacer />

                    <RowFlex>
                        <SearchInput
                            placeholder="폴더 검색"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <Primary onClick={createFolder}>+ 새 폴더</Primary>
                    </RowFlex>
                </RowFlex>
            </Toolbar>

            {/* 목록 */}
            <Panel role="table" aria-label="폴더 목록">
                <HeadRow role="row">
                    <Cell>
                        <Checkbox
                            ref={masterRef}
                            aria-label="전체 선택"
                            checked={selected.size === display.length && display.length > 0}
                            onChange={(e) => toggleAll(e.currentTarget.checked)}
                        />
                    </Cell>
                    <Cell>선택 항목</Cell>
                    <CellCenter>단어 수</CellCenter>
                    <CellCenter>학습 완료율</CellCenter>
                    <CellCenter>최근 업데이트</CellCenter>
                    <Cell />
                </HeadRow>

                {display.map((f) => {
                    const total = f.termCount ?? 0;
                    const done = f.learnedCount ?? 0;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                    return (
                        <Row key={f.id} role="row">
                            <Cell>
                                <Checkbox
                                    aria-label={`${f.name} 선택`}
                                    checked={selected.has(f.id)}
                                    onChange={(e) => toggleOne(f.id, e.currentTarget.checked)}
                                />
                            </Cell>

                            <Cell>
                                <FolderName
                                    onClick={() => nav(`/spoon-word/folders/${f.id}`, { state: { folderName: f.name } })}
                                    aria-label={`${f.name} 폴더 열기`}
                                >
                                    {f.name}
                                </FolderName>
                            </Cell>

                            {/* 단어 수 */}
                            <CellCenter>{total}</CellCenter>

                            {/* 학습 완료율 */}
                            <CellCenter>
                                <CenterStack>
                                    <span style={{ color: UI.color.muted, fontWeight: 600 }}>
                                        {done}/{total}
                                    </span>
                                    <ProgressBar aria-label="학습 진행률">
                                        <ProgressFill $pct={pct} />
                                        <ProgressText $pct={pct}>{pct}%</ProgressText>
                                    </ProgressBar>
                                </CenterStack>
                            </CellCenter>

                            {/* 최근 업데이트 */}
                            <CellCenter>{formatKR(f.updatedAt)}</CellCenter>

                            <Cell style={{ textAlign: "right" }}>
                                <Kebab aria-label="더보기">⋯</Kebab>
                            </Cell>
                        </Row>
                    );
                })}
            </Panel>
        </NarrowLeft>
    );
}
