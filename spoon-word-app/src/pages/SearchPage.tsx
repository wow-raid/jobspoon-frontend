// src/pages/SearchPage.tsx
import React from "react";
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

/** ----------------------
 * 페이지네이션 컴포넌트
 * ---------------------- */
type PaginationProps = {
    page: number; size: number; total: number;
    onChange: (nextPageZeroBased: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, size, total, onChange }) => {
    const totalPages = Math.max(1, Math.ceil((total || 0) / (size || 1)));
    const current = page + 1; // 1-base
    const maxNumbers = 10;

    let start = Math.max(1, current - Math.floor(maxNumbers / 2));
    let end = Math.min(totalPages, start + maxNumbers - 1);
    start = Math.max(1, end - maxNumbers + 1);

    const nums: number[] = [];
    for (let i = start; i <= end; i++) nums.push(i);

    const styles = {
        wrap: {
            marginTop: TOKENS.space(16),
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: TOKENS.space(8), userSelect: "none" as const,
        },
        numBtn: (active: boolean) => ({
            minWidth: 34, height: 34, padding: "0 10px", borderRadius: 999,
            border: `1px solid ${active ? TOKENS.color.textBlue : TOKENS.color.border}`,
            background: active ? TOKENS.color.textBlue : "#fff",
            color: active ? "#fff" : TOKENS.color.text,
            fontWeight: active ? 700 : 600,
            cursor: "pointer",
        }) as React.CSSProperties,
        navBtn: (disabled: boolean) => ({
            width: 34, height: 34, borderRadius: 999,
            border: `1px solid ${TOKENS.color.border}`, background: "#fff",
            color: disabled ? "#c7c7c7" : TOKENS.color.text,
            cursor: disabled ? "not-allowed" : "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
        }) as React.CSSProperties,
    };

    const go = (p1: number) => {
        if (p1 < 1 || p1 > totalPages || p1 === current) return;
        onChange(p1 - 1);
    };

    return (
        <nav aria-label="페이지네이션" style={styles.wrap}>
            <button type="button" aria-label="처음" style={styles.navBtn(current === 1)} onClick={() => go(1)} disabled={current === 1}>«</button>
            <button type="button" aria-label="이전" style={styles.navBtn(current === 1)} onClick={() => go(current - 1)} disabled={current === 1}>‹</button>
            {nums.map(n => (
                <button key={n} type="button" style={styles.numBtn(n === current)} onClick={() => go(n)} aria-current={n === current ? "page" : undefined}>
                    {n}
                </button>
            ))}
            <button type="button" aria-label="다음" style={styles.navBtn(current === totalPages)} onClick={() => go(current + 1)} disabled={current === totalPages}>›</button>
            <button type="button" aria-label="마지막" style={styles.navBtn(current === totalPages)} onClick={() => go(totalPages)} disabled={current === totalPages}>»</button>
        </nav>
    );
};

/** 유틸: 태그 배열 정제/중복 제거 */
const uniqTags = (arr?: string[] | null) =>
    Array.from(new Set((arr ?? []).filter(Boolean))) as string[];

/** ----------------------
 * 검색 페이지
 * ---------------------- */
