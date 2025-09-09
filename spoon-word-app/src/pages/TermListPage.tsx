// src/pages/TermListPage.tsx
import React from "react";
import { useSearchParams, useNavigationType, useNavigate } from "react-router-dom";
import TermCardWithTagsLazy from "../components/TermCardWithTagsLazy";
import { fetchTermsByTag } from "../api/termApi";

/* 타입 */
type Term = { id: number; title: string; description: string; tags?: string[] };

/* 세션 캐시 유틸 */
type CacheData = { tag: string; items: Term[]; total: number; scrollY?: number };
const readCache = (k: string): CacheData | null => { try { const r = sessionStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } };
const writeCache = (k: string, d: CacheData) => { try { sessionStorage.setItem(k, JSON.stringify(d)); } catch {} };

/* 디자인 토큰 */
const TOKENS = {
    color: {
        text: "#374151",
        textMuted: "#6b7280",
        textBlue: "#2563eb",
        red: "#dc2626",
        border: "#e5e7eb",
        chipBg: "#eef2ff",
        chipBorder: "#c7d2fe",
    },
    space: (n: number) => `${n}px`,
    font: { base: "14px", small: "12px", strong: 700 },
    radius: 14,
};

/* 페이지네이션 */
type PaginationProps = {
    page: number; size: number; total: number;
    onChange: (nextPageZeroBased: number) => void;
};
const Pagination: React.FC<PaginationProps> = ({ page, size, total, onChange }) => {
    const totalPages = Math.max(1, Math.ceil((total || 0) / (size || 1)));
    const current = page + 1;
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

const TermListPage: React.FC = () => {
    const [params] = useSearchParams();
    const navType = useNavigationType();
    const navigate = useNavigate();

    const tag = (params.get("tag") ?? "").trim();
    const page = Number(params.get("page") ?? 0) || 0;
    const size = Number(params.get("size") ?? 20) || 20;

    const [terms, setTerms] = React.useState<Term[]>([]);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const cacheKey = React.useMemo(() => `terms_by_tag:tag${tag}:p${page}:s${size}`, [tag, page, size]);

    /* 언마운트 시 스크롤 저장 */
    React.useEffect(() => {
        return () => {
            const base = readCache(cacheKey) ?? { tag, items: terms, total };
            writeCache(cacheKey, { ...base, scrollY: window.scrollY });
        };
    }, [cacheKey, tag, terms, total]);

    /* 태그 검색 + 캐시 복원 */
    React.useEffect(() => {
        if (!tag) {
            setTerms([]); setTotal(0); setLoading(false); setError(null);
            return;
        }

        if (navType === "POP") {
            const cached = readCache(cacheKey);
            if (cached) {
                setTerms(cached.items);
                setTotal(cached.total);
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
                const res = await fetchTermsByTag(tag, page + 1, size);
                const rawItems = (res as any).termList ?? [];
                const items: Term[] = rawItems.map((it: any) => ({
                    id: Number(it.id),
                    title: it.title,
                    description: it.description ?? "",
                    tags: Array.from(new Set((it.tags ?? []).filter(Boolean))),
                }));
                const totalNum = (res as any).totalItems ?? items.length;

                if (totalNum === 0) {
                    const spNF = new URLSearchParams();
                    spNF.set("tag", tag);
                    navigate({ pathname: "../not-found", search: `?${spNF.toString()}` }, { replace: true });
                    return;
                }

                // 범위 보정
                const totalPages = Math.max(1, Math.ceil((totalNum || 0) / (size || 1)));
                if (page > totalPages - 1 && totalNum > 0) {
                    const sp = new URLSearchParams();
                    sp.set("tag", tag);
                    sp.set("page", String(totalPages - 1));
                    sp.set("size", String(size || 20));
                    navigate(`/terms/by-tag?${sp.toString()}`, { replace: true });
                    return;
                }

                setTerms(items);
                setTotal(totalNum);
                writeCache(cacheKey, { tag, items, total: totalNum, scrollY: 0 });
            } catch (e: any) {
                setError(e?.message || "태그 검색 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        })();

        return () => ac.abort();
    }, [tag, page, size, cacheKey, navType, navigate]);

    /* 페이지 이동 */
    const handlePageChange = (nextZeroBased: number) => {
        const sp = new URLSearchParams();
        if (tag) sp.set("tag", tag);
        sp.set("page", String(nextZeroBased));
        sp.set("size", String(size || 20));
        navigate({ pathname: "terms/by-tag", search: `?${sp.toString()}` });
    };

    /* 카드 내 태그 클릭 → 같은 페이지에서 태그 교체 */
    const handleTagClick = (t: string) => {
        const sp = new URLSearchParams();
        sp.set("tag", t);
        sp.set("page", "0");
        sp.set("size", String(size || 20));
        navigate({ pathname: "terms/by-tag", search: `?${sp.toString()}` });
    };

    /* 스타일 */
    const styles = React.useMemo(() => ({
        root: { marginTop: TOKENS.space(16) },
        infoRow: {
            marginTop: 0, display: "flex", alignItems: "center", gap: TOKENS.space(8),
            whiteSpace: "nowrap", overflowX: "auto", overflowY: "hidden",
            WebkitOverflowScrolling: "touch" as any,
            fontSize: TOKENS.font.base, color: TOKENS.color.textMuted,
        } as React.CSSProperties,
        chip: {
            display: "inline-flex", alignItems: "center", gap: TOKENS.space(6),
            borderRadius: TOKENS.radius, background: TOKENS.color.chipBg,
            border: `1px solid ${TOKENS.color.chipBorder}`,
            padding: `${TOKENS.space(4)} ${TOKENS.space(8)}`,
            fontSize: TOKENS.font.small, color: TOKENS.color.textBlue,
            fontWeight: TOKENS.font.strong, flex: "0 0 auto",
        } as React.CSSProperties,
        strongNum: { fontWeight: TOKENS.font.strong, color: TOKENS.color.textBlue },
        loading: { marginTop: TOKENS.space(16), color: TOKENS.color.textMuted },
        error: { marginTop: TOKENS.space(16), color: TOKENS.color.red },
        list: { marginTop: TOKENS.space(16), padding: 0, listStyle: "none" as const },
        listItem: { marginTop: TOKENS.space(16) },
        empty: { marginTop: TOKENS.space(16), color: TOKENS.color.textMuted },
    }), []);

    return (
        <div style={styles.root}>
            {tag ? (
                <div style={styles.infoRow} aria-live="polite">
                    <span style={styles.chip}>#{tag}</span>
                    <span>
            에 대한 <span style={styles.strongNum}>{total}</span>개의 용어가 검색되었습니다.
          </span>
                </div>
            ) : (
                <div style={styles.infoRow}>해시태그를 선택하면 해당 태그의 용어를 보여드립니다.</div>
            )}

            {loading && <div style={styles.loading}>불러오는 중...</div>}
            {error && <div style={styles.error}>{error}</div>}

            {!loading && !error && terms.length > 0 && (
                <>
                    <ul style={styles.list}>
                        {terms.map((t, idx) => (
                            <li key={t.id} style={idx === 0 ? undefined : styles.listItem}>
                                <TermCardWithTagsLazy
                                    id={t.id}
                                    title={t.title}
                                    description={t.description}
                                    tags={t.tags}
                                    onTagClick={handleTagClick}
                                    onAdd={(id) => console.log("단어장 추가:", id)}
                                />
                            </li>
                        ))}
                    </ul>
                    <Pagination page={page} size={size} total={total} onChange={handlePageChange} />
                </>
            )}

            {!loading && !error && tag && terms.length === 0 && (
                <div style={styles.empty}>해당 태그로 등록된 용어가 없습니다.</div>
            )}

            {!loading && !error && !tag && (
                <div style={styles.empty}>용어 카드를 열고 해시태그를 눌러보세요.</div>
            )}
        </div>
    );
};

export default TermListPage;
