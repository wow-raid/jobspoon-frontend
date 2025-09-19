import http, { authHeader } from "../utils/http";

export type MemorizationStatus = "LEARNING" | "MEMORIZED";

/** termId 기준으로 암기 상태 변경 */
export async function patchTermMemorization(
    termId: number | string,
    status: MemorizationStatus
) {
    return http.patch(
        `/api/me/terms/${termId}/memorization`,
        { status },
        { headers: { ...authHeader() } }
    );
}
/** userTermId 기준으로 암기 상태 변경 (필요 시 사용) */
export async function patchUserTermMemorization(
    userTermId: number | string,
    status: MemorizationStatus
) {
    return http.patch(
        `/api/me/terms/${userTermId}/memorization`,
        { status },
        { headers: { ...authHeader() } }
    );
}

/** 내부에서 알아서 경로 선택 (termId 있으면 우선 사용) */
export async function setMemorization(opts: {
    termId?: number | string;
    userTermId?: number | string;
    done: boolean;
}) {
    const status: MemorizationStatus = opts.done ? "MEMORIZED" : "LEARNING";
    if (opts.termId != null) return patchTermMemorization(opts.termId, status);
    if (opts.userTermId != null) return patchUserTermMemorization(opts.userTermId, status);
    throw new Error("setMemorization: termId/userTermId 둘 다 없습니다.");
}

/** 새로고침 시 초기 암기 상태 일괄 조회 */
export async function fetchMemorizationStatuses(termIds: Array<number | string>) {
    const ids = termIds.join(",");
    const { data } = await http.get<Record<string, MemorizationStatus>>(
        "/api/me/terms/memorization",
        {
            params: { ids },
            headers: { ...authHeader() },
        }
    );
    return data;
}