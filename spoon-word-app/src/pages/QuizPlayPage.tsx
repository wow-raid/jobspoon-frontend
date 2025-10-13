import React from "react";
import styled from "styled-components";
import { NarrowLeft } from "../styles/layout";
import { useLocation, useNavigate } from "react-router-dom";
import SoftBlobsBackground from "../components/SoftBlobsBackground";

/* ====== 색/토큰 ====== */
const UI = {
    bgGrad: "radial-gradient(1200px 600px at 50% -120px, rgba(79,118,241,.15) 0%, rgba(62,99,224,.10) 30%, rgba(255,255,255,0) 70%)",
    panel: "#ffffff",
    line: "#e5e7eb",
    text: "#0f172a",
    sub: "#374151",
    muted: "#6b7280",
    primary: "#3E63E0",
    primarySoft: "#e6edff",
    danger: "#ef4444",
    shadow: "0 20px 60px rgba(62,99,224,.15)",
    radius: 20,

    /* 추가: 단어장과 동일 계열 */
    gradient: {
        brand: "linear-gradient(135deg, #4F76F1 0%, #3E63E0 100%)",
        brandSoft: "linear-gradient(135deg, rgba(79,118,241,0.12) 0%, rgba(62,99,224,0.12) 100%)",
    },
};

/* ====== 레이아웃 ====== */
const Screen = styled.div`
  min-height: 60vh;
  padding: 26px 0 46px;
`;

const Card = styled.div`
  background: ${UI.panel};
  border: 1px solid ${UI.line};
  border-radius: 24px;
  box-shadow: ${UI.shadow};
  padding: clamp(20px, 4vw, 36px);
`;

const MetaRow = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;
`;

const Chip = styled.span`
  display: inline-flex; align-items: center;
  height: 28px; padding: 0 12px; border-radius: 999px;
  background: ${UI.primarySoft};
  color: ${UI.primary}; font-weight: 700; font-size: 13px; letter-spacing:-0.02em;
`;

const QTitle = styled.h1`
    margin: 10px 0 18px;
    font-size: clamp(18px, 2.4vw, 22px);
    font-weight: 750;
    color: ${UI.text};
    letter-spacing: -0.02em;
    line-height: 1.35;
    em { font-style: normal; color: ${UI.danger}; font-weight: 750; }
`;

/* ====== 옵션 ====== */
const Options = styled.div`
  display: grid; gap: 16px;
`;

const Opt = styled.button<{ $on?: boolean }>`
  width: 100%;
  display: flex; align-items: center; gap: 14px;
  border: 1px solid ${UI.line};
  background: #fff;
  padding: 16px 16px;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;

  transition: transform .06s ease, background-color .12s ease, border-color .12s ease, box-shadow .12s ease;

  &:hover { background: #fbfbfd; }
  &:active { transform: scale(.99); }
  &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(62,99,224,.25); }

  ${({ $on }) => $on && `
    border-color: ${UI.primary};
    background: #f8faff;
  `}
`;

// const BulletWrap = styled.span<{ $on?: boolean }>`
//   width: 32px; height: 32px; flex: 0 0 auto;
//   display: grid; place-items: center;
//   border-radius: 999px;
//   border: 2px solid ${({ $on }) => ($on ? UI.primary : "#cfd6e4")};
//   background: ${({ $on }) => ($on ? "#6b7280" : "#fff")};
//   box-shadow: inset 0 1px 0 rgba(255,255,255,.4);
// `;
//
// const CheckSvg = () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
//         <path d="M20 7L10 17l-6-6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
// );

/* 단어장과 동일한 체크 UI */
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
        <path d="M20 7L10 17l-6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
);

const Hollow = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid ${UI.primary};
  background: rgba(255, 255, 255, 0.7);
  display: block;
`;

/* 선택/비선택 그라데이션 칩 */
const Bullet = styled.span<{ $on?: boolean }>`
  width: 28px; height: 28px; flex: 0 0 auto;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 999px; border: 0;
  background: ${({ $on }) => ($on ? UI.gradient.brand : UI.gradient.brandSoft)};
  color: ${({ $on }) => ($on ? "#fff" : "#0f172a")};
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.28);
`;

const OptLabel = styled.div`
  font-size: clamp(16px, 2.4vw, 20px);
  font-weight: 700; color: ${UI.text};
`;

/* ====== 하단 버튼 ====== */
const Footer = styled.div`
    margin-top: 28px;
    display: flex; justify-content: flex-end; gap: 10px;
