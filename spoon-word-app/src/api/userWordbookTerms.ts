import http, { authHeader } from "../utils/http";

export type MoveFolderTermsPayload = {
    targetFolderId: number;
    termIds: number[];
};

export type MoveFolderTermsResponse = {
    sourceFolderId: number;
    targetFolderId: number;
    movedCount: number;
    skippedCount?: number;
    movedTermIds?: number[];
    skipped?: { termId: number; reason: "DUPLICATE_IN_TARGET" | "NOT_IN_SOURCE" | "TERM_NOT_FOUND" | "SAME_FOLDER" }[];
};

export async function moveFolderTerms(sourceFolderId: string | number, payload: MoveFolderTermsPayload) {
    const sanitized: MoveFolderTermsPayload = {
        targetFolderId: Number(payload.targetFolderId),
        termIds: Array.from(new Set(payload.termIds.map(Number).filter(Number.isFinite))),
    };
    const { data } = await http.patch<MoveFolderTermsResponse>(
        `/api/me/folders/${sourceFolderId}/terms:move`,
        sanitized,
        { headers: { ...authHeader() } }
    );
    return data;
}
