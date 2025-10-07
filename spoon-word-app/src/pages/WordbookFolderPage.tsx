import React from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import http, { authHeader } from "../utils/http";
import SpoonNoteModal from "../components/SpoonNoteModal";
import { fetchUserFolders, patchReorderFolders } from "../api/userWordbook";
import TermCard from "../components/TermCard";
import { setMemorization, fetchMemorizationStatuses } from "../api/memorization";
import { moveFolderTerms } from "../api/userWordbookTerms";
import { renameUserFolder, deleteUserFolder } from "../api/folder";
import { generatePdfByTermIds } from "../api/ebook";
import { saveBlob } from "../utils/download";
import { sanitizeFilename } from "../utils/cdFilename";

/** 서버 응답에서 안전하게 뽑아둘 필드들 */
type TermRow = any;
type TermItem = {
    uwtId: string;
    termId: string | null;
    title: string;
    description: string;
    createdAt?: string;
    tags?: string[];
};

type Notebook = { id: string; name: string };
// 전체 보기 모드: 상속/전체숨김/전체표시
type ViewMode = "inherit" | "allHidden" | "allShown";

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
        primary: "#4F76F1",
        primaryStrong: "#3E63E0",
        danger: "#ef4444",
    },
    gradient: {
        brand: "linear-gradient(135deg, #4F76F1 0%, #3E63E0 100%)",
        brandSoft:
            "linear-gradient(135deg, rgba(79,118,241,0.12) 0%, rgba(62,99,224,0.12) 100%)",
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

const Spacer = styled.div`
    flex: 1 1 auto;
`;

const Seg = styled.div`
    display: inline-flex;
    border: 1px solid ${UI.color.line};
    border-radius: ${UI.radius.pill}px;
    overflow: hidden;
`;

const SegBtn = styled.button<{ $active?: boolean }>`
    height: 34px;
    padding: 0 12px;
    border: 0;
    cursor: pointer;
    font-weight: 700;
    color: ${({ $active }) => ($active ? "#fff" : UI.color.sub)};
    background: ${({ $active }) => ($active ? UI.gradient.brand : "#fff")};
    transition: filter 120ms ease;
    &:hover {
        filter: brightness(0.98);
    }
`;

/* ---------- 설정 버튼 + 메뉴 ---------- */
const Actions = styled.div`
    position: relative;
`;

const SettingsBtn = styled.button`
    height: 36px;
    padding: 0 12px;
    border-radius: ${UI.radius.pill}px;
    border: 1px solid ${UI.color.line};
    background: #f8fafc;
    color: ${UI.color.sub};
    font-weight: 700;
    cursor: pointer;
    transition: background-color 120ms ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    &:hover {
        background: #f1f5f9;
    }
`;

const PrimaryBtn = styled.button`
    height: 36px;
    padding: 0 14px;
    border-radius: ${UI.radius.pill}px;
    border: 0;
    background: ${UI.gradient.brand};
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transition: transform 80ms ease, filter 160ms ease;

    &:hover {
        filter: brightness(0.98);
    }
    &:active {
        transform: scale(0.98);
    }
    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(79, 118, 241, 0.35);
    }
`;

const Gear = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.94-3.5c0-.5-.05-1-.15-1.47l2.12-1.65-2-3.46-2.5 1a7.7 7.7 0 0 0-2.54-1.47l-.38-2.67h-4l-.38 2.67A7.7 7.7 0 0 0 8.5 5.95l-2.5-1-2 3.46 2.12 1.65c-.1.48-.15.97-.15 1.47s.05.99.15 1.47L4 16.12l2 3.46 2.5-1c.78.6 1.62 1.08 2.54 1.47l.38 2.67h4l.38-2.67c.92-.39 1.76-.87 2.54-1.47l2.5 1 2-3.46-2.12-1.65c-.1-.48-.15-.97-.15-1.47Z"
            fill="currentColor"
        />
    </svg>
);

const Menu = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 240px;
    background: #fff;
    border: 1px solid ${UI.color.line};
    border-radius: 12px;
    box-shadow: ${UI.shadow.menu};
    padding: 6px;
    z-index: 6;
`;

const PdfSubMenu = styled.div`
    position: absolute;
    top: 0;
    left: -8px;
    right: -8px;
    margin-top: 42px;
    background: #fff;
    border: 1px solid ${UI.color.line};
    border-radius: 12px;
    box-shadow: ${UI.shadow.menu};
    padding: 6px;
    z-index: 7;
`;

const SortSubMenu = styled(PdfSubMenu)``;

const MenuItem = styled.button<{ disabled?: boolean }>`
    width: 100%;
    text-align: left;
    border: 0;
    background: transparent;
    border-radius: 8px;
    padding: 10px 12px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    color: ${({ disabled }) => (disabled ? UI.color.muted : UI.color.text)};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    &:hover {
        background: ${({ disabled }) => (disabled ? "transparent" : "#f9fafb")};
    }
`;

const RadioItem = styled.button<{ $checked?: boolean }>`
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover {
    background: #f9fafb;
  }
  & > span:first-child {
    display: inline-flex;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid ${UI.color.primaryStrong};
    background: ${({ $checked }) => ($checked ? UI.gradient.brand : "transparent")};
  }
`;

/* ---------- 리스트/카드 ---------- */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
`;

const CHECK_W = 28;
const CHECK_GAP = 10;
const TITLE_SHIFT = CHECK_W + CHECK_GAP;

/** TermCard 내부의 + 버튼 숨김, 제목/설명 가리기, 연관 키워드 숨기기 */
const HideTermCardAdd = styled.div<{ $hideTitle?: boolean; $hideDesc?: boolean }>`
    [aria-label="내 단어장에 추가"] {
        display: none !important;
    }

    /* 제목은 항상 살짝 오른쪽으로 밀어 체크와 정렬 */
    article h3[id^="term-"] {
        margin-left: ${TITLE_SHIFT}px !important;
    }

    /* 제목 숨김 모드 */
    ${({ $hideTitle }) =>
            $hideTitle &&
            `
      article h3[id^="term-"]{
        position: relative;
        color: transparent !important;
        text-shadow: none !important;
        user-select: none;
      }
      article h3[id^="term-"]::selection { background: transparent; }
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

    ${({ $hideDesc }) =>
            $hideDesc &&
            `
      article > div:nth-of-type(2) { position: relative; }
      article > div:nth-of-type(2) p {
        color: transparent !important;
        text-shadow: none !important;
        user-select: none;
      }
      article > div:nth-of-type(2) p::selection { background: transparent; }
  `}

    article [aria-label="연관 키워드"] {
        display: none !important;
    }
`;

const CardWrap = styled.div`
  position: relative;
  border-radius: ${UI.radius.xl}px;
`;

/** 항상 보이는 좌측 체크(첨부칩 느낌) */
const SelectToggle = styled.button<{ $on?: boolean }>`
    position: absolute;
    top: 22px;
    left: 20px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: ${UI.radius.pill}px;
    border: 0;

    background: ${({ $on }) => ($on ? UI.gradient.brand : UI.gradient.brandSoft)};
    color: ${({ $on }) => ($on ? "#fff" : "#0f172a")};
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28);

    cursor: pointer;
    line-height: 0;
    overflow: hidden;
    contain: paint;
    backface-visibility: hidden;
    -webkit-tap-highlight-color: transparent;
    transition: transform 80ms ease, filter 160ms ease;

    &:hover {
        filter: brightness(0.98);
    }
    &:active {
        transform: scale(0.97);
    }
    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(79, 118, 241, 0.35);
    }
`;

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden="true">
        <path
            d="M20 7L10 17l-6-6"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

/* 비선택 점선도 동일 계열 파랑 */
const Hollow = styled.span`
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid ${UI.color.primaryStrong};
    background: rgba(255, 255, 255, 0.7);
    display: block;
`;

/** 암기 상태 칩도 동일 톤으로 */
const StatusBtn = styled.button<{ $done?: boolean }>`
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 2;

    height: 28px;
    padding: 0 12px;
    border-radius: ${UI.radius.pill}px;
    border: 0;

    font-size: ${UI.font.tiny};
    font-weight: 700;

    background: ${({ $done }) => ($done ? UI.gradient.brand : UI.gradient.brandSoft)};
    color: ${({ $done }) => ($done ? "#fff" : "#0f172a")};
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);

    cursor: pointer;
    transition: transform 80ms ease, filter 160ms ease;
    &:hover {
        filter: brightness(0.985);
    }
    &:active {
        transform: scale(0.97);
    }
    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(79, 118, 241, 0.35);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        filter: none;
    }
`;

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
    background: ${({ $active }) => ($active ? "rgba(79,118,241,0.10)" : "#fff")};
    color: ${({ $active }) => ($active ? UI.color.text : UI.color.sub)};
    border: 0;
    cursor: pointer;
    font-size: ${UI.font.tiny};
    font-weight: 700;
    &:hover {
        background: #f9fafb;
    }
`;

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

/* 하단 Export Tray */
const Tray = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 7;
  background: #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  margin-top: 10px;