`;

const Ghost = styled.button`
    height: 35px;
    padding: 0 16px;
    border-radius: 5px;
    font-weight: 700;
    background: #fff;
    color: ${UI.primary};
    border: 1px solid ${UI.primary};
    cursor: pointer;
    transition: background-color .15s ease, color .15s ease, border-color .15s ease, transform .08s ease;

    &:hover { background: ${UI.primarySoft}; }
    &:active { transform: translateY(1px); }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(62,99,224,.25); }
    &:disabled { opacity: .6; cursor: not-allowed; }
`;

/* 모달 '퀴즈 시작' 버튼과 동일 */
const Primary = styled.button`
    height: 35px;
    padding: 0 18px;
    border-radius: 5px;
    font-weight: 700;
    letter-spacing: -0.02em;
    background: ${UI.primary};
    border: 1px solid ${UI.primary};
    color: #fff;
    cursor: pointer;
    box-shadow: none;
    transition: filter .15s ease, transform .08s ease;

    &:hover { filter: brightness(0.96); }
    &:active { transform: translateY(1px); }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(79,118,241,.25); }
    &:disabled { opacity: .7; cursor: not-allowed; }
`;

/* ====== 타입 ====== */
type StartState = {
    source?: "folder" | "category" | "selected";
    folderId?: number | null;
    category?: string | null;
    termIds?: number[];
    count?: number;
    type?: "mix" | "mcq" | "ox" | "initial";
    level?: "mix" | "hard" | "normal" | "easy";
};

type QuizOption = { id: string; text: string };
type Quiz = {
    id: string;
    categories: string[];
    question: string;
    options: QuizOption[];
    correctId?: string; // 시연용
};

/* 강조(‘않는’) 하이라이트 */
function emphasizeNot(text: string) {
    return text.replace(/(않는|아닌|NOT)/gi, (m) => `<em>${m}</em>`);
}

export default function QuizPlayPage() {
    const nav = useNavigate();
    const location = useLocation();
    const payload = (location.state ?? {}) as StartState;

    // ── 데모용 샘플 문제 (백엔드 연동 전) ──
    const quiz: Quiz = {
        id: "q1",
        categories: payload.category ? [ "AI / Data / Machine Learning", payload.category ] : [ "AI / Data / Machine Learning", "자연어처리(NLP)" ],
        question: "1. 자기지도 학습 시퀀스 모델링 설명으로 맞지 않는 것은?",
        options: [
            { id: "a", text: "텍스트를 입력하세요." },
            { id: "b", text: "텍스트를 입력하세요." },
            { id: "c", text: "텍스트를 입력하세요." },
            { id: "d", text: "텍스트를 입력하세요." },
        ],
        correctId: "b",
    };

    const [selected, setSelected] = React.useState<string | null>(null);
    const [submitting, setSubmitting] = React.useState(false);

    const submit = async () => {
        setSubmitting(true);
        try {
            // TODO: 서버 제출 API 연결
            console.log("[QUIZ SUBMIT]", {
                payload,
                quizId: quiz.id,
                answerId: selected,
            });
            alert("제출 완료! (시연용)");
            nav(-1);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <SoftBlobsBackground />   {/* 배경 */}
            <Screen>
                <NarrowLeft>
                    <Card>
                        <MetaRow>
                            {quiz.categories.map((c, i) => <Chip key={i}>{c}</Chip>)}
                        </MetaRow>

                        <QTitle
                            dangerouslySetInnerHTML={{ __html: emphasizeNot(quiz.question) }}
                        />

                        <Options role="radiogroup" aria-label="정답 선택">
                            {quiz.options.map((o) => {
                                const on = selected === o.id;
                                return (
                                    <Opt
                                        key={o.id}
                                        $on={on}
                                        role="radio"
                                        aria-checked={on}
                                        onClick={() => setSelected(o.id)}
                                    >
                                        <Bullet aria-hidden $on={on}>
                                            {on ? <CheckIcon /> : <Hollow />}
                                        </Bullet>
                                        <OptLabel>{o.text}</OptLabel>
                                    </Opt>
                                );
                            })}
                        </Options>

                        <Footer>
                            <Ghost onClick={() => nav(-1)}>취소</Ghost>
                            <Primary
                                onClick={submit}
                                disabled={!selected || submitting}   // ← 여기
                            >
                                제출 완료
                            </Primary>
                        </Footer>
                    </Card>
                </NarrowLeft>
            </Screen>
        </>
    );
}
