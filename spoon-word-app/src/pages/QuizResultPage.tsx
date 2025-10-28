// QuizResultPage.tsx
import React from "react";
import styled, { createGlobalStyle } from "styled-components";

const ASSET = process.env.MFE_PUBLIC_SERVICE || "";

const GhanaFont = createGlobalStyle`
    @font-face {
        font-family: 'GhanaChocolate';
        src: url('${ASSET}/fonts/ghana-choco/GhanaChocolate.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }
`;

type OX = "O" | "X";

type ResultProps = {
    progress: (OX | null)[];
    onRetryWrong?: () => void;
    onFinish?: () => void;
    onClose?: () => void;
    title?: string;
};

const UI = {
    navy: "#173579",
    panel: "#ffffff",
    text: "#0f172a",
    success: "#28C8A3",
    xBlue: "#5C86F7",
    shadow: "0 30px 80px rgba(21, 35, 78, .32)",
    radius: 22,
    bodyBg: "#f7faff",
    /* ▼ 추가 */
    line: "#e5e7eb",
    primary: "#4F76F1",
    primaryStrong: "#3E63E0",
    quizHover: "#2c73e5",
    brandGrad: "linear-gradient(135deg, #4F76F1 0%, #3E63E0 100%)",
};

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    background: rgba(5, 12, 30, .42);
    padding: clamp(12px, 2vw, 24px);
`;

/* 모달 크기 축소 (가로폭·최소높이 ↓) */
const Panel = styled.section`
    --cta-w: clamp(140px, 18vw, 220px);
    width: min(92vw, 900px);
    aspect-ratio: 16 / 9;
    min-height: clamp(420px, 52vw, 620px);
    background: ${UI.panel};
    border-radius: ${UI.radius}px;
    box-shadow: ${UI.shadow};
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr;
    letter-spacing: -0.02em;
