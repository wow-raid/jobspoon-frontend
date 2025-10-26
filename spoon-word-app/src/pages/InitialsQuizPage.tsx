import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InitialsQuizCard from "../components/InitialsQuizCard";

export default function InitialsQuizPage() {
    const nav = useNavigate();

    const total = 5;
    const [idx, setIdx] = useState(1);
    const [answer, setAnswer] = useState("");
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = () => setShowResult(true);

    const handleNext = () => {
        if (idx >= total) {
            // 마지막 → 결과 페이지 이동
            nav("/spoon-word/quiz/result");
            return;
        }
        // 다음 문제로
        setIdx(i => i + 1);
        setAnswer("");
        setShowResult(false);
    };

    return (
        <InitialsQuizCard
            index={idx}
            total={total}
            question="자료구조의 대표적 선형 구조"
            initials={["ㅂ","ㅣ","ㅇ","ㅣ","ㄴ"]}
            value={answer}
            onChange={setAnswer}
            onSubmit={handleSubmit}
            onNext={handleNext}
            showResult={showResult}
            correctAnswer="배열"
        />
    );
}
