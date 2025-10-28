import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizResultPage from "../pages/QuizResultPage";

type OX = "O" | "X";
const QUIZ_LEN = 3;
const LS_KEY = "quiz/initials-or-ox/progress";

export default function QuizResultRoute() {
    const nav = useNavigate();
    const { state } = useLocation() as { state?: { progress?: (OX|null)[] } };

    const stored = React.useMemo<(OX|null)[] | null>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            return raw ? (JSON.parse(raw) as (OX|null)[]) : null;
        } catch { return null; }
    }, []);

    const progress: (OX|null)[] =
        (state?.progress && state.progress.length === QUIZ_LEN ? state.progress :
            stored && stored.length === QUIZ_LEN ? stored :
                Array.from({ length: QUIZ_LEN }, () => null));

    return (
        <QuizResultPage
            progress={progress}
            onRetryWrong={() => nav("/spoon-word/quiz/play")} // 혹은 initials/ox 중 원하는 시작점
            onFinish={() => nav("/spoon-word")}
        />
    );
}
