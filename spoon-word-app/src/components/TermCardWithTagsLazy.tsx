// src/components/TermCardWithTagsLazy.tsx
import React from "react";
import axiosInstance from "../api/axiosInstance"; // baseURL가 '/api'라고 가정
import TermCard, { TermCardProps } from "./TermCard";

type Props = Omit<TermCardProps, "tags"> & {
    /** 검색 응답 등으로 태그가 이미 있으면 그대로 사용 */
    tags?: string[];
    /** 필요 시 외부에서 API 교체 가능 (테스트/모킹 용) */
    fallbackApi?: (id: number) => Promise<string[]>;
};

/* ---- 모듈 레벨 캐시: 동일 용어에 대한 중복 호출 방지 ---- */
const TAGS_CACHE = new Map<number, string[]>();
const PENDING = new Map<number, Promise<string[]>>();

/** 기본 fetcher: GET /api/terms/{id}/tags -> ["DOM","HTML",...] */
const defaultFetcher = async (id: number): Promise<string[]> => {
    const { data } = await axiosInstance.get<string[]>(`/terms/${id}/tags`);
    return Array.isArray(data) ? data.filter(Boolean) : [];
};

/** 캐시 래퍼 */
async function fetchTagsOnce(
    id: number,
    fetcher: (id: number) => Promise<string[]>
): Promise<string[]> {
    if (TAGS_CACHE.has(id)) return TAGS_CACHE.get(id)!;
    if (PENDING.has(id)) return PENDING.get(id)!;

    const p = fetcher(id)
        .then((arr) => {
            const deduped = Array.from(new Set((arr ?? []).filter(Boolean)));
            TAGS_CACHE.set(id, deduped);
            return deduped;
        })
        .finally(() => {
            PENDING.delete(id);
        });

    PENDING.set(id, p);
    return p;
}

/** 테스트/핫리로드용 캐시 유틸 */
export const TagCache = {
    get: (id: number) => TAGS_CACHE.get(id),
    has: (id: number) => TAGS_CACHE.has(id),
    set: (id: number, tags: string[]) => TAGS_CACHE.set(id, tags),
    clear: () => {
        TAGS_CACHE.clear();
        PENDING.clear();
    },
};

const TermCardWithTagsLazy: React.FC<Props> = ({
                                                   id,
                                                   title,
                                                   description,
                                                   tags,
                                                   onAdd,
                                                   onTagClick,
                                                   fallbackApi,
                                               }) => {
    // tags가 주어지면 그대로 사용, 없으면 lazy 로딩
    const [loadedTags, setLoadedTags] = React.useState<string[] | null>(tags ?? null);

    React.useEffect(() => {
        let cancelled = false;

        // 외부에서 새 tags가 들어오면 즉시 반영
        if (Array.isArray(tags)) {
            setLoadedTags(tags);
            return;
        }

        // 없으면 한 번만 API 호출
        (async () => {
            try {
                const fetcher = fallbackApi ?? defaultFetcher;
                const result = await fetchTagsOnce(id, fetcher);
                if (!cancelled) setLoadedTags(result);
            } catch {
                if (!cancelled) setLoadedTags([]); // 실패해도 UI 유지
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, tags, fallbackApi]);

    return (
        <TermCard
            id={id}
            title={title}
            description={description}
            tags={loadedTags ?? []}
            onAdd={onAdd}
            onTagClick={onTagClick}
        />
    );
};

export default TermCardWithTagsLazy;
