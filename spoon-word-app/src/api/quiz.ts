import http, { authHeader } from "../utils/http";

/** union 타입으로 명확히: set일 땐 setId만, 나머지는 count/type/level 필수 */
export type StartQuizSessionUnifiedPayload =
    | {
    source: "set";
    setId: number;
    seedMode?: "AUTO" | "DAILY" | "FIXED";
    fixedSeed?: number | null;
}
    | {
    source: "folder";
    folderId: number;
    count: number;
    type: "mix" | "choice" | "ox" | "initials";
    level: "mix" | "easy" | "medium" | "hard";
    seedMode?: "AUTO" | "DAILY" | "FIXED";
    fixedSeed?: number | null;
}
    | {
    source: "category";
    categoryId: number;
    count: number;
    type: "mix" | "choice" | "ox" | "initials";
    level: "mix" | "easy" | "medium" | "hard";
    seedMode?: "AUTO" | "DAILY" | "FIXED";
    fixedSeed?: number | null;
}
    | {
    source: "DAILY";
    setId: number;
    type: "CHOICE" | "OX" | "INITIALS";
    role?: string;
    date?: string;
    seedMode?: "AUTO" | "DAILY" | "FIXED";
    fixedSeed?: number | null;
};

async function tryPost(url: string, body: any) {
    return http.post(url, body, {
        headers: { ...authHeader() },
        withCredentials: true,
        validateStatus: () => true,
    });
}

/** 통합 시작 호출 */
export async function startQuizUnified(payload: StartQuizSessionUnifiedPayload) {
    let res = await tryPost(`/me/quiz/sessions/start`, payload);
    if (res.status === 404) {
        res = await tryPost(`/api/me/quiz/sessions/start`, payload);
    }
    if (res.status < 200 || res.status >= 300) {
        const msg = (res.data && (res.data.message || res.data.error)) || `HTTP ${res.status}`;
        const err: any = new Error(msg);
        err.response = { status: res.status, data: res.data };
        throw err;
    }
    return res.data as {
        sessionId: number;
        quizSetId: number;
        questionIds: number[];
    };
}

/** “오답만 다시 풀기” 클릭 전에 세션 요약을 조회해서 status가 SUBMITTED인지 체크 */
export type SessionSummary = { id: number; status: "IN_PROGRESS" | "SUBMITTED" | string };

export async function getSessionSummary(sessionId: number) {
    const res = await http.get<SessionSummary>(
        `/me/quiz/sessions/${sessionId}`,
        { headers: authHeader(), withCredentials: true }
    );
    return res.data;
}

/** 데일리 세트 전용 헬퍼 */
export function startDailySetSession(setId: number) {
    return startQuizUnified({ source: "set", setId, seedMode: "DAILY" });
}

export async function getSessionReport(id: number) {
    const { data } = await http.get(`/me/quiz/sessions/${id}/result`, {
        headers: authHeader(),
        withCredentials: true,
    });
    return data?.data ?? data;
}
