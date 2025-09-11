// src/hooks/useCategoryTree.ts
import React from "react";
import axiosInstance from "../api/axiosInstance";

/** 서버 스키마에 맞춘 카테고리 타입 */
export type Category = {
    id: number;
    type?: string | null;          // ex) '직무 중심'
    group_name?: string | null;    // ex) 'Frontend' (depth=2에서는 부모 중분류 이름)
    name: string;                  // 화면 표시용 라벨
    depth: 0 | 1 | 2;
    sort_order?: number | null;
    parent_id: number | null;
};

type FetchParams = { depth: 0 | 1 | 2; parentId?: number | null };

/** 캐시 키 */
const keyOf = (p: FetchParams) => `d${p.depth}:${p.parentId ?? "root"}`;

/** 메모리 캐시 */
const cache = new Map<string, Category[]>();

/** 서버 응답 정규화: DB 스키마 그대로 받아서 화면에서 쓸 수 있게 변환 */
function normalize(list: any[]): Category[] {
    const arr = Array.isArray(list) ? list : [];
    const out = arr.map((c: any) => {
        const depthNum = Number(c.depth) as 0 | 1 | 2;
        return {
            id: Number(c.id),
            type: c.type ?? null,
            group_name: c.group_name ?? c.groupName ?? null,
            name: String(c.name ?? c.group_name ?? c.type ?? ""), // 화면 표시 기본은 name
            depth: depthNum,
            sort_order: c.sort_order ?? c.sortOrder ?? null,
            parent_id: c.parent_id ?? c.parentId ?? null,
        } as Category;
    });

    // 정렬: sort_order → name
    out.sort((a, b) => {
        const sa = a.sort_order ?? 99999;
        const sb = b.sort_order ?? 99999;
        if (sa !== sb) return sa - sb;
        return a.name.localeCompare(b.name, "ko");
    });

    return out;
}

/** 방어형 fetch: 백엔드가 parentId 키를 어떤 걸 쓰든 맞춰봄 */
async function fetchCategories(p: FetchParams): Promise<Category[]> {
    const key = keyOf(p);
    if (cache.has(key)) return cache.get(key)!;

    // 기본 파라미터: depth만 필수, 루트는 parent 키 생략
    const params: Record<string, any> = { depth: p.depth };
    if (p.parentId != null) {
        params.parentId = p.parentId;   // camelCase
        params.parent_id = p.parentId;  // snake_case (둘 다 전송하면 한쪽만 읽어도 OK)
    }

    // 권장 엔드포인트: /categories
    // 필요하면 /category 로 바꿔도 무방
    let data: any[] = [];
    try {
        const res = await axiosInstance.get("/categories", { params });
        data = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
    } catch (e) {
        // fallback: 경로가 단수인 서버
        try {
            const res2 = await axiosInstance.get("/category", { params });
            data = Array.isArray(res2.data) ? res2.data : res2.data?.items ?? [];
        } catch {
            data = [];
        }
    }

    const list = normalize(data);
    cache.set(key, list);
    return list;
}

/** 외부 사용 훅: 선택된 상위 id에 맞춰 0/1/2레벨을 lazy 로딩 */
export function useCategoryTree(selected0?: number | null, selected1?: number | null) {
    const [d0, setD0] = React.useState<Category[]>([]);
    const [d1, setD1] = React.useState<Category[]>([]);
    const [d2, setD2] = React.useState<Category[]>([]);

    const [loading0, setLoading0] = React.useState(false);
    const [loading1, setLoading1] = React.useState(false);
    const [loading2, setLoading2] = React.useState(false);

    const [error0, setError0] = React.useState<string | null>(null);
    const [error1, setError1] = React.useState<string | null>(null);
    const [error2, setError2] = React.useState<string | null>(null);

    // depth 0
    React.useEffect(() => {
        let cancelled = false;
        setLoading0(true); setError0(null);
        fetchCategories({ depth: 0 })
            .then((arr) => { if (!cancelled) setD0(arr); })
            .catch((e) => { if (!cancelled) setError0(e?.message ?? "로드 오류"); })
            .finally(() => { if (!cancelled) setLoading0(false); });
        return () => { cancelled = true; };
    }, []);

    // depth 1
    React.useEffect(() => {
        if (!selected0) { setD1([]); setError1(null); setLoading1(false); return; }
        let cancelled = false;
        setLoading1(true); setError1(null);
        fetchCategories({ depth: 1, parentId: selected0 })
            .then((arr) => { if (!cancelled) setD1(arr); })
            .catch((e) => { if (!cancelled) setError1(e?.message ?? "로드 오류"); })
            .finally(() => { if (!cancelled) setLoading1(false); });
        return () => { cancelled = true; };
    }, [selected0]);

    // depth 2
    React.useEffect(() => {
        if (!selected1) { setD2([]); setError2(null); setLoading2(false); return; }
        let cancelled = false;
        setLoading2(true); setError2(null);
        fetchCategories({ depth: 2, parentId: selected1 })
            .then((arr) => { if (!cancelled) setD2(arr); })
            .catch((e) => { if (!cancelled) setError2(e?.message ?? "로드 오류"); })
            .finally(() => { if (!cancelled) setLoading2(false); });
        return () => { cancelled = true; };
    }, [selected1]);

    return {
        level0: { items: d0, loading: loading0, error: error0 },
        level1: { items: d1, loading: loading1, error: error1 },
        level2: { items: d2, loading: loading2, error: error2 },
    };
}