`;

const Band = styled.header`
    --grid: clamp(20px, 2.0vw, 20px);
    position: relative;
    background: ${UI.navy};
    color: #fff;
    text-align: center;
    padding: clamp(18px, 3vw, 28px) clamp(16px, 3vw, 24px);
    overflow: hidden;

    /* 살짝 보이는 눈금 패턴 */
    &::before{
        content:"";
        position:absolute; inset:0; pointer-events:none;
        background-image:
                repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0, rgba(255,255,255,.06) 1px, transparent 1px, transparent var(--grid)),
                repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0, rgba(255,255,255,.05) 1px, transparent 1px, transparent var(--grid));
        opacity:.9;
        mix-blend-mode:soft-light;
    }

    /* 상단 좌/우 흰색 코너 장식 */
    &::after{
        --cap-t: 2px;                              /* 선 두께 */
        --cap-l-h: clamp(28px, 4vw, 48px);         /* 가로 길이 */
        --cap-l-v: clamp(10px, 1.6vw, 16px);       /* 세로 길이 */
        --cap-x: clamp(12px, 2vw, 20px);           /* 좌우 오프셋 */
        --cap-y: clamp(8px, 1.2vw, 12px);          /* 위쪽 오프셋 */

        content:"";
        position:absolute; inset:0; pointer-events:none;
        background:
            /* 좌측 상단 ㄴ */
                linear-gradient(#fff 0 0) top var(--cap-y) left var(--cap-x) / var(--cap-l-h) var(--cap-t) no-repeat,
                linear-gradient(#fff 0 0) top calc(var(--cap-y) + var(--cap-t)) left var(--cap-x) / var(--cap-t) var(--cap-l-v) no-repeat,
                    /* 우측 상단 ㄱ (대칭) */
                linear-gradient(#fff 0 0) top var(--cap-y) right var(--cap-x) / var(--cap-l-h) var(--cap-t) no-repeat,
                linear-gradient(#fff 0 0) top calc(var(--cap-y) + var(--cap-t)) right var(--cap-x) / var(--cap-t) var(--cap-l-v) no-repeat;
        opacity:.25; 
    }

    @media (prefers-contrast: more){
        &::before{ display:none; }
        &::after{ opacity:.5; }
    }
`;

const Title = styled.h2`
    margin: 0 0 8px;
    font-family: 'GhanaChocolate', 'Pretendard', system-ui, sans-serif;
    font-size: clamp(24px, 3.2vw, 40px);
    font-weight: 400;
    letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
    margin: 0;
    font-weight: 600;
    font-size: clamp(18px, 2.4vw, 24px);
    letter-spacing: -0.02em;

    & em {
        color: ${UI.success};
        font-style: normal;
        font-weight: 750;
        /* 0문제만 살짝 크게 */
        font-size: clamp(22px, 3.0vw, 30px);
        letter-spacing: -0.02em;
    }
`;

/* ▶ 본문: 제목/아이콘/버튼 3행 */
const Body = styled.div`
    background: ${UI.bodyBg};
    padding: clamp(18px, 2.4vw, 28px);
    display: grid;
    grid-template-rows: auto 1fr auto;
    row-gap: clamp(12px, 1.6vw, 18px);
`;

const Grid = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(10px, 2vw, 22px);
    align-items: start;
    justify-items: center;
`;

const ICON_W = "clamp(110px, 16vw, 200px)"; // 아이콘/제목 공통 가로폭

const Item = styled.div`
    display: grid;
    justify-items: center;
`;

const TitleBar = styled.div`
    width: ${ICON_W};
    display: inline-flex;
    justify-content: center;
    align-items: flex-end;
    gap: clamp(4px, .6vw, 8px);        
    line-height: 1;
    white-space: nowrap;

    margin-top: clamp(10px, 1.8vw, 22px);
    margin-bottom: clamp(8px, 1vw, 12px);

    color: ${UI.text};
    letter-spacing: -0.02em;

    .lab {
        font-weight: 750;
        font-size: clamp(16px, 1.9vw, 20px);
        opacity: .95;
        letter-spacing: -0.02em;
    }
    .num {
        color: ${UI.navy};               
        font-weight: 750;
        font-size: clamp(28px, 3.4vw, 36px);
        letter-spacing: -0.02em;
        transform: translateY(2px);
    }
`;

/* 아이콘 영역 높이도 살짝 줄임 */
const IconWrap = styled.div`
    width: 100%;
    display: grid;
    place-items: center;
    height: min(24vh, 220px);
`;

/* O/X 선 두께 */
const BigO = styled.span`
    --ring: clamp(16px, 2.2vw, 22px);
    /* 기존 100px/14.5vw/185px → 살짝 축소 */
    width: clamp(88px, 8.5vw, 160px);
    aspect-ratio: 1;
    border-radius: 999px;
    position: relative;
    background: linear-gradient(135deg, #53DFBE 0%, #36CFAC 100%);

    /* 안쪽을 파서 링처럼 보이게 */
    &::after {
        content: "";
        position: absolute;
        inset: var(--ring);
        border-radius: inherit;
        background: ${UI.bodyBg};
    }
`;

const BigX = styled.span`
    width: ${ICON_W};
    aspect-ratio: 1;
    position: relative;
    display: inline-block;

    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 92%;
        height: clamp(16px, 2.2vw, 22px);
        background: linear-gradient(135deg, #629EFD 0%, #357BE9 100%);
        border-radius: 999px;
    }
    &::before { transform: translate(-50%, -50%) rotate(45deg); }
    &::after  { transform: translate(-50%, -50%) rotate(-45deg); }
`;

const Actions = styled.div`
    display: flex;
    gap: clamp(10px, 2vw, 16px);
    justify-content: center;
    flex-wrap: wrap;
    margin-top: clamp(6px, 1vw, 10px);
`;

const BtnPrimary = styled.button`
    inline-size: var(--cta-w);
    height: clamp(40px, 4.6vw, 48px);
    border-radius: 12px;
    border: 0;
    color: #fff;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-size: clamp(14px, 1.6vw, 16px);
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 2px 10px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.25);
    transition: background-size .26s ease, transform .08s ease;

    background-image:
            linear-gradient(90deg, ${UI.quizHover}, ${UI.quizHover}),
            ${UI.brandGrad};
    background-repeat: no-repeat, no-repeat;
    background-position: 0 0, 0 0;
    background-size: 0% 100%, 100% 100%;

    &:hover{ filter: brightness(.96); }
    &:active{ transform: translateY(1px); }
    &:focus-visible{ outline: none; box-shadow: 0 0 0 3px rgba(79,118,241,.25); }

    /* Exit 아이콘 살짝 움직임 */
    .ico-exit{
        width: clamp(18px, 1.7vw, 22px);
        height: clamp(18px, 1.7vw, 22px);
        transform: translateY(1.5px);
        transition: transform .18s ease;
        flex: 0 0 auto;
    }
    &:hover .ico-exit,
    &:focus-visible .ico-exit{
        transform: translate(2px, 1.5px);
    }
    &:active .ico-exit{
        transform: translate(3px, 1.5px);
    }
    &:disabled .ico-exit{
        transform: translateY(1.5px);
    }

    @media (prefers-reduced-motion: reduce){
        .ico-exit{ transition: none; }
    }
`;

/* 보조 액션: 화이트 + 파랑 테두리 */
const BtnGhost = styled.button`
    inline-size: var(--cta-w);
    height: clamp(40px, 4.6vw, 48px);
    border-radius: 12px;
    border: 1px solid ${UI.primaryStrong};
    background: #fff;
    color: ${UI.primaryStrong};
    font-weight: 700;
    letter-spacing: -0.02em;
    font-size: clamp(14px, 1.6vw, 16px);
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color .15s ease, color .15s ease, border-color .15s ease, transform .08s ease;

    /* 아이콘 살짝 아래로 내리기 (+ 호버 시 회전 유지) */
    .ico-refresh {
        width: clamp(18px, 1.6vw, 22px);
        height: clamp(18px, 1.6vw, 22px);
        transform: translateY(1.5px); 
        transition: transform .18s ease;
    }
    &:hover .ico-refresh {
        transform: translateY(1.5px) rotate(-22deg); 
    }

    &:hover { background: #eef2ff; }
    &:active { transform: translateY(1px); }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(79,118,241,.25); }

    &:disabled{
        opacity:.6; cursor:not-allowed; transform:none;
        .ico-refresh { transform: translateY(1.5px) !important; } /* 회전만 막고 위치는 유지 */
    }
`;

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        aria-hidden="true" className="ico-refresh" {...props}
    >
        <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 5v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ExitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        className="ico-exit"
        aria-hidden="true"
        {...props}
    >
        {/* 문(프레임) – 왼쪽 C 형태 */}
        <path
            d="M10 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* 바깥으로 향하는 화살표 */}
        <path
            d="M16 8l4 4-4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M21 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function QuizResultPage({
                                           progress,
                                           onRetryWrong,
                                           onFinish,
                                           onClose,
                                           title = "결과 보기",
                                       }: ResultProps) {
    const QUIZ_LEN = 3;

    const normalized = React.useMemo<OX[]>(
        () => Array.from({ length: QUIZ_LEN }, (_, i) => (progress[i] ?? "X")),
        [progress]
    );

    const correct = normalized.filter(v => v === "O").length;
    const wrongCount = QUIZ_LEN - correct;

    return (
        <Overlay
            role="dialog"
            aria-modal="true"
            aria-label="퀴즈 결과"
            onClick={onClose}
        >
            <GhanaFont />
            <Panel onClick={(e) => e.stopPropagation()}>
                <Band>
                    <Title>{title}</Title>
                    <Subtitle>
                        총 {QUIZ_LEN}문제 중 <em>{correct}문제</em>를 맞히셨습니다.
                    </Subtitle>
                </Band>

                <Body>
                    <Grid>
                        {normalized.map((v, i) => (
                            <Item key={i}>
                                <TitleBar>
                                    <span className="lab">문제</span>
                                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                                </TitleBar>
                                <IconWrap>
                                    {v === "O" ? (
                                        <BigO aria-label="정답" />
                                    ) : (
                                        <BigX aria-label="오답" />
                                    )}
                                </IconWrap>
                            </Item>
                        ))}
                    </Grid>

                    <Actions>
                        <BtnGhost onClick={onRetryWrong} disabled={wrongCount === 0}>
                            <RefreshIcon />
                            <span>틀린 문제 다시 풀기</span>
                        </BtnGhost>

                        <BtnPrimary onClick={onFinish}>
                            <ExitIcon />
                            <span>학습 완료</span>
                        </BtnPrimary>
                    </Actions>
                </Body>
            </Panel>
        </Overlay>
    );
}