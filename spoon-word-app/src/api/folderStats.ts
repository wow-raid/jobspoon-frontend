import http, { authHeader } from "../utils/http";

export type FolderSummary = {
    id: number;
    name: string;
    termCount: number;
    learnedCount?: number | null;
    updatedAt?: string | null;
};

export async function fetchMyFoldersWithStats(params: {
    page?: number;       // 0-base
    perPage?: number;    // 기본 20
    sort?: string;       // "sortOrder,asc" | "name,desc" | "updatedAt,desc" ...
    q?: string;
}) {
    const { page, perPage = 20, sort = "sortOrder,asc", q } = params || {};

    const res = await http.get("/me/wordbook/folders:stats", {
        params: page == null ? {} : { page, perPage, sort, q },
        headers: { ...authHeader() },
        withCredentials: true,
        validateStatus: () => true,
    });

    if (res.status !== 200) {
        const msg =
            (typeof res.data === "string" && res.data) ||
            res.data?.message ||
            `HTTP ${res.status}`;
        throw new Error(msg);
    }

    const isPaged = page != null;
    const total =
        (isPaged && Number(res.headers["x-total-count"])) ||
        (isPaged ? 0 : ((res.data?.folders ?? res.data ?? []).length || 0));

    // page 모드면 바디 = 배열, non-page 모드면 { folders: [...] }
    const items: FolderSummary[] = isPaged
        ? (res.data as any[] ?? [])
        : ((res.data?.folders as any[]) ?? []);

    return { items, total, page: page ?? 0, perPage: isPaged ? perPage : items.length };
}
