import http, { authHeader } from "../utils/http";

export type ChoiceQuestion = {
    id?: number;
    q: string;
    choices: string[];
    correctIndex: number; // 0-based
    explanation?: string;
};

export type RetryWrongResponse = {
    newSessionId: number;
    questionType: "CHOICE" | "OX" | "INITIALS";
    questionCount: number;
    playPath?: string; // 백엔드가 주면 그대로 사용
};

export async function retryWrongOnly(sessionId: number) {
    const res = await http.post(
        `/me/quiz/sessions/${sessionId}/retry-wrong`,
        {},
        { headers: authHeader(), withCredentials: true }
    );
    return res.data as {
        newSessionId: number;
        questionType: "CHOICE" | "OX" | "INITIALS";
        questionCount: number;
        playPath?: string;
    };
}

const CANDIDATES = (setId: number) => [
    { method: "get", url: `/quiz/sets/${setId}/questions`, params: { part: "CHOICE" as const } },
];

// === 요청 합치기 + TTL 캐시 ===
const Q_TTL = 5 * 60_000; // 5분
const qCache = new Map<number, { expires: number; value: ChoiceQuestion[] }>();
const qInflight = new Map<number, Promise<ChoiceQuestion[]>>();

function toStringSafe(v: any) {
    return v == null ? "" : String(v);
}
function mapOne(raw: any): ChoiceQuestion {
    const q =
        raw.questionText ?? raw.question_text ?? raw.question ?? raw.text ?? "";
    let choices: string[] = [];
    if (Array.isArray(raw.choices) && raw.choices.length) {
        choices = raw.choices.map(toStringSafe);
    } else {
        const cand = [raw.choice1, raw.choice2, raw.choice3, raw.choice4]
            .filter((v) => v != null)
            .map(toStringSafe);
        choices = cand.length ? cand : ["보기1", "보기2", "보기3", "보기4"];
    }

    let ci: any =
        raw.correctIndex ??
        raw.correct_index ??
        raw.answer_index ??
        raw.answerIndex ??
        raw.correctChoiceIndex ??
        raw.correct_choice_index;

    if (typeof ci !== "number") {
        const answerText =
            raw.answerText ?? raw.answer_text ?? raw.answer ?? raw.correct;
        if (answerText != null) {
            const idx = choices.findIndex((c) => c.trim() === String(answerText).trim());
            ci = idx >= 0 ? idx : 0;
        } else {
            ci = 0;
        }
    } else {
        if (ci >= 1 && ci <= choices.length) ci = ci - 1;
    }

    const explanation =
        raw.explanation ?? raw.explain ?? raw.desc ?? raw.description ?? undefined;

    return {
        id: raw.id ?? raw.questionId ?? raw.question_id,
        q: toStringSafe(q),
        choices,
        correctIndex: Number.isInteger(ci)
            ? Math.max(0, Math.min(ci, choices.length - 1))
            : 0,
        explanation: explanation ? String(explanation) : undefined,
    };
}

export async function fetchChoiceQuestionsBySetId(setId: number): Promise<ChoiceQuestion[]> {
    const now = Date.now();
    const cached = qCache.get(setId);
    if (cached && cached.expires > now) return cached.value;

    const inflight = qInflight.get(setId);
    if (inflight) return inflight;

    const p = (async () => {
        let lastErr: any = null;
        for (const c of CANDIDATES(setId)) {
            try {
                const res = await (c.method === "get"
                        ? http.get(c.url, { params: (c as any).params, withCredentials: true })
                        : http.post(c.url, (c as any).data, { params: (c as any).params, withCredentials: true })
                );

                const d = res.data?.data ?? res.data ?? [];
                const list = Array.isArray((d as any)?.questions) ? (d as any).questions : Array.isArray(d) ? d : [];
                const mapped = list.map(mapOne);

                qCache.set(setId, { expires: now + Q_TTL, value: mapped });
                return mapped;
            } catch (e) {
                lastErr = e;
            }
        }
        throw lastErr ?? new Error("객관식 문항을 불러오지 못했습니다.");
    })();

    qInflight.set(setId, p);
    try {
        return await p;
    } finally {
        qInflight.delete(setId);
    }
}
