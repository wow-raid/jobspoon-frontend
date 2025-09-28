import React from "react";
import styled from "styled-components";
import { useSearchParams, useNavigationType, useNavigate } from "react-router-dom";
import http from "../utils/http";
import { fetchTermsByTag } from "../api/termApi";   // 태그 전용 API
import TermCardWithTagsLazy from "../components/TermCardWithTagsLazy";

// 단어장 모달 & 폴더 관련 API
import SpoonNoteModal from "../components/SpoonNoteModal";
import { fetchUserFolders, patchReorderFolders } from "../api/userWordbook";
import { deleteUserFolder, deleteUserFoldersBulk, renameUserFolder} from "../api/folder";

/** 타입 정의 */
type Term = { id: number; title: string; description: string; tags?: string[] };
type ApiItem = {
    id: number | string;
    title: string;
    description?: string | null;
    tags?: string[] | null;
    relatedKeywords?: string[] | null;
    tagNames?: string[] | null;
    termTags?: Array<{ tag?: { name?: string }; name?: string }>;
    tagsCsv?: string | null;
};
type ApiResponse = {
    q?: string; page?: number; size?: number; total?: number;
    items?: ApiItem[]; content?: ApiItem[]; totalElements?: number;
};
type CacheData = { q: string; items: Term[]; total: number; scrollY?: number };

// 모달용 타입
type Notebook = { id: string; name: string };

/** 세션 캐시 유틸 */
const readCache = (k: string): CacheData | null => { try { const r = sessionStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } };
const writeCache = (k: string, d: CacheData) => { try { sessionStorage.setItem(k, JSON.stringify(d)); } catch {} };

/** 디자인 토큰 */
const TOKENS = {
    color: {
        text: "#374151",
        textMuted: "#6b7280",
        textBlue: "#2563eb",
        red: "#dc2626",
        bg: "#ffffff",
        border: "#e5e7eb",
        chipBg: "#eef2ff",
        chipBorder: "#c7d2fe",
    },
    space: (n: number) => `${n}px`,
    font: { base: "14px", small: "12px", strong: 600 },
    radius: 14,
    shadow: { xl: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" },
} as const;

/* ---------------------- styled-components ---------------------- */
const Root = styled.div` margin-top: ${TOKENS.space(16)}; `;

const InfoRow = styled.div`
    margin-top: 0;
    display: flex;
    align-items: center;
    gap: ${TOKENS.space(8)};
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    font-size: ${TOKENS.font.base};
    color: ${TOKENS.color.textMuted};
`;

const InfoStrongNum = styled.span`
    font-weight: ${TOKENS.font.strong};
    color: ${TOKENS.color.textBlue};
`;

const Chip = styled.span`
    display: inline-flex;
    align-items: center;
    gap: ${TOKENS.space(6)};
    border-radius: ${TOKENS.radius}px;
    background: ${TOKENS.color.chipBg};
    border: 1px solid ${TOKENS.color.chipBorder};
    padding: ${TOKENS.space(4)} ${TOKENS.space(8)};
    font-size: ${TOKENS.font.small};
    color: ${TOKENS.color.textBlue};
    font-weight: 700;
    flex: 0 0 auto;
`;

const Tail = styled.span` flex: 0 0 auto; `;
const LoadingMsg = styled.div` margin-top: ${TOKENS.space(16)}; color: ${TOKENS.color.textMuted}; `;
const ErrorMsg = styled.div` margin-top: ${TOKENS.space(16)}; color: ${TOKENS.color.red}; `;
const List = styled.ul` margin-top: ${TOKENS.space(16)}; padding: 0; list-style: none; `;
const ListItem = styled.li` & + & { margin-top: ${TOKENS.space(16)}; } `;

/* ---------- Pagination ---------- */
type PaginationProps = {
    page: number; size: number; total: number;
    onChange: (nextPageZeroBased: number) => void;
};
const PaginationNav = styled.nav`
    margin-top: ${TOKENS.space(16)};
    display: flex; align-items: center; justify-content: center;
    gap: ${TOKENS.space(8)}; user-select: none;
`;
const PageNumBtn = styled.button<{ $active: boolean }>`
    min-width: 34px; height: 34px; padding: 0 10px; border-radius: 999px;
    border: 1px solid ${({ $active }) => ($active ? TOKENS.color.textBlue : TOKENS.color.border)};
    background: ${({ $active }) => ($active ? TOKENS.color.textBlue : "#fff")};
    color: ${({ $active }) => ($active ? "#fff" : TOKENS.color.text)};
    font-weight: ${({ $active }) => ($active ? 700 : 600)};
    cursor: pointer;
`;
const NavBtn = styled.button<{ $disabled: boolean }>`
    width: 34px; height: 34px; border-radius: 999px; border: 1px solid ${TOKENS.color.border};
    background: #fff; color: ${({ $disabled }) => ($disabled ? "#c7c7c7" : TOKENS.color.text)};
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
    display: inline-flex; align-items: center; justify-content: center;
`;

const Pagination: React.FC<PaginationProps> = ({ page, size, total, onChange }) => {
    const totalPages = Math.max(1, Math.ceil((total || 0) / (size || 1)));
    const current = page + 1; // 1-base
    const maxNumbers = 10;

    let start = Math.max(1, current - Math.floor(maxNumbers / 2));
    let end = Math.min(totalPages, start + maxNumbers - 1);
    start = Math.max(1, end - maxNumbers + 1);

    const nums: number[] = [];
    for (let i = start; i <= end; i++) nums.push(i);

    const go = (p1: number) => {
        if (p1 < 1 || p1 > totalPages || p1 === current) return;
        onChange(p1 - 1);
    };

    return (
        <PaginationNav aria-label="페이지네이션">
            <NavBtn aria-label="처음" onClick={() => go(1)} disabled={current === 1} $disabled={current === 1}>«</NavBtn>
            <NavBtn aria-label="이전" onClick={() => go(current - 1)} disabled={current === 1} $disabled={current === 1}>‹</NavBtn>
            {nums.map((n) => (
                <PageNumBtn key={n} onClick={() => go(n)} aria-current={n === current ? "page" : undefined} $active={n === current}>
                    {n}
                </PageNumBtn>
            ))}
            <NavBtn aria-label="다음" onClick={() => go(current + 1)} disabled={current === totalPages} $disabled={current === totalPages}>›</NavBtn>
            <NavBtn aria-label="마지막" onClick={() => go(totalPages)} disabled={current === totalPages} $disabled={current === totalPages}>»</NavBtn>
        </PaginationNav>
    );
};

/** 유틸: 태그 배열 정제/중복 제거 */
const uniqTags = (arr?: string[] | null) =>
    Array.from(new Set((arr ?? []).filter(Boolean))) as string[];

/** ---------------------- 검색 페이지 ---------------------- */
export default function SearchPage() {
    const [params] = useSearchParams();
    const navType = useNavigationType();
    const navigate = useNavigate();

    const q = (params.get("q") ?? "").trim();
    const tag = params.get("tag") ?? "";                // 태그 전용
    const catPath = params.get("catPath") ?? "";        // 카테고리 경로(예: "1/4/12")
    const page = Number(params.get("page") ?? 0) || 0;
    const size = Number(params.get("size") ?? 20) || 20;

    // 필터 파라미터
    const initial = params.get("initial") || "";
    const alpha = params.get("alpha") || "";
    const symbol = params.get("symbol") || "";

    // 선택된 카테고리 id (catPath의 마지막 조각)
    const catId = React.useMemo(() => {
        const parts = (catPath || "").split("/").map(s => s.trim()).filter(Boolean);
        return parts.length ? Number(parts[parts.length - 1]) : null;
    }, [catPath]);

    // 상태
    const [results, setResults] = React.useState<Term[]>([]);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // 단어장 모달 상태
    const [moveOpen, setMoveOpen] = React.useState(false);
    const [notebooks, setNotebooks] = React.useState<Notebook[]>([]);
    const [selectedTermId, setSelectedTermId] = React.useState<number | null>(null);

    // 캐시 키
    const cacheKey = React.useMemo(
        () => `term_search:q${q}:tag${tag}:cat${catPath || "none"}:p${page}:s${size}:i${initial}:a${alpha}:s${symbol}`,
        [q, tag, catPath, page, size, initial, alpha, symbol]
    );

    /** 언마운트 시 스크롤 저장 */
    React.useEffect(() => {
        return () => {
            const base = readCache(cacheKey) ?? { q, items: results, total };
            writeCache(cacheKey, { ...base, scrollY: window.scrollY });
        };
    }, [cacheKey, q, results, total]);

    /** 검색 + 캐시 복원 */
    React.useEffect(() => {
        // 쿼리가 하나도 없으면 완전 초기 상태 (탭 전환 직후 등)
        if (!q && !tag && !initial && !alpha && !symbol && !catId) {
            setResults([]); setTotal(0); setLoading(false); setError(null);
            requestAnimationFrame(() => window.scrollTo(0, 0));
            return;
        }

        if (navType === "POP") {
            const cached = readCache(cacheKey);
            if (cached) {
                setResults(cached.items); setTotal(cached.total);
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => window.scrollTo(0, cached.scrollY ?? 0))
                );
                return;
            }
        } else {
            requestAnimationFrame(() => window.scrollTo(0, 0));
        }

        const ac = new AbortController();
        setLoading(true); setError(null);

        (async () => {
            try {
                let items: Term[] = [];
                let nextTotalNum = total;     // 기본은 기존 total 유지(응답이 total을 안 줄 수도 있으니)

                if (tag) {
                    // 태그 검색
                    const res = await fetchTermsByTag(tag, page + 1, size);
                    const rawItems = (res as any).termList ?? [];
                    items = rawItems.map((it: any) => ({
                        id: Number(it.id),
                        title: it.title,
                        description: it.description ?? "",
                        tags: uniqTags(it.tags ?? []),
                    }));
                    const t = (res as any).totalItems;
                    if (typeof t === "number") nextTotalNum = t;
                } else {
                    // 일반/카테고리/접두 검색
                    const res = await http.get<ApiResponse>("/terms/search", {
                        params: { q, page, size, initial, alpha, symbol, catPath }, // <= http 인터셉터가 빈 값 제거
                        signal: ac.signal,
                    });
                    const rawItems = res.data.items ?? res.data.content ?? [];
                    items = rawItems.map((it) => ({
                        id: Number(it.id),
                        title: it.title,
                        description: it.description ?? "",
                        tags: extractTags(it),
                    }));

                    const hasTotalField =
                        typeof (res.data as any).total === "number" ||
                        typeof (res.data as any).totalElements === "number";

                    if (hasTotalField) {
                        nextTotalNum = (res.data as any).total ?? (res.data as any).totalElements ?? nextTotalNum;
                    }
                }

                // 태그 검색 결과 0 → not-found 라우팅
                if (tag && nextTotalNum === 0) {
                    const spNF = new URLSearchParams();
                    spNF.set("tag", tag);
                    navigate({ pathname: "../terms/not-found", search: `?${spNF.toString()}` }, { replace: true });
                    return;
                }

                // 페이지 범위 자동 보정 (총합이 확인될 때만)
                const totalPages = Math.max(1, Math.ceil((nextTotalNum || 0) / (size || 1)));
                if (page > totalPages - 1 && nextTotalNum > 0) {
                    const sp = new URLSearchParams();
                    if (q) sp.set("q", q);
                    if (tag) sp.set("tag", tag);
                    if (initial) sp.set("initial", initial);
                    if (alpha) sp.set("alpha", alpha);
                    if (symbol) sp.set("symbol", symbol);
                    if (catPath) sp.set("catPath", catPath);       // <= 보존
                    sp.set("page", String(totalPages - 1));
                    sp.set("size", String(size || 20));
                    navigate({ search: `?${sp.toString()}` }, { replace: true });
                    return;
                }

                setResults(items);
                setTotal(nextTotalNum);
                writeCache(cacheKey, { q, items, total: nextTotalNum, scrollY: 0 });
            } catch (e: any) {
                if (e?.name === "CanceledError") return;
                const status = e?.response?.status;
                const ebookErr = e?.response?.headers?.["ebook-error"];
                const serverMsg = e?.response?.data?.message || e?.message;
                setError(
                    status
                        ? `오류(${status}) ${serverMsg || ""}${ebookErr ? ` [${ebookErr}]` : ""}`
                        : (serverMsg || "검색 중 오류가 발생했습니다.")
                );
            } finally {
                setLoading(false);
            }
        })();

        return () => ac.abort();
        // 중요한 의존성: catId/catPath까지 포함
    }, [q, tag, page, size, initial, alpha, symbol, catId, catPath, navType, cacheKey, navigate, total]);

    /** 태그 배열 추출 유틸 (응답 스키마 방어) */
    const extractTags = (it: ApiItem): string[] | undefined => {
        if (Array.isArray(it.tags)) return uniqTags(it.tags);
        if (Array.isArray(it.relatedKeywords)) return uniqTags(it.relatedKeywords);
        if (Array.isArray(it.tagNames)) return uniqTags(it.tagNames);
        if (Array.isArray(it.termTags)) {
            return uniqTags(it.termTags.map(x => x?.tag?.name ?? x?.name).filter((v): v is string => !!v));
        }
        if (typeof it.tagsCsv === "string" && it.tagsCsv.trim()) {
            return uniqTags(it.tagsCsv.split(",").map(s => s.trim()));
        }
        return undefined;
    };

    /** 페이지 이동 핸들러 */
    const handlePageChange = (nextZeroBased: number) => {
        const sp = new URLSearchParams();
        if (q) sp.set("q", q);
        if (tag) sp.set("tag", tag);
        if (initial) sp.set("initial", initial);
        if (alpha) sp.set("alpha", alpha);
        if (symbol) sp.set("symbol", symbol);
        if (catPath) sp.set("catPath", catPath);     // <= 보존
        sp.set("page", String(nextZeroBased));
        sp.set("size", String(size || 20));
        // 현재 경로 유지 + 쿼리만 변경 (상대 경로 이슈 회피)
        navigate({ search: `?${sp.toString()}` });
    };

    /** 카드 내 태그 클릭 → 태그 검색으로 전환 (기존 조건은 리셋) */
    const handleTagClick = (t: string) => {
        const sp = new URLSearchParams();
        sp.set("tag", t);
        sp.set("page", "0");
        sp.set("size", String(size || 20));
        navigate({ search: `?${sp.toString()}`});
    };

    /** ========== SpoonNoteModal 연동 ========== */
    const normalize = React.useCallback((s: string) => s.trim().replace(/\s+/g, " ").toLowerCase(), []);

    // 폴더 이름 변경
    const handleRequestRename = React.useCallback(
        async (folderId: string, currentName: string) => {
            const next = window.prompt("새 폴더 이름을 입력하세요.", currentName ?? "");
            if (next == null) return;
            const raw = next.trim();
            if (!raw) { alert("폴더 이름은 공백일 수 없습니다."); return; }
            if (raw.length > 60) { alert("폴더 이름은 최대 60자입니다."); return; }

            const dup = notebooks.some(n => n.id !== folderId && normalize(n.name) === normalize(raw));
            if (dup) { alert("동일한 이름의 폴더가 이미 존재합니다."); return; }

            try {
                await renameUserFolder(folderId, raw);
                // 최신 목록 재조회(또는 로컬 반영)
                const list = await fetchUserFolders();
                setNotebooks(list);
            } catch (e: any) {
                const s = e?.response?.status;
                if (s === 409) alert("동일한 이름의 폴더가 이미 존재합니다.");
                else if (s === 400) alert("폴더 이름 형식이 올바르지 않습니다.");
                else if (s === 403) alert("이 폴더에 대한 권한이 없습니다.");
                else if (s === 404) alert("폴더를 찾을 수 없습니다.");
                else alert("폴더 이름 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            }
        },
        [notebooks, normalize]
    );

    // 폴더 생성
    const handleCreateFolder = React.useCallback(async (name: string) => {
        const { data } = await http.post("/me/folders", { folderName: name });
        const newId = String(data.id);
        const newName = data.folderName ?? name;
        setNotebooks(prev => [{ id: newId, name: newName }, ...prev]);
        return newId;
    }, []);

    // 폴더 순서 저장
    const handleReorderFolders = React.useCallback(async (orderedIds: string[]) => {
        try { await patchReorderFolders(orderedIds); } catch (e) { console.warn("[folders reorder] 실패", e); }
    }, []);

    // "저장하기" 클릭 시(선택 폴더로 현재 term 저장)
    const handleSaveToNotebook = React.useCallback(
        async (notebookId: string) => {
            if (!selectedTermId) return;
            // TODO: 실제 attach API 호출로 교체
            // await attachTermToFolder({ folderId: notebookId, termId: selectedTermId });
            console.log("add to wordbook:", selectedTermId, "-> folder:", notebookId);
            setMoveOpen(false);
            setSelectedTermId(null);
        },
        [selectedTermId]
    );

    // 카드의 + 버튼
    const handleAddClick = React.useCallback(async (termId: number) => {
        setSelectedTermId(termId);
        try { setNotebooks(await fetchUserFolders()); } catch { setNotebooks([]); }
        setMoveOpen(true);
    }, []);

    return (
        <Root>
            {(q || tag || initial || alpha || symbol || catId) ? (
                <InfoRow aria-live="polite">
                    {q && <Chip>검색어: {q}</Chip>}
                    {tag && <Chip>#{tag}</Chip>}
                    {initial && <Chip>초성: {initial}</Chip>}
                    {alpha && <Chip>알파벳: {alpha}</Chip>}
                    {symbol && <Chip>기호: {symbol}</Chip>}
                    {catId && <Chip>분류 필터 적용</Chip>}
                    <Tail>에 대한 <InfoStrongNum>{total}</InfoStrongNum>개의 용어가 검색되었습니다.</Tail>
                </InfoRow>
            ) : (
                <InfoRow>검색어를 입력하거나 분류를 선택해 주세요.</InfoRow>
            )}

            {loading && <LoadingMsg>불러오는 중...</LoadingMsg>}
            {error && <ErrorMsg>{error}</ErrorMsg>}

            {!loading && !error && results.length > 0 && (
                <>
                    <List>
                        {results.map((t) => (
                            <ListItem key={t.id}>
                                <TermCardWithTagsLazy
                                    id={t.id}
                                    title={t.title}
                                    description={t.description}
                                    tags={t.tags}
                                    onTagClick={handleTagClick}
                                    onAdd={handleAddClick} // 모달 열기
                                />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {/* total이 살아있으면, 빈 페이지라도 네비게이션 유지 */}
            {!loading && !error && (q || tag || initial || alpha || symbol || catId) && total > 0 && (
                <Pagination page={page} size={size} total={total} onChange={handlePageChange} />
            )}

            {!loading && !error && (q || tag || initial || alpha || symbol || catId) && results.length === 0 && (
                <div style={{ marginTop: TOKENS.space(16), color: TOKENS.color.textMuted }}>검색 결과가 없습니다.</div>
            )}

            {/* 단어장 이동/저장 모달 */}
            <SpoonNoteModal
                open={moveOpen}
                notebooks={notebooks}
                onClose={() => { setMoveOpen(false); setSelectedTermId(null); }}
                onSave={handleSaveToNotebook}
                onCreate={handleCreateFolder}
                onReorder={handleReorderFolders}
                onGoToFolder={() => { setMoveOpen(false); }} // 검색 페이지에서는 이동 대신 모달만 닫아도 OK
                onRename={async (folderId, newName) => {
                    await renameUserFolder(folderId, newName);
                    setNotebooks(prev => prev.map(n => n.id === folderId ? ({ ...n, name: newName }) : n));
                }}
                onRequestDelete={async (fid) => {
                    await deleteUserFolder(fid, "purge");
                    setNotebooks(await fetchUserFolders());
                }}
                onRequestBulkDelete={async (ids) => {
                    await deleteUserFoldersBulk(ids, "purge");
                    setNotebooks(await fetchUserFolders());
                }}
                onRefresh={async () => await fetchUserFolders()}
            />
        </Root>
    );
}
