import http, { authHeader } from "../utils/http";

export type StartQuizSessionUnifiedPayload = {
    source: "folder" | "category";
    folderId?: number;
    categoryId?: number;
    count: number;
    type: "mix" | "choice" | "ox" | "initials";
    level: "mix" | "easy" | "medium" | "hard";
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

/** 폴더/카테고리 통합 시작 */
export async function startQuizUnified(payload: StartQuizSessionUnifiedPayload) {
    let res = await tryPost(`/me/quiz/sessions/start`, payload);
    if (res.status === 404) {
        res = await tryPost(`/api/me/quiz/sessions/start`, payload);
    }
    if (res.status < 200 || res.status >= 300) {
        const msg = (res.data && (res.data.message || res.data.error)) || `HTTP ${res.status}`;
        const err: any = new Error(msg);
        (err.response = { status: res.status, data: res.data });
        throw err;
    }
    return res.data;
}