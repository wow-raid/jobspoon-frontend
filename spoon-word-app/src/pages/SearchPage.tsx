import React from "react";
import styled from "styled-components";
import { useSearchParams, useNavigationType, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { fetchTermsByTag } from "../api/termApi";   // 태그 전용 API
import TermCardWithTagsLazy from "../components/TermCardWithTagsLazy";

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
const EmptyMsg = styled.div` margin-top: ${TOKENS.space(16)}; color: ${TOKENS.color.textMuted}; `;

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
                let totalNum = 0;

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
                    totalNum = (res as any).totalItems ?? items.length;
                } else {
                    // 일반/카테고리/접두 검색
                    const res = await axiosInstance.get<ApiResponse>("/terms/search", {
                        params: { q, page, size, initial, alpha, symbol, catPath }, // <= catPath 전달
                        signal: ac.signal,
                    });
                    const rawItems = res.data.items ?? res.data.content ?? [];
                    items = rawItems.map((it) => ({
                        id: Number(it.id),
                        title: it.title,
                        description: it.description ?? "",
                        tags: extractTags(it),
                    }));
                    totalNum = res.data.total ?? res.data.totalElements ?? items.length;
                }

                // 태그 검색 결과 0 → not-found 라우팅
                if (tag && totalNum === 0) {
                    const spNF = new URLSearchParams();
                    spNF.set("tag", tag);
                    navigate({ pathname: "../terms/not-found", search: `?${spNF.toString()}` }, { replace: true });
                    return;
                }

                // 페이지 범위 자동 보정
                const totalPages = Math.max(1, Math.ceil((totalNum || 0) / (size || 1)));
                if (page > totalPages - 1 && totalNum > 0) {
                    const sp = new URLSearchParams();
                    if (q) sp.set("q", q);
                    if (tag) sp.set("tag", tag);
                    if (initial) sp.set("initial", initial);
                    if (alpha) sp.set("alpha", alpha);
                    if (symbol) sp.set("symbol", symbol);
                    if (catPath) sp.set("catPath", catPath);       // <= 보존
                    sp.set("page", String(totalPages - 1));
                    sp.set("size", String(size || 20));
                    navigate({ pathname: "search", search: `?${sp.toString()}` }, { replace: true });
                    return;
                }

                setResults(items);
                setTotal(totalNum);
                writeCache(cacheKey, { q, items, total: totalNum, scrollY: 0 });
            } catch (e: any) {
                if (e?.name === "CanceledError") return;
                setError(e?.message || "검색 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        })();

        return () => ac.abort();
        // 중요한 의존성: catId/catPath까지 포함
    }, [q, tag, page, size, initial, alpha, symbol, catId, catPath, navType, cacheKey, navigate]);

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
        navigate({ pathname: "search", search: `?${sp.toString()}` });
    };

    /** 카드 내 태그 클릭 → 태그 검색으로 전환 (기존 조건은 리셋) */
    const handleTagClick = (t: string) => {
        const sp = new URLSearchParams();
        sp.set("tag", t);
        sp.set("page", "0");
        sp.set("size", String(size || 20));
        navigate({ pathname: "search", search: `?${sp.toString()}` });
    };

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
                                    onAdd={(id) => console.log("add to wordbook:", id)}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Pagination page={page} size={size} total={total} onChange={handlePageChange} />
                </>
            )}

            {!loading && !error && (q || tag || initial || alpha || symbol || catId) && results.length === 0 && (
                <EmptyMsg>검색 결과가 없습니다.</EmptyMsg>
            )}
        </Root>
    );
}