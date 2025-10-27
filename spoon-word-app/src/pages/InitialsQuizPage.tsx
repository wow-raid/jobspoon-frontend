import React from "react";
import { useNavigate } from "react-router-dom";
import InitialsQuizCard from "../components/InitialsQuizCard";

type OX = "O" | "X";

const QUIZ = [
    { q: "자료구조의 대표적 선형 구조", initials: ["ㅂ","ㅣ","ㅇ","ㅣ","ㄴ"], answer: "배열" },
    { q: "두 번째 문제", initials: ["ㅅ","ㅜ","ㅈ"], answer: "수정" },
    { q: "세 번째 문제", initials: ["ㅈ","ㅓ","ㅂ"], answer: "접" },
];
const QUIZ_LEN = QUIZ.length;
const LS_KEY = "quiz/initials-or-ox/progress";

export default function InitialsQuizPage() {
    const nav = useNavigate();

    const [idx, setIdx] = React.useState(1);       // 1-based
    const [answer, setAnswer] = React.useState("");
    const [showResult, setShowResult] = React.useState(false);
    const [progress, setProgress] = React.useState<(OX|null)[]>(
        () => Array.from({ length: QUIZ_LEN }, () => null)
    );

    const cur = QUIZ[idx - 1];
    const isCorrect = showResult && answer.trim() === cur.answer.trim();

    const handleSubmit = () => {
        if (!answer.trim()) return;
        setShowResult(true);
    };

    // 결과가 열리면 진행도에 반영(한 번만)
    React.useEffect(() => {
        if (!showResult) return;
        setProgress(prev => {
            const next = [...prev];
            if (next[idx - 1] == null) next[idx - 1] = isCorrect ? "O" : "X";
            localStorage.setItem(LS_KEY, JSON.stringify(next));
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showResult]);

    const handleNext = () => {
        if (idx >= QUIZ_LEN) {
            nav("/spoon-word/quiz/result", { state: { progress } });
            return;
        }
        setIdx(i => i + 1);
        setAnswer("");
        setShowResult(false);
    };

    return (
        <InitialsQuizCard
            index={idx}
            total={QUIZ_LEN}
            question={cur.q}
            initials={cur.initials}
            value={answer}
            onChange={setAnswer}
            onSubmit={handleSubmit}
            onNext={handleNext}
            showResult={showResult}
            correctAnswer={cur.answer}
            progress={progress}
        />
    );
}