export default function SearchPage() {
    const [params] = useSearchParams();
    const navType = useNavigationType();
    const navigate = useNavigate();

    const q = (params.get("q") ?? "").trim();
    const tag = params.get("tag") ?? "";   // ★ 태그 파라미터
    const page = Number(params.get("page") ?? 0) || 0;
    const size = Number(params.get("size") ?? 20) || 20;

    // 필터 파라미터
    const initial = params.get("initial") || "";
    const alpha = params.get("alpha") || "";
    const symbol = params.get("symbol") || "";

    // 상태
    const [results, setResults] = React.useState<Term[]>([]);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // 캐시 키
    const cacheKey = React.useMemo(
        () => `term_search:q${q}:tag${tag}:p${page}:s${size}:i${initial}:a${alpha}:s${symbol}`,
        [q, tag, page, size, initial, alpha, symbol]
    );

    /** 태그 추출 */
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

    /** 언마운트 시 스크롤 저장 */
    React.useEffect(() => {
        return () => {
            const base = readCache(cacheKey) ?? { q, items: results, total };
            writeCache(cacheKey, { ...base, scrollY: window.scrollY });
        };
    }, [cacheKey, q, results, total]);

    /** 검색 + 캐시 복원 */
    React.useEffect(() => {
        if (!q && !tag && !initial && !alpha && !symbol) {
            setResults([]); setTotal(0); setLoading(false); setError(null);
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
                    // 🔹 태그 검색
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
                    // 🔹 일반 검색
                    const res = await axiosInstance.get<ApiResponse>("/terms/search", {
                        params: { q, page, size, initial, alpha, symbol },
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

                if (tag && totalNum === 0) {
                    const spNF = new URLSearchParams();
                    spNF.set("tag", tag);
                    navigate({ pathname: "../terms/not-found", search: `?${spNF.toString()}` }, { replace: true });
                    return;
                }

                // 페이지 범위 자동 보정(총페이지보다 큰 page로 진입 시 마지막 페이지로 이동)
                const totalPages = Math.max(1, Math.ceil((totalNum || 0) / (size || 1)));
                if (page > totalPages - 1 && totalNum > 0) {
                    const sp = new URLSearchParams();
                    if (q) sp.set("q", q);
                    if (tag) sp.set("tag", tag);
                    if (initial) sp.set("initial", initial);
                    if (alpha) sp.set("alpha", alpha);
                    if (symbol) sp.set("symbol", symbol);
                    sp.set("page", String(totalPages - 1));
                    sp.set("size", String(size || 20));
                    navigate({ pathname: "search", search: `?${sp.toString()}` }, { replace: true });
                    return; // 이 렌더 사이클에서는 상태 세팅 생략
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
    }, [q, tag, page, size, initial, alpha, symbol, navType, cacheKey, navigate]);

    /** 페이지 이동 핸들러 */
    const handlePageChange = (nextZeroBased: number) => {
        const sp = new URLSearchParams();
        if (q) sp.set("q", q);
        if (tag) sp.set("tag", tag); // ★ 태그 유지
        if (initial) sp.set("initial", initial);
        if (alpha) sp.set("alpha", alpha);
        if (symbol) sp.set("symbol", symbol);
        sp.set("page", String(nextZeroBased));
        sp.set("size", String(size || 20));
        navigate({ pathname: "search", search: `?${sp.toString()}` });
    };

    /** 태그 클릭 → URL 변경 */
    const handleTagClick = (t: string) => {
        const sp = new URLSearchParams();
        sp.set("tag", t);
        sp.set("page", "0");
        sp.set("size", String(size || 20));
        navigate({ pathname: "search", search: `?${sp.toString()}` });
    };

    /** 스타일 */
    const styles = React.useMemo(() => ({
        root: { marginTop: TOKENS.space(16) },
        infoRow: {
            marginTop: 0, display: "flex", alignItems: "center", gap: TOKENS.space(8),
            whiteSpace: "nowrap", overflowX: "auto", overflowY: "hidden",
            WebkitOverflowScrolling: "touch" as any,
            fontSize: TOKENS.font.base, color: TOKENS.color.textMuted,
        } as React.CSSProperties,
        infoStrongNum: { fontWeight: TOKENS.font.strong, color: TOKENS.color.textBlue },
        chip: {
            display: "inline-flex", alignItems: "center", gap: TOKENS.space(6),
            borderRadius: TOKENS.radius, background: TOKENS.color.chipBg,
            border: `1px solid ${TOKENS.color.chipBorder}`,
            padding: `${TOKENS.space(4)} ${TOKENS.space(8)}`,
            fontSize: TOKENS.font.small, color: TOKENS.color.textBlue,
            fontWeight: 700, flex: "0 0 auto",
        } as React.CSSProperties,
        tail: { flex: "0 0 auto" } as React.CSSProperties,
        loading: { marginTop: TOKENS.space(16), color: TOKENS.color.textMuted },
        error: { marginTop: TOKENS.space(16), color: TOKENS.color.red },
        list: { marginTop: TOKENS.space(16), padding: 0, listStyle: "none" as const },
        listItem: { marginTop: TOKENS.space(16) },
        empty: { marginTop: TOKENS.space(16), color: TOKENS.color.textMuted },
    }), []);

    return (
        <div style={styles.root}>
            {(q || tag || initial || alpha || symbol) ? (
                <div style={styles.infoRow} aria-live="polite">
                    {q && <span style={styles.chip}>검색어: {q}</span>}
                    {tag && <span style={styles.chip}>#{tag}</span>}
                    {initial && <span style={styles.chip}>초성: {initial}</span>}
                    {alpha && <span style={styles.chip}>알파벳: {alpha}</span>}
                    {symbol && <span style={styles.chip}>기호: {symbol}</span>}
                    <span style={styles.tail}>
            에 대한 <span style={styles.infoStrongNum}>{total}</span>개의 용어가 검색되었습니다.
          </span>
                </div>
            ) : (
                <div style={styles.infoRow}>검색어를 입력하거나 상단 필터/태그를 선택해 주세요.</div>
            )}

            {loading && <div style={styles.loading}>불러오는 중...</div>}
            {error && <div style={styles.error}>{error}</div>}

            {!loading && !error && results.length > 0 && (
                <>
                    <ul style={styles.list}>
                        {results.map((t, idx) => (
                            <li key={t.id} style={idx === 0 ? undefined : styles.listItem}>
                                <TermCardWithTagsLazy
                                    id={t.id}
                                    title={t.title}
                                    description={t.description}
                                    tags={t.tags}
                                    onTagClick={handleTagClick}
                                    onAdd={(id) => console.log("add to wordbook:", id)}
                                />
                            </li>
                        ))}
                    </ul>
                    <Pagination page={page} size={size} total={total} onChange={handlePageChange} />
                </>
            )}

            {!loading && !error && (q || tag || initial || alpha || symbol) && results.length === 0 && (
                <div style={styles.empty}>검색 결과가 없습니다.</div>
            )}
        </div>
    );
}
