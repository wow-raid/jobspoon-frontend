import http from "../utils/http.ts";

const PLAN_TTL = 60_000; // 60s
const planCache = new Map<string, { expires: number; value: DailyPlan }>();
const planInflight = new Map<string, Promise<DailyPlan>>();

export type DailyPlan = {
    date: string;
    part: string;
    role: string;
    quizSetId: number;
    questionIds: number[];
    questionCount: number;
    setTitle?: string;
    exists?: boolean;
};

export async function fetchDailyPlan(params: {
    part: string;
    role?: string;
    date?: string;
}): Promise<DailyPlan> {
    const role = (params.role ?? "GENERAL").toUpperCase();
    const date = params.date ?? "";

    // 캐시 키 버전 올려서 예전 0 카운트 캐시 무력화
    const key = `v2|DAILY_CHOICE|${role}|${date || "today"}`;

    const now = Date.now();
    const cached = planCache.get(key);
    if (cached && cached.expires > now) return cached.value;

    const inflight = planInflight.get(key);
    if (inflight) return inflight;

    const p = (async () => {
        const res = await http.get("/daily/plan", {
            // 서버에는 DAILY_CHOICE로 보냄 (백엔드가 fromParam으로 정규화)
            params: { part: "DAILY_CHOICE", role, date },
            withCredentials: true,
        });
        const d = res.data || {};

        const quizSetId = d.quizSetId ?? d.quiz_set_id ?? d.setId ?? 0;
        const questionIds = d.questionIds ?? d.question_ids ?? [];

        // 서버가 주는 totalQuestions 반영 + 길이 fallback
        let questionCount =
            d.questionCount ??
            d.totalQuestions ??
            d.question_count ??
            (Array.isArray(questionIds) ? questionIds.length : 0);

        // exists 계산(서버 값 우선, 없으면 우리가 계산)
        let exists: boolean =
            (typeof d.exists === "boolean" ? d.exists : undefined) ??
            (quizSetId > 0 && (questionCount > 0 || questionIds.length > 0));

        // 방어: setId 있는데 카운트 0이면 id 길이로 보정
        if (!exists && quizSetId > 0) {
            questionCount = Math.max(questionCount, questionIds.length);
            exists = quizSetId > 0 && questionCount > 0;
        }

        const value: DailyPlan = {
            date: d.date ?? "",
            part: "DAILY_CHOICE",   // 화면 일관성 위해 고정
            role,
            quizSetId,
            questionIds,
            questionCount,
            setTitle: d.setTitle ?? d.title,
            exists,                 // 추가
        };

        planCache.set(key, { expires: now + PLAN_TTL, value });
        return value;
    })();

    planInflight.set(key, p);
    try {
        return await p;
    } finally {
        planInflight.delete(key);
    }
}
