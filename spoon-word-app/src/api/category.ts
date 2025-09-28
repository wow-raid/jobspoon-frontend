// src/api/userWordbookTerms.ts
import http, { authHeader } from "../utils/http";

export type MoveFolderTermsPayload = {
    targetFolderId: number;
    termIds?: number[];              // 원본 용어 ID
    userWordbookTermIds?: number[];  // 단어장 항목 ID(폴백)
};

export type MoveFolderTermsResponse = {
    sourceFolderId: number;
    targetFolderId: number;
    movedCount: number;
    skippedCount?: number;
    movedTermIds?: number[];
    skipped?: {
        termId: number;
        reason: "DUPLICATE_IN_TARGET" | "NOT_IN_SOURCE" | "TERM_NOT_FOUND" | "SAME_FOLDER";
    }[];
};

export async function moveFolderTerms(sourceFolderId: string | number, payload: MoveFolderTermsPayload) {
    const body = {
        targetFolderId: Number(payload.targetFolderId),
        termIds: Array.from(new Set((payload.termIds ?? []).map(Number).filter(Number.isFinite))),
        userWordbookTermIds: Array.from(
            new Set((payload.userWordbookTermIds ?? []).map(Number).filter(Number.isFinite))
        ),
    };

    // 콜론형만 호출 (중복/재시도 금지)
    const { data } = await http.patch<MoveFolderTermsResponse>(
        `/me/folders/${Number(sourceFolderId)}/terms:move`,
        body,
        { headers: { ...authHeader() } }
    );
    return data;
}
