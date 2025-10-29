/* ================== 마이페이지 대쉬보드 ================== */

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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
import TrustScoreModal from "../modals/TrustScoreModal.tsx";
import WritingModal from "../modals/WritingModal.tsx";
import GrowthSection from "./GrowthSection.tsx";
import { notifyError } from "../../utils/toast";

/* ================== 기본 색상 팔레트 ================== */
const palette = {
    primary: "#4CC4A8",   // 따뜻한 민트
    accent: "#3AB49A",    // 포인트용
    lightBG: "#F8FBF8",   // 연한 배경
    border: "rgba(76,196,168,0.35)",
    shadow: "rgba(76,196,168,0.22)",
    textMain: "#0F172A",
    textSub: "#64748B",
};

const COLORS = [palette.primary, "rgb(229,231,235)"];

/* ================== 애니메이션 ================== */
const fadeUp = keyframes`
  from { opacity: 0; margin-top: 16px; }
  to { opacity: 1; margin-top: 0; }
`;

/* ================== 도넛 차트 구성 ================== */
const makeDonutData = (percent: number) => [
    { name: "progress", value: percent },
    { name: "remain", value: 100 - percent },
];

function DonutChart({
                        value,
                        label,
                        unit,
                        onDetailClick,
                    }: {
    value: number;
    label: string;
    unit: string;
    onDetailClick?: () => void;
}) {
    const percent = Math.min(100, value);
    const isPrimary = label === "활동 점수";

    return (
        <DonutCard isPrimary={isPrimary}>
            <DonutLabelTop>{label}</DonutLabelTop>

            <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={makeDonutData(percent)}
                            innerRadius={40}
                            outerRadius={55}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                        >
                            <Cell fill={COLORS[0]} />
                            <Cell fill={COLORS[1]} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <CenterText>
                    <p>
                        {unit === "%" ? value.toFixed(1) : Math.round(value)}
                        {unit}
                    </p>
                </CenterText>
            </ChartWrapper>

            {isPrimary && <DetailButton onClick={onDetailClick}>자세히 보기</DetailButton>}
        </DonutCard>
    );
}

/* ================== 메인 컴포넌트 ================== */
export default function DashboardSection() {
    /* ---------- 상태값 ---------- */
    const [attendance, setAttendance] = useState<AttendanceRateResponse | null>(null);
    const [interview, setInterview] = useState<{ total: number; monthly: number } | null>(null);
    const [quiz, setQuiz] = useState<QuizCompletionResponse | null>(null);
    const [writing, setWriting] = useState<WritingCountResponse | null>(null);
    const [trust, setTrust] = useState<TrustScoreResponse | null>(null);
    const [history, setHistory] = useState<TrustScoreHistoryResponse[]>([]);

    const [trustModalOpen, setTrustModalOpen] = useState(false);
    const [writingModalOpen, setWritingModalOpen] = useState(false);

    /* ---------- 데이터 로드 ---------- */
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            notifyError("로그인이 필요합니다."); // 문자열 반환 안 함
            return; // 단순 종료 (undefined 반환)
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

        // 임시 mock 데이터 (AI면접)
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
            <Section>
                <SectionTitle>나의 활동 로그</SectionTitle>

                {/* 텍스트 카드 */}
                <TopCardGrid>
                    <TopCard>
                        <p>이번 달 출석</p>
                        <strong>
                            {attendance.attended}/{attendance.totalDays}일
                        </strong>
                    </TopCard>
                    <TopCard>
                        <p>총 모의면접</p>
                        <strong>{interview.total}회</strong>
                    </TopCard>
                    <TopCard>
                        <p>총 문제풀이</p>
                        <strong>{quiz.quizTotalCount}개</strong>
                    </TopCard>
                    <TopCard>
                        <p>총 글 작성</p>
                        <strong>{writing.totalCount}개</strong>
                        <DetailButton onClick={() => setWritingModalOpen(true)}>
                            자세히 보기
                        </DetailButton>
                    </TopCard>
                </TopCardGrid>

                {/* 도넛 차트 */}
                <DonutGrid>
                    <DonutChart value={attendance.attendanceRate} label="이번 달 출석률" unit="%" />
                    <DonutChart value={interview.monthly} label="이번 달 모의면접" unit="회" />
                    <DonutChart value={quiz.quizMonthlyCount} label="이번 달 문제풀이" unit="개" />
                    <DonutChart
                        value={trust.totalScore}
                        label="활동 점수"
                        unit="점"
                        onDetailClick={() => setTrustModalOpen(true)}
                    />
                </DonutGrid>
            </Section>

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
                    <GrowthSection
                        history={history}
                        currentScore={trust.totalScore ?? 0}
                    />
                </GraphWrapper>
            </BaseCard>

            {/* 모달 */}
            <WritingModal
                isOpen={writingModalOpen}
                onClose={() => setWritingModalOpen(false)}
                writing={writing}
            />
            <TrustScoreModal
                isOpen={trustModalOpen}
                onClose={() => setTrustModalOpen(false)}
                trustScore={trust}
                trustStatus={trust ? "loaded" : "empty"}
            />
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

/* ---------- 카드 ---------- */
const TopCardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const TopCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border-top: 4px solid ${palette.border};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s ease;
    &:hover {
        transform: translateY(-3px);
    }

    p {
        font-size: 13px;
        color: ${palette.textSub};
    }
    strong {
        font-size: 18px;
        color: ${palette.textMain};
    }
`;

const DetailButton = styled.button`
    margin-top: 10px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 600;
    background: linear-gradient(90deg, ${palette.primary}, ${palette.accent});
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 4px ${palette.shadow};
    transition: all 0.25s ease;
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 8px ${palette.shadow};
    }
`;

/* ---------- 도넛 ---------- */
const DonutGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const DonutCard = styled.div<{ isPrimary?: boolean }>`
    padding: 20px 10px 16px;
    background: ${({ isPrimary }) =>
            isPrimary
                    ? `linear-gradient(180deg, rgba(16,185,129,0.04), rgba(59,130,246,0.05))`
                    : "white"};
    border: ${({ isPrimary }) =>
            isPrimary ? `1.5px solid ${palette.primary}` : "1px solid #E5E7EB"};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.2s ease;
    &:hover {
        transform: translateY(-3px);
    }
`;

const DonutLabelTop = styled.p`
    font-size: 13px;
    color: ${palette.textSub};
    margin-bottom: 12px;
    text-align: center;
`;

const ChartWrapper = styled.div`
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
`;

const CenterText = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    p {
        font-size: 22px;
        font-weight: 700;
        color: ${palette.textMain};
        margin: 0;
        line-height: 1;
    }
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