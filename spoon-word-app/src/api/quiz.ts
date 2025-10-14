import http, { authHeader } from "../utils/http";

export type QType = "mix" | "choice" | "ox" | "initials";
export type QLevel = "mix" | "easy" | "medium" | "hard";
export type SeedMode = "AUTO" | "DAILY" | "FIXED";

const mapType = (t: QType) =>
    ({ mix: "MIX", choice: "CHOICE", ox: "OX", initials: "INITIALS" } as const)[t];

const mapLevel = (l: QLevel) =>
    ({ mix: "MIX", easy: "EASY", medium: "MEDIUM", hard: "HARD" } as const)[l];

export async function startSessionFromFolder(params: {
    folderId: number;
    count: number;
    type: QType;
    level: QLevel;
    seedMode?: SeedMode;
    fixedSeed?: number | null;
}) {
    const body = {
        folderId: params.folderId,
        count: params.count,
        questionType: mapType(params.type),
        difficulty: mapLevel(params.level),
        seedMode: params.seedMode ?? "AUTO",
        fixedSeed: params.fixedSeed ?? null,
    };

    const res = await http.post("/me/quiz/sessions/from-folder", body, {
        headers: { ...authHeader() },
        withCredentials: true,
    });
    return res.data;
}

/**
 * 서버 DTO가 categoryId(Long)만 받는 경우:
 *  - 아래 body의 `category`를 `categoryId`로 바꾸고 숫자 전달하도록 변경해줌
 */
export async function startSessionFromCategory(params: {
    categoryId: number
    count: number;
    type: QType;
    level: QLevel;
    seedMode?: SeedMode;
    fixedSeed?: number | null;
}) {
    const body: any = {
        categoryId: params.categoryId,
        count: params.count,
        questionType: mapType(params.type),
        difficulty: mapLevel(params.level),
        seedMode: params.seedMode ?? "AUTO",
        fixedSeed: params.fixedSeed ?? null,
    };

    const res = await http.post("/me/quiz/sessions/from-category", body, {
        headers: { ...authHeader() },
        withCredentials: true,
    });
    return res.data;
}
