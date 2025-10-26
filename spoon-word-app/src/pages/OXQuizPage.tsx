import React from "react";
import styled from "styled-components";
import OXQuizCard from "../components/OXQuizCard";

const Stage = styled.div`
    width: 100%;
    min-height: calc(100dvh - 110px);
    display: grid;
    place-items: center;
    place-content: center;
    padding: clamp(12px, 2vw, 24px);

    background:
            radial-gradient(50% 38% at 10% 10%, rgba(62,99,224,.06) 0%, rgba(62,99,224,0) 70%),
            radial-gradient(40% 32% at 88% 18%, rgba(62,99,224,.08) 0%, rgba(62,99,224,0) 70%);
    border-radius: 28px;
`;

export default function OXQuizPage() {
    const [value, setValue] = React.useState<"O" | "X" | null>(null);
    const showResult = value !== null;

    const question = "텍스트를 입력하세요.";
    const correct: "O" | "X" = "O";
    const explanation = "텍스트를 입력하세요.";

    return (
        <Stage>
            <OXQuizCard
                index={3}
                question={question}
                value={value}
                onChange={setValue}
                showResult={showResult}
                correct={correct}
                explanation={explanation}
                stats={{ left: "①", wrong: 0, right: "③" }}
            />
        </Stage>
    );
}