`;

export default function WordbookFolderPage() {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    const location = useLocation() as any;

    const [folderName, setFolderName] = React.useState<string>(
        location.state?.folderName ?? "내 단어장"
    );

    const [items, setItems] = React.useState<TermItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(false);

    /** 선택 상태 (항상 노출되는 체크 기반) */
    const [checked, setChecked] = React.useState<Record<string, boolean>>({});
    const allOn =
        items.length > 0 &&
        Object.values(checked).length === items.length &&
        Object.values(checked).every(Boolean);

    // 전체 보기 모드(마스터 스위치)
    const [titleMode, setTitleMode] = React.useState<ViewMode>("inherit");
    const [descMode, setDescMode] = React.useState<ViewMode>("inherit");

    // 카드별 보기 상태 : 카드별로 '제목(t)'과 '뜻(d)'을 각각 show/hide/undefined로 보관
    type CardOverrides = { t?: "hide" | "show"; d?: "hide" | "show" };
    const [cardView, setCardView] = React.useState<Record<string, CardOverrides>>({});

    // 카드별 암기 상태
    const [learn, setLearn] = React.useState<Record<string, "unmemorized" | "memorized">>({});

    // ===== 정렬 상태 =====
    type SortKey = "createdAt_desc" | "title_asc" | "title_desc" | "status_asc" | "status_desc";
    const [sortMenuOpen, setSortMenuOpen] = React.useState(false);
    const [sortKey, setSortKey] = React.useState<SortKey>("createdAt_desc");

    // 저장/내보내기 진행 상태
    const [saving, setSaving] = React.useState<Record<string, boolean>>({});
    const [exporting, setExporting] = React.useState(false);

    // 설정 메뉴
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [pdfMenuOpen, setPdfMenuOpen] = React.useState(false);
    const actionsRef = React.useRef<HTMLDivElement | null>(null);

    // 이동 모달
    const [moveOpen, setMoveOpen] = React.useState(false);
    const [notebooks, setNotebooks] = React.useState<Notebook[]>([]);

    // 전역 선택 바구니: termId 기준(페이지 넘어가도 유지)
    const [selectedTermIds, setSelectedTermIds] = React.useState<Set<number>>(new Set());
    const [uwtToTerm, setUwtToTerm] = React.useState<Record<string, number | null>>({});
    const storageKey = React.useMemo(() => `wb:${folderId}:selectedTermIds`, [folderId]);

    // 선택 바구니 복원
    React.useEffect(() => {
        try {
            const raw = sessionStorage.getItem(storageKey);
            if (raw) setSelectedTermIds(new Set(JSON.parse(raw)));
        } catch {}
    }, [storageKey]);

    const persistSelected = React.useCallback(
        (next: Set<number>) => {
            setSelectedTermIds(next);
            try {
                sessionStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
            } catch {}
        },
        [storageKey]
    );

    const mapRow = (row: TermRow): TermItem | null => {
        const uwt =
            row.userWordbookTermId ??
            row.userTermId ??
            row.uwtId ??
            row.id ??
            row.user_wordbook_term_id;
        if (uwt == null) return null;

        let tId: number | null = row?.term?.id ?? row?.term_id ?? null;
        if (tId == null) {
            const rootTermId = row.termId ?? row.tid ?? row?.term?.termId;
            if (rootTermId != null && String(rootTermId) !== String(uwt)) {
                tId = Number(rootTermId);
                if (!Number.isFinite(tId)) tId = null;
            }
        }

        const title = row.word ?? row.title ?? row.term?.title ?? row.term?.word ?? "(제목 없음)";
        const description =
            row.description ?? row.term?.description ?? row.explain ?? row.meaning ?? "";
        const createdAt = row.createdAt ?? row.created_at;
        const tags: string[] = row.tags ?? row.term?.tags ?? [];

        return {
            uwtId: String(uwt),
            termId: tId != null ? String(tId) : null,
            title: String(title),
            description: String(description),
            createdAt,
            tags,
        };
    };

    const fetchPage = React.useCallback(
        async (p: number) => {
            if (!folderId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await http.get(`/folders/${folderId}/terms`, {
                    params: { page: p + 1, perPage: 20, sort: "createdAt,DESC" },
                    headers: { ...authHeader() },
                    withCredentials: true,
                });
                const d = res.data ?? {};
                const raw: any[] = d.userWordbookTermList || d.items || d.content || d.terms || d.data || [];
                const list = raw.map(mapRow).filter(Boolean) as TermItem[];

                const totalPages =
                    (typeof d.totalPages === "number" && d.totalPages) ||
                    (typeof d.totalPage === "number" && d.totalPage) ||
                    (typeof d.pages === "number" && d.pages) ||
                    1;

                setItems((prev) => (p === 0 ? list : [...prev, ...list]));
                setHasMore(p + 1 < totalPages);

                if (typeof d.folderName === "string" && d.folderName.trim())
                    setFolderName(d.folderName);
            } catch (err: any) {
                const s = err?.response?.status;
                if (s === 401) navigate("/login", { state: { from: `/spoon-word/folders/${folderId}` } });
                else if (s === 404 || s === 403) setError("폴더를 찾을 수 없습니다.");
                else setError("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        },
        [folderId, navigate]
    );

    // items 들어올 때 uwtId→termId 매핑 갱신 및 체크 동기화
    React.useEffect(() => {
        if (!items.length) return;
        setUwtToTerm((prev) => {
            const next = { ...prev };
            for (const it of items) next[it.uwtId] = it.termId ? Number(it.termId) : null;
            return next;
        });

        setChecked((prev) => {
            const next: Record<string, boolean> = { ...prev };
            for (const it of items) {
                const idNum = Number(it.termId);
                next[it.uwtId] =
                    Number.isFinite(idNum) && idNum > 0 ? selectedTermIds.has(idNum) : !!prev[it.uwtId];
            }
            return next;
        });
    }, [items, selectedTermIds]);

    // 암기 상태 초기 동기화
    React.useEffect(() => {
        if (items.length === 0) return;
        let aborted = false;
        const ids = Array.from(new Set(items.map((it) => Number(it.termId)).filter(Boolean)));

        (async () => {
            try {
                const map = await fetchMemorizationStatuses(ids);
                if (aborted || !map) return;
                setLearn((prev) => {
                    const next = { ...prev };
                    for (const it of items) {
                        const raw = map[String(it.termId)];
                        if (raw === "MEMORIZED") next[it.uwtId] = "memorized";
                        else if (raw === "LEARNING") next[it.uwtId] = "unmemorized";
                    }
                    return next;
                });
            } catch (e) {
                console.warn("[memo:init] 상태 조회 실패", e);
            }
        })();

        return () => {
            aborted = true;
        };
    }, [items]);

    /* ------ selection / bulk actions ------ */
    const onToggleItem = (uwtId: string) => {
        const currentlyOn = !!checked[uwtId];
        setChecked((prev) => ({ ...prev, [uwtId]: !currentlyOn }));

        const termId = uwtToTerm[uwtId];
        if (Number.isFinite(termId) && (termId as number) > 0) {
            const next = new Set(selectedTermIds);
            if (currentlyOn) next.delete(termId as number);
            else next.add(termId as number);
            persistSelected(next);
        }
    };

    const toggleAll = (on: boolean) => {
        const nextChecked: Record<string, boolean> = {};
        const nextSelected = new Set(selectedTermIds);
        if (on) {
            items.forEach((it) => {
                nextChecked[it.uwtId] = true;
                const id = Number(it.termId);
                if (Number.isFinite(id) && id > 0) nextSelected.add(id);
            });
        } else {
            items.forEach((it) => {
                nextChecked[it.uwtId] = false;
                const id = Number(it.termId);
                if (Number.isFinite(id) && id > 0) nextSelected.delete(id);
            });
        }
        setChecked(nextChecked);
        persistSelected(nextSelected);
    };

    const clearAllSelected = () => {
        persistSelected(new Set());
        setChecked({});
    };

    const openMove = async () => {
        const selectedCount = selectedTermIds.size;
        if (selectedCount === 0) {
            alert("먼저 단어를 선택해 주세요.");
            return;
        }
        try {
            const list = await fetchUserFolders();
            setNotebooks(list);
        } catch {
            setNotebooks([]);
        }
        setMoveOpen(true);
        setMenuOpen(false);
        setPdfMenuOpen(false);
        setSortMenuOpen(false);
    };

    // 이동 완료 핸들러
    const handleConfirmMove = async (destFolderId: string) => {
        if (!folderId) return;
        const termIds = Array.from(selectedTermIds);
        if (termIds.length === 0) {
            setMoveOpen(false);
            return;
        }

        try {
            const res = await moveFolderTerms(Number(folderId), {
                targetFolderId: Number(destFolderId),
                termIds,
            });

            const moved = new Set((res.movedTermIds ?? []).map(String));
            if (moved.size > 0) {
                // 리스트에서 제거
                setItems((prev) => prev.filter((it) => !moved.has(String(it.termId))));
                // 카운트 즉시 반영
                setCount((c) => Math.max(0, (c ?? 0) - moved.size));
            }

            setPage(0);
            await fetchPage(0);
            clearAllSelected();

            // 혹시 서버측 후처리 지연 대비 안전 리프레시
            refreshCount();
        } catch (err: any) {
            const s = err?.response?.status;
            if (s === 401) alert("로그인이 필요합니다.");
            else if (s === 403) alert("해당 폴더 접근 권한이 없습니다.");
            else if (s === 404) alert("대상/소스 폴더를 찾을 수 없습니다.");
            else alert("이동 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
            console.error("[moveFolderTerms] failed:", err);
        } finally {
            setMoveOpen(false);
        }
    };

    // 서버 카운트 상태
    const [count, setCount] = React.useState<number | null>(null);
    const fmt = (n: number) => n.toLocaleString();

    // 카운트 새로고침 함수
    const refreshCount = React.useCallback(async () => {
        if (!folderId) return;

        const parseCount = (data: any) => {
            // 다양한 스키마 대응
            if (typeof data === "number") return data;
            if (data == null) return 0;
            const keys = ["count", "termsCount", "totalCount", "total", "size", "value"];
            for (const k of keys) {
                const v = (data as any)[k];
                if (typeof v === "number") return v;
                if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) return Number(v);
            }
            // text/plain인 경우
            if (typeof data === "string" && data.trim() && !Number.isNaN(Number(data))) {
                return Number(data);
            }
            return 0;
        };

        const tryFetch = async (url: string) => {
            return http.get(url, {
                headers: { ...authHeader() },
                withCredentials: true,
                validateStatus: () => true,
            });
        };

        try {
            let res = await tryFetch(`/me/folders/${folderId}/terms/count`);
            if (res.status === 404 || res.status === 405) {
                // 클래스 레벨이 /api인 경우 대비
                res = await tryFetch(`/api/me/folders/${folderId}/terms/count`);
            }

            if (res.status === 200) {
                const value = parseCount(res.data);
                setCount(Number.isFinite(value) ? value : 0);
                return;
            }

            // 인증 실패 시 null 유지 → 상단에 …개로 표시됨
            if (res.status === 401) {
                console.warn("[count] 401", res.data);
                setCount(null);
                return;
            }

            // 권한/미존재는 0으로 표기
            if (res.status === 403 || res.status === 404) {
                console.warn("[count] ", res.status, res.data);
                setCount(0);
                return;
            }

            console.warn("[count] unexpected", res.status, res.data);
            setCount(null);
        } catch (err: any) {
            console.warn("[count] fetch error", err?.response?.status, err?.response?.data);
            setCount(null);
        }
    }, [folderId]);


    // 폴더 바뀌면 카운트/리스트 동시 초기화
    React.useEffect(() => {
        setPage(0);
        setChecked({});
        refreshCount();
        fetchPage(0);
    }, [refreshCount, fetchPage]);

    /* ------ PDF 내보내기 ------ */
    const exportByTermIds = async (termIds: number[], title: string) => {
        if (!termIds.length) {
            alert("선택한 단어가 없습니다.");
            return;
        }
        try {
            setExporting(true);
            const { blob, meta } = await generatePdfByTermIds({ termIds, title });
            if ((meta as any)?.mismatch) console.warn("[PDF Export] filename mismatch", meta);
            const preferred =
                (meta as any)?.cdFilename ||
                (meta as any)?.ebookFilename ||
                `jobspoon_terms_${Date.now()}.pdf`;
            const finalName = sanitizeFilename(preferred, `jobspoon_terms_${Date.now()}.pdf`);
            saveBlob(blob, finalName);
        } catch (e: any) {
            console.error("[PDF] export failed", e);
            alert(e?.message ?? "PDF 생성에 실패했습니다.");
        } finally {
            setExporting(false);
            setMenuOpen(false);
            setPdfMenuOpen(false);
            setSortMenuOpen(false);
        }
    };

    const generatePdfByFolder = React.useCallback(
        async (folderIdNum: number, title: string) => {
            const body = {
                folderId: folderIdNum,
                userFolderId: folderIdNum,
                userWordbookFolderId: folderIdNum,
                title,
            };

            const call = async (url: string) => {
                try {
                    const res = await http.post(url, body, {
                        headers: { ...authHeader() },
                        responseType: "blob",
                        validateStatus: () => true,
                    });

                    if (res.status >= 200 && res.status < 300) {
                        const headers = (res as any).headers || {};
                        const ebookFilename = headers["ebook-filename"] || headers["Ebook-Filename"];
                        let filename = ebookFilename || `jobspoon_terms_${Date.now()}.pdf`;

                        const cd = headers["content-disposition"] || headers["Content-Disposition"];
                        if (!ebookFilename && typeof cd === "string") {
                            const m = cd.match(/filename\*?=UTF-8''([^;]+)|filename="([^"]+)"/i);
                            const enc = m?.[1] ? decodeURIComponent(m[1]) : m?.[2] || "";
                            if (enc) filename = sanitizeFilename(enc, filename);
                        }

                        return { ok: true as const, blob: res.data as Blob, filename };
                    }

                    let serverMsg = `HTTP ${res.status}`;
                    try {
                        const text = await (res.data as Blob).text();
                        if (text) serverMsg = `${serverMsg} • ${text}`;
                    } catch {}
                    return { ok: false as const, status: res.status, message: serverMsg };
                } catch (e: any) {
                    return { ok: false as const, status: 0, message: e?.message ?? "요청 실패" };
                }
            };

            let result = await call(`/pdf/generate/by-folder`);
            if (!result.ok && result.status === 404) {
                result = await call(`/api/pdf/generate/by-folder`);
            }

            if (!result.ok) {
                if (result.status === 404) {
                    alert("폴더를 찾을 수 없거나 접근 권한이 없습니다.\n(서버 메시지) " + result.message);
                } else if (result.status === 401) {
                    alert("로그인이 필요합니다.");
                    navigate("/login", { state: { from: location.pathname } });
                } else {
                    alert("PDF 생성에 실패했습니다.\n" + result.message);
                }
                throw new Error(result.message);
            }

            return { blob: result.blob, filename: result.filename };
        },
        [navigate, location.pathname]
    );

    const handleExportSelectedPdf = async () => {
        const picked = Array.from(selectedTermIds);
        await exportByTermIds(picked, folderName);
    };

    const handleExportWholeFolderPdf = async () => {
        if (!folderId) return;
        try {
            setExporting(true);
            const { blob, filename } = await generatePdfByFolder(Number(folderId), folderName);
            saveBlob(blob, filename);
        } catch {
        } finally {
            setExporting(false);
            setMenuOpen(false);
            setPdfMenuOpen(false);
            setSortMenuOpen(false);
        }
    };

    /* ------ settings menu : outside click/esc ------ */
    React.useEffect(() => {
        if (!menuOpen) return;
        const onDocClick = (e: MouseEvent) => {
            if (!actionsRef.current) return;
            const t = e.target as Node;
            if (!actionsRef.current.contains(t)) {
                setMenuOpen(false);
                setPdfMenuOpen(false);
                setSortMenuOpen(false);
            }
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                setPdfMenuOpen(false);
                setSortMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, [menuOpen]);

    const onLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchPage(next);
    };

    const cycleTitleMode = () =>
        setTitleMode((m) => (m === "allHidden" ? "inherit" : "allHidden"));

    const cycleDescMode = () =>
        setDescMode((m) => (m === "allHidden" ? "inherit" : "allHidden"));

    const handleDeleteSelected = () => {
        if (selectedTermIds.size === 0) {
            alert("먼저 단어를 선택해 주세요.");
            return;
        }
        if (!confirm(`선택된 ${selectedTermIds.size.toLocaleString()}개 단어를 삭제할까요?`)) return;
        setItems((prev) => prev.filter((it) => !selectedTermIds.has(Number(it.termId))));
        clearAllSelected();
        setMenuOpen(false);
        setPdfMenuOpen(false);
        setSortMenuOpen(false);
    };

    // ===== 표시 목록(정렬 적용) — 훅은 항상 호출되도록 return보다 위! =====
    const displayItems = React.useMemo(() => {
        const arr = [...items];
        const byTitle = (a: TermItem, b: TermItem) =>
            a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" });
        const statusRank = (id: string) => ((learn[id] ?? "unmemorized") === "memorized" ? 1 : 0);

        switch (sortKey) {
            case "title_asc":
                arr.sort(byTitle);
                break;
            case "title_desc":
                arr.sort((a, b) => -byTitle(a, b));
                break;
            case "status_asc":
                arr.sort((a, b) => statusRank(a.uwtId) - statusRank(b.uwtId));
                break;
            case "status_desc":
                arr.sort((a, b) => statusRank(b.uwtId) - statusRank(a.uwtId));
                break;
            case "createdAt_desc":
            default:
                arr.sort((a, b) => {
                    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
                    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
                    return tb - ta;
                });
        }
        return arr;
    }, [items, learn, sortKey]);

    return (
        <div style={{ padding: 8 }}>
            {/* 상단 툴바 */}
            <Toolbar>
                <Row>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="이전으로"
                        style={{ border: 0, background: "transparent", cursor: "pointer" }}
                    >
                        ←
                    </button>

                    <Title>{folderName}</Title>
                    <Count>
                        {count === null ? `${items.length.toLocaleString()}개` : `${fmt(count)}개`}
                        {selectedTermIds.size > 0 ? ` · 선택 ${fmt(selectedTermIds.size)}` : ""}
                    </Count>

                    <Spacer />

                    {/* 전체 선택/해제 */}
                    <PrimaryBtn
                        type="button"
                        onClick={() => toggleAll(!allOn)}
                        aria-pressed={allOn}
                        title={allOn ? "전체 해제" : "전체 선택"}
                    >
                        {allOn ? "전체 해제" : "전체 선택"}
                    </PrimaryBtn>

                    {/* 보기 옵션 */}
                    <Seg aria-label="보기 옵션">
                        <SegBtn
                            $active={titleMode === "allHidden"}
                            aria-pressed={titleMode === "allHidden"}
                            onClick={cycleTitleMode}
                        >
                            {titleMode === "allHidden" ? "일괄 단어 보이기" : "일괄 단어 숨기기"}
                        </SegBtn>

                        <SegBtn
                            $active={descMode === "allHidden"}
                            aria-pressed={descMode === "allHidden"}
                            onClick={cycleDescMode}
                        >
                            {descMode === "allHidden" ? "일괄 뜻 보이기" : "일괄 뜻 숨기기"}
                        </SegBtn>
                    </Seg>

                    <Actions ref={actionsRef}>
                        <SettingsBtn
                            type="button"
                            onClick={() => {
                                setMenuOpen((v) => !v);
                                setPdfMenuOpen(false);
                                setSortMenuOpen(false);
                            }}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                        >
                            <Gear /> 설정
                        </SettingsBtn>
                        {menuOpen && (
                            <Menu role="menu" aria-label="설정">
                                <MenuItem role="menuitem" onClick={openMove}>
                                    단어 이동하기
                                </MenuItem>
                                <MenuItem role="menuitem" onClick={handleDeleteSelected}>
                                    단어 삭제하기
                                </MenuItem>

                                {/* 정렬하기 - 서브메뉴 */}
                                <div style={{ position: "relative" }}>
                                    <MenuItem
                                        role="menuitem"
                                        aria-haspopup="menu"
                                        aria-expanded={sortMenuOpen}
                                        onClick={() => {
                                            setSortMenuOpen((v) => !v);
                                            setPdfMenuOpen(false);
                                        }}
                                    >
                                        정렬하기 <span aria-hidden="true">›</span>
                                    </MenuItem>
                                    {sortMenuOpen && (
                                        <SortSubMenu role="menu" aria-label="정렬하기">
                                            <RadioItem
                                                $checked={sortKey === "createdAt_desc"}
                                                onClick={() => {
                                                    setSortKey("createdAt_desc");
                                                    setMenuOpen(false);
                                                    setSortMenuOpen(false);
                                                }}
                                            >
                                                <span /> 최신 등록순
                                            </RadioItem>
                                            <RadioItem
                                                $checked={sortKey === "title_asc"}
                                                onClick={() => {
                                                    setSortKey("title_asc");
                                                    setMenuOpen(false);
                                                    setSortMenuOpen(false);
                                                }}
                                            >
                                                <span /> 제목 오름차순
                                            </RadioItem>
                                            <RadioItem
                                                $checked={sortKey === "title_desc"}
                                                onClick={() => {
                                                    setSortKey("title_desc");
                                                    setMenuOpen(false);
                                                    setSortMenuOpen(false);
                                                }}
                                            >
                                                <span /> 제목 내림차순
                                            </RadioItem>
                                            <RadioItem
                                                $checked={sortKey === "status_asc"}
                                                onClick={() => {
                                                    setSortKey("status_asc");
                                                    setMenuOpen(false);
                                                    setSortMenuOpen(false);
                                                }}
                                            >
                                                <span /> 상태: 미암기 → 완료
                                            </RadioItem>
                                            <RadioItem
                                                $checked={sortKey === "status_desc"}
                                                onClick={() => {
                                                    setSortKey("status_desc");
                                                    setMenuOpen(false);
                                                    setSortMenuOpen(false);
                                                }}
                                            >
                                                <span /> 상태: 완료 → 미암기
                                            </RadioItem>
                                        </SortSubMenu>
                                    )}
                                </div>

                                {/* PDF 내보내기 - 서브메뉴 */}
                                <div style={{ position: "relative" }}>
                                    <MenuItem
                                        role="menuitem"
                                        onClick={() => setPdfMenuOpen((v) => !v)}
                                        aria-haspopup="menu"
                                        aria-expanded={pdfMenuOpen}
                                    >
                                        PDF 내보내기 <span aria-hidden="true">›</span>
                                    </MenuItem>
                                    {pdfMenuOpen && (
                                        <PdfSubMenu role="menu" aria-label="PDF 내보내기 옵션">
                                            <MenuItem onClick={handleExportSelectedPdf}>내가 선택한 단어만 내보내기</MenuItem>
                                            <MenuItem onClick={handleExportWholeFolderPdf}>단어장 폴더 전체 내보내기</MenuItem>
                                        </PdfSubMenu>
                                    )}
                                </div>
                            </Menu>
                        )}
                    </Actions>
                </Row>
            </Toolbar>

            {/* 본문 */}
            {error ? (
                <p style={{ color: "red", padding: 20 }}>{error}</p>
            ) : loading && items.length === 0 ? (
                <p style={{ padding: 20 }}>⏳ 불러오는 중...</p>
            ) : items.length === 0 ? (
                <Empty>아직 담긴 용어가 없습니다.</Empty>
            ) : (
                <>
                    <Grid>
                        {displayItems.map((it) => {
                            const ov = cardView[it.uwtId] || {};

                            const titleHidden =
                                ov.t === "hide"
                                    ? true
                                    : ov.t === "show"
                                        ? false
                                        : titleMode === "allHidden"
                                            ? true
                                            : titleMode === "allShown"
                                                ? false
                                                : false;
                            const descHidden =
                                ov.d === "hide"
                                    ? true
                                    : ov.d === "show"
                                        ? false
                                        : descMode === "allHidden"
                                            ? true
                                            : descMode === "allShown"
                                                ? false
                                                : false;

                            const isChecked = !!checked[it.uwtId];
                            const status = learn[it.uwtId] ?? "unmemorized";
                            const done = status === "memorized";
                            const isSaving = !!saving[it.uwtId];

                            return (
                                <CardWrap key={it.uwtId}>
                                    <SelectToggle
                                        $on={isChecked}
                                        aria-label={isChecked ? "선택 해제" : "선택"}
                                        title={isChecked ? "선택 해제" : "선택"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleItem(it.uwtId);
                                        }}
                                    >
                                        {isChecked ? <CheckIcon /> : <Hollow />}
                                    </SelectToggle>

                                    <StatusBtn
                                        $done={done}
                                        disabled={isSaving}
                                        aria-busy={isSaving}
                                        aria-pressed={done}
                                        aria-label={
                                            done
                                                ? "암기 완료로 표시됨, 클릭하면 미암기로 전환"
                                                : "미암기로 표시됨, 클릭하면 암기 완료로 전환"
                                        }
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (isSaving) return;

                                            const prev = learn[it.uwtId] ?? "unmemorized";
                                            const nextLocal = prev === "memorized" ? "unmemorized" : "memorized";

                                            setLearn((m) => ({ ...m, [it.uwtId]: nextLocal }));
                                            setSaving((m) => ({ ...m, [it.uwtId]: true }));
                                            try {
                                                await setMemorization({
                                                    termId: it.termId ?? undefined,
                                                    userTermId: it.uwtId,
                                                    done: nextLocal === "memorized",
                                                });
                                            } catch (err: any) {
                                                setLearn((m) => ({ ...m, [it.uwtId]: prev }));
                                                const s = err?.response?.status;
                                                if (s === 401) {
                                                    alert("로그인이 필요합니다.");
                                                    navigate("/login", { state: { from: location.pathname } });
                                                } else if (s === 404) {
                                                    alert("용어를 찾을 수 없습니다.");
                                                } else {
                                                    alert("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
                                                    console.error("[memorization:toggle] failed:", err);
                                                }
                                            } finally {
                                                setSaving((m) => ({ ...m, [it.uwtId]: false }));
                                            }
                                        }}
                                    >
                                        {done ? "암기 완료" : "미암기"}
                                    </StatusBtn>

                                    <HideTermCardAdd $hideTitle={titleHidden} $hideDesc={descHidden}>
                                        <TermCard
                                            id={Number(it.termId || it.uwtId)}
                                            title={it.title}
                                            description={it.description}
                                            tags={it.tags ?? []}
                                        />
                                    </HideTermCardAdd>

                                    <LearnRow aria-label="학습 모드">
                                        <LearnLabel>학습 모드</LearnLabel>
                                        <LearnSeg role="group" aria-label="학습 모드 선택">
                                            <LearnBtn
                                                $active={titleHidden}
                                                aria-pressed={titleHidden}
                                                onClick={() => {
                                                    setCardView((prev) => {
                                                        const cur = prev[it.uwtId] || {};
                                                        if (titleMode === "allHidden") {
                                                            const nextT = cur.t === "show" ? undefined : "show";
                                                            return { ...prev, [it.uwtId]: { ...cur, t: nextT } };
                                                        }
                                                        if (titleMode === "allShown") {
                                                            const nextT = cur.t === "hide" ? undefined : "hide";
                                                            return { ...prev, [it.uwtId]: { ...cur, t: nextT } };
                                                        }
                                                        const nextT = cur.t === "hide" ? undefined : "hide";
                                                        return { ...prev, [it.uwtId]: { ...cur, t: nextT } };
                                                    });
                                                }}
                                            >
                                                {titleHidden ? "단어 보이기" : "단어 숨기기"}
                                            </LearnBtn>

                                            <LearnBtn
                                                $active={descHidden}
                                                aria-pressed={descHidden}
                                                onClick={() => {
                                                    setCardView((prev) => {
                                                        const cur = prev[it.uwtId] || {};
                                                        if (descMode === "allHidden") {
                                                            const nextD = cur.d === "show" ? undefined : "show";
                                                            return { ...prev, [it.uwtId]: { ...cur, d: nextD } };
                                                        }
                                                        if (descMode === "allShown") {
                                                            const nextD = cur.d === "hide" ? undefined : "hide";
                                                            return { ...prev, [it.uwtId]: { ...cur, d: nextD } };
                                                        }
                                                        const nextD = cur.d === "hide" ? undefined : "hide";
                                                        return { ...prev, [it.uwtId]: { ...cur, d: nextD } };
                                                    });
                                                }}
                                            >
                                                {descHidden ? "뜻 보이기" : "뜻 숨기기"}
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

            {/* 하단 Export Tray */}
            {selectedTermIds.size > 0 && (
                <Tray>
          <span>
            선택 {selectedTermIds.size.toLocaleString()}개 — 필요한 페이지를 더 불러온 뒤에도 선택은 유지돼요.
          </span>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={clearAllSelected}
                            style={{
                                border: `1px solid ${UI.color.line}`,
                                background: "transparent",
                                color: "#fff",
                                padding: "8px 12px",
                                borderRadius: 8,
                                fontWeight: 700,
                            }}
                        >
                            모두 해제
                        </button>
                        <button
                            onClick={handleExportSelectedPdf}
                            disabled={exporting}
                            style={{
                                border: 0,
                                background: "linear-gradient(135deg, #4F76F1 0%, #3E63E0 100%)",
                                color: "#fff",
                                padding: "8px 14px",
                                borderRadius: 999,
                                fontWeight: 700,
                                letterSpacing: "0.01em",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                                opacity: exporting ? 0.85 : 1,
                            }}
                        >
                            {exporting ? "내보내는 중..." : "선택 항목 PDF 내보내기"}
                        </button>
                    </div>
                </Tray>
            )}

            {/* 이동 모달 */}
            <SpoonNoteModal
                open={moveOpen}
                notebooks={notebooks}
                onClose={() => setMoveOpen(false)}
                onCreate={async (name) => {
                    const { data } = await http.post("/me/folders", { folderName: name }, { headers: { ...authHeader() } });
                    const newId = String(data.id);
                    const newName = data.folderName ?? name;
                    setNotebooks((prev) => [{ id: newId, name: newName }, ...prev]);
                    return newId;
                }}
                onReorder={async (orderedIds) => {
                    try {
                        await patchReorderFolders(orderedIds);
                        const refreshed = await fetchUserFolders();
                        setNotebooks(refreshed);
                    } catch (e) {
                        console.warn("[folders reorder] 실패", e);
                    }
                }}
                onSave={handleConfirmMove}
                onGoToFolder={(fid, name) => {
                    setMoveOpen(false);
                    navigate(`/spoon-word/folders/${fid}`, { state: { folderName: name } });
                }}
                onRename={async (folderId, newName) => {
                    await renameUserFolder(folderId, newName);
                    setNotebooks((prev) => prev.map((n) => (n.id === folderId ? { ...n, name: newName } : n)));
                }}
                onRequestDelete={async (fid) => {
                    await deleteUserFolder(fid, "purge");
                    setNotebooks(await fetchUserFolders());
                }}
                onRequestBulkDelete={async (ids) => {
                    if (!confirm(`선택 ${ids.length}개 폴더 삭제? (안의 용어도 삭제)`)) return;
                    setNotebooks(await fetchUserFolders());
                }}
            />
        </div>
    );
}
