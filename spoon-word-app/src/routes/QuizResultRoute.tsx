import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizResultPage from "../pages/QuizResultPage";
import { getSessionReport } from "../api/quiz"

type OX = "O" | "X";
const QUIZ_LEN = 3;
const LS_KEY_LAST_SESSION = "quiz:lastSessionId";

type ResultState = {
    progress?: (OX | null)[];
    sessionId?: number | string;
};

export default function QuizResultRoute() {
    const nav = useNavigate();
    const location = useLocation();
    const { state } = location as { state?: ResultState };

    // 진행도 복구
    const stored = React.useMemo<(OX | null)[] | null>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY_PROGRESS);
            return raw ? (JSON.parse(raw) as (OX | null)[]) : null;
        } catch {
            return null;
        }
    }, []);

    // 세션ID 복구: state → querystring → localStorage
    const sessionId = React.useMemo(() => {
        const fromState = state?.sessionId;
        const fromQs = new URLSearchParams(location.search).get("sessionId");
        const fromLs = localStorage.getItem(LS_KEY_LAST_SESSION);

        const cand = [fromState, fromQs, fromLs].find(
            (v) => v != null && String(v).trim() !== ""
        );
        const n = Number(cand);
        return Number.isFinite(n) ? n : undefined;
    }, [state?.sessionId, location.search]);

    const [serverProgress, setServerProgress] = React.useState<OX[] | null>(null);

    React.useEffect(() => {
        let aborted = false;
        (async () => {
            if (!sessionId) return;
            try {
                // 서버 결과 예: { total, correct, details:[{quizQuestionId, selectedChoiceId, correctChoiceId, correct}, ...] }
                const rep = await getSessionReport(sessionId);
                if (aborted || !rep?.details) return;
                const arr: OX[] = rep.details.map((d: any) => (d?.correct ? "O" : "X"));
                setServerProgress(arr);
            } catch {}
        })();
        return () => { aborted = true; };
    }, [sessionId]);

    const progress: (OX | null)[] =
        serverProgress
            ? serverProgress
            : state?.progress
                ? state.progress
                : stored ?? Array.from({ length: QUIZ_LEN }, () => null);

    return (
        <QuizResultPage
            progress={progress}
            sessionId={sessionId}
            title="결과 보기"
            onClose={() => nav("/spoon-word/quiz", { replace: true })}
            onFinish={() => nav("/spoon-word/quiz", { replace: true })}
        />
    );
}
