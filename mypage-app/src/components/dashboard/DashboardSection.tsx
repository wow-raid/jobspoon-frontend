/* ================== 마이페이지 대쉬보드 ================== */

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
    getAttendanceRate,
    getQuizCompletion,
    getWritingCount,
    AttendanceRateResponse,
    QuizCompletionResponse,
    WritingCountResponse,
} from "../../api/dashboardApi.ts";
import {
    fetchTrustScore,
    fetchTrustScoreHistory,
    TrustScoreResponse,
    TrustScoreHistoryResponse,
} from "../../api/userTrustScoreApi.ts";
import TitleSection from "./TitleSection.tsx";
import InterestSection from "./InterestSection.tsx";
import GrowthSection from "./GrowthSection.tsx";
import ActivityLogSection from "./ActivityLogSection.tsx";
import { notifyError } from "../../utils/toast";

/* ================== 기본 색상 팔레트 ================== */
const palette = {
    primary: "#4CC4A8",
    accent: "#3AB49A",
    lightBG: "#F8FBF8",
    border: "rgba(76,196,168,0.35)",
    shadow: "rgba(76,196,168,0.22)",
    textMain: "#0F172A",
    textSub: "#64748B",
};

/* ================== 애니메이션 ================== */
const fadeUp = keyframes`
  from { opacity: 0; margin-top: 16px; }
  to { opacity: 1; margin-top: 0; }
`;

/* ================== 메인 컴포넌트 ================== */
export default function DashboardSection() {
    /* ---------- 상태값 ---------- */
    const [attendance, setAttendance] = useState<AttendanceRateResponse | null>(null);
    const [interview, setInterview] = useState<{ total: number; monthly: number } | null>(null);
    const [quiz, setQuiz] = useState<QuizCompletionResponse | null>(null);
    const [writing, setWriting] = useState<WritingCountResponse | null>(null);
    const [trust, setTrust] = useState<TrustScoreResponse | null>(null);
    const [history, setHistory] = useState<TrustScoreHistoryResponse[]>([]);

    /* ---------- 데이터 로드 ---------- */
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            notifyError("로그인이 필요합니다.");
            return;
        }

        Promise.allSettled([
            getAttendanceRate(),
            getQuizCompletion(),
            getWritingCount(),
            fetchTrustScore(),
        ]).then(([att, quiz, writing, trust]) => {
            if (att.status === "fulfilled") setAttendance(att.value);
            if (quiz.status === "fulfilled") setQuiz(quiz.value);
            if (writing.status === "fulfilled") setWriting(writing.value);
            if (trust.status === "fulfilled") setTrust(trust.value);
        });

        // mock 데이터 (AI면접)
        setInterview({ total: 12, monthly: 3 });
    }, []);

    useEffect(() => {
        fetchTrustScoreHistory().then(setHistory).catch(() => setHistory([]));
    }, []);

    /* ---------- 로딩 처리 ---------- */
    if (!attendance || !interview || !quiz || !writing || !trust)
        return <LoadingText>불러오는 중...</LoadingText>;

    /* ---------- 점수 비교 계산 ---------- */
    const lastMonthScore = history.length > 0 ? history[history.length - 1].score ?? 0 : 0;
    const scoreDiff = trust.totalScore - lastMonthScore;

    /* ================== 렌더링 ================== */
    return (
        <>
            {/* 관심사 */}
            <Section>
                <SectionTitle>나의 관심사</SectionTitle>
                <InterestSection />
            </Section>

            {/* 활동 로그 */}
            <ActivityLogSection />

            {/* 성장 추이 (그래프) */}
            <BaseCard>
                <CardHeader>
                    <HeaderLeft>
                        <SectionTitle>나의 성장 추이</SectionTitle>
                    </HeaderLeft>
                </CardHeader>

                <GraphSummary>
                    <h4>
                        이번 달 활동 점수:{" "}
                        <strong>{trust.totalScore?.toFixed(1) ?? "0.0"}점</strong>
                    </h4>

                    <ChangeTag up={scoreDiff > 0}>
                        {scoreDiff > 0
                            ? `▲ ${scoreDiff.toFixed(1)} 상승`
                            : scoreDiff < 0
                                ? `▼ ${Math.abs(scoreDiff).toFixed(1)} 하락`
                                : "변동 없음"}
                    </ChangeTag>
                </GraphSummary>

                <GraphNotice>
                    현재 그래프는 <strong>지난달까지의 기록</strong>이며,{" "}
                    <strong>이번 달 점수</strong>는 실시간으로 반영 중입니다.
                </GraphNotice>

                <GraphWrapper>
                    <GrowthSection history={history} currentScore={trust.totalScore ?? 0} />
                </GraphWrapper>
            </BaseCard>

            {/* 칭호 */}
            <Section>
                <SectionTitle>나의 칭호 현황</SectionTitle>
                <TitleSection />
            </Section>
        </>
    );
}

/* ================== styled-components ================== */

const Section = styled.section`
    background: rgba(255, 255, 255, 0.75);
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: ${fadeUp} 0.6s ease both;
`;

const SectionTitle = styled.h2`
    font-size: 19px;
    font-weight: 700;
    color: ${palette.textMain};
    margin-bottom: 8px;
`;

const LoadingText = styled.p`
    font-size: 15px;
    color: ${palette.textSub};
    text-align: center;
    margin-top: 40px;
`;

/* ---------- 성장 추이 그래프 ---------- */
const BaseCard = styled.div`
    background: linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%);
    border: 1px solid ${palette.border};
    border-radius: 14px;
    box-shadow: 0 4px 10px ${palette.shadow};
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const GraphSummary = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: ${palette.textMain};
    margin-top: 2px;

    strong {
        color: ${palette.primary};
        font-size: 16px;
    }
`;

const ChangeTag = styled.span<{ up?: boolean }>`
    font-size: 13px;
    font-weight: 700;
    color: ${({ up }) => (up ? "#0E766E" : "#C2410C")};
    background: ${({ up }) =>
    up ? "rgba(16,185,129,0.15)" : "rgba(234,88,12,0.15)"};
    padding: 3px 8px;
    border-radius: 6px;
`;

const GraphNotice = styled.p`
    font-size: 12.5px;
    color: ${palette.textSub};
    margin-top: 4px;
    margin-bottom: 8px;
    strong {
        color: ${palette.primary};
    }
`;

const GraphWrapper = styled.div`
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    padding: 10px 16px;
    transition: 0.3s ease;
    &:hover {
        box-shadow: 0 4px 12px ${palette.shadow};
        transform: translateY(-1px);
    }
`;