import http, { authHeader } from "../utils/http";

/** 이동 요청/응답 타입 */
export type MoveFolderTermsPayload = {
    targetFolderId: number;
    termIds: number[]; // 원본 폴더에서 선택한 termIds
};

export type MoveFolderTermsResponse = {
    sourceFolderId: number;
    targetFolderId: number;
    movedCount: number;
    skippedCount?: number;
    movedTermIds?: number[];
    skipped?: {
        termId: number;
        reason:
            | "DUPLICATE_IN_TARGET"
            | "NOT_IN_SOURCE"
            | "TERM_NOT_FOUND"
            | "SAME_FOLDER";
    }[];
};

/** 폴더 → 폴더 용어 이동 */
export async function moveFolderTerms(
    sourceFolderId: string | number,
    payload: MoveFolderTermsPayload
): Promise<MoveFolderTermsResponse> {
    const sanitized: MoveFolderTermsPayload = {
        targetFolderId: Number(payload.targetFolderId),
        termIds: Array.from(
            new Set(payload.termIds.map(Number).filter(Number.isFinite))
        ),
    };

    const { data } = await http.patch<MoveFolderTermsResponse>(
        `/api/me/folders/${sourceFolderId}/terms:move`,
        sanitized,
        { headers: { ...authHeader() } }
    );
    return data;
}

/** 폴더에 용어 추가(‘내 단어장에 추가’ 모달에서 사용) */
export async function addTermToFolder(
    folderId: string | number,
    termId: string | number
) {
    await http.post(
        `/api/me/folders/${folderId}/terms`,
        { termId: Number(termId) },
        { headers: { ...authHeader() } }
    );
}

/** 폴더에서 용어 제거 (필요 시) */
export async function removeTermFromFolder(
    folderId: string | number,
    userWordbookTermId: string | number
) {
    await http.delete(
        `/api/me/folders/${folderId}/terms/${userWordbookTermId}`,
        { headers: { ...authHeader() } }
    );
}

/** 폴더 내 용어 페이지 조회(원한다면 여기로도 흡수 가능) */
export async function fetchFolderTerms(
    folderId: string | number,
    params: { page?: number; perPage?: number; sort?: string } = {}
) {
    const { data } = await http.get(`/api/folders/${folderId}/terms`, {
        params: { page: 0, perPage: 20, sort: "createdAt,DESC", ...params },
        headers: { ...authHeader() },
    });
    return data; // 화면에서 d.userWordbookTermList || d.content ... 식으로 기존처럼 normalize
}
