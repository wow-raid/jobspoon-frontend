import http, { authHeader } from "../utils/http";

export type MoveFavoritesResponse = {
    targetFolderId: number;
    movedCount: number;
    skippedCount: number;
    skipped: { termId: number; reason: "DUPLICATE_IN_TARGET" | "NOT_FOUND_FAVORITE" | "FORBIDDEN" | "UNKNOWN" }[];
};

export async function moveFavorites(params: {
    targetFolderId: number;
    favoriteIds?: Array<number | string>;
    termIds?: Array<number | string>;
}) {
    const { targetFolderId, favoriteIds = [], termIds = [] } = params;
    if (!targetFolderId) throw new Error("TARGET_REQUIRED");
    if (favoriteIds.length === 0 && termIds.length === 0) throw new Error("EMPTY_IDS");

    const payload: Record<string, any> = { targetFolderId };
    if (favoriteIds.length) payload.favoriteIds = favoriteIds.map(Number);
    if (termIds.length) payload.termIds = termIds.map(Number);

    const { data } = await http.patch<MoveFavoritesResponse>(
        "/api/me/wordbook/favorites:move",
        payload,
        { headers: { ...authHeader() } }
    );
    return data;
}


export async function deleteFavoriteTerm(favoriteTermId: number | string) {
    return http.delete(`/api/me/favorite-terms/${favoriteTermId}`, {
        headers: { ...authHeader() },
    })
}