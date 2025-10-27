/* ================== 마이페이지 대쉬보드 ================== */

import React, { useEffect, useState } from "react";
import {
    getAttendanceRate,
    getQuizCompletion,
    getWritingCount,
    AttendanceRateResponse,
    QuizCompletionResponse,
    WritingCountResponse,
} from "../../api/dashboardApi.ts";
import { fetchTrustScore, TrustScoreResponse } from "../../api/userTrustScoreApi.ts";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import TitleSection from "./TitleSection.tsx";
import TrustScoreModal from "../modals/TrustScoreModal.tsx";
import WritingModal from "../modals/WritingModal.tsx";
import { notifyError } from "../../utils/toast";
import { theme } from "../../styles/theme";

const COLORS = [theme.color.primary, "rgb(229,231,235)"];

/* ---------- 도넛 데이터 ---------- */
const makeDonutData = (percent: number) => [
    { name: "progress", value: percent },
    { name: "remain", value: 100 - percent },
];

/* ---------- 도넛 차트 컴포넌트 ---------- */
function DonutChart({ value, label, unit, onDetailClick }: {
    value: number;
    label: string;
    unit: string;
    onDetailClick?: () => void;
}) {
    const percent = Math.min(100, value);
    const isPrimary = label === "활동 점수";

    return (
        <DonutCard isPrimary={isPrimary}>
            {/* ✅ 라벨을 위로 이동 */}
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

/* ---------- 메인 컴포넌트 ---------- */
export default function DashboardSection() {
    const [attendance, setAttendance] = useState<AttendanceRateResponse | null>(null);
    const [interview, setInterview] = useState<{ interviewTotalCount: number; interviewMonthlyCount: number } | null>(null);
    const [quiz, setQuiz] = useState<QuizCompletionResponse | null>(null);
    const [writing, setWriting] = useState<WritingCountResponse | null>(null);
    const [trust, setTrust] = useState<TrustScoreResponse | null>(null);

    const [trustModalOpen, setTrustModalOpen] = useState(false);
    const [writingModalOpen, setWritingModalOpen] = useState(false);

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
        ]).then((results) => {
            const [att, quiz, writing, trust] = results;

            if (att.status === "fulfilled") setAttendance(att.value);
            if (quiz.status === "fulfilled") setQuiz(quiz.value);
            if (writing.status === "fulfilled") setWriting(writing.value);
            if (trust.status === "fulfilled") setTrust(trust.value);
        });

        // 임시 목데이터
        setInterview({
            interviewTotalCount: 12,
            interviewMonthlyCount: 3,
        });
    }, []);

    if (!attendance || !interview || !quiz || !writing || !trust) {
        return <LoadingText>불러오는 중...</LoadingText>;
    }

    return (
        <>
            <Section>
                <SectionTitle>나의 활동 로그</SectionTitle>

                {/* 상단 텍스트 카드 */}
                <TopCardGrid>
                    <TopCard>
                        <p>이번 달 출석</p>
                        <strong>
                            {attendance.attended}/{attendance.totalDays}일
                        </strong>
                    </TopCard>
                    <TopCard>
                        <p>총 모의면접</p>
                        <strong>{interview.interviewTotalCount}회</strong>
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
                    <DonutChart value={interview.interviewMonthlyCount} label="이번 달 모의면접" unit="회" />
                    <DonutChart value={quiz.quizMonthlyCount} label="이번 달 문제풀이" unit="개" />
                    <DonutChart
                        value={trust.totalScore}
                        label="활동 점수"
                        unit="점"
                        onDetailClick={() => setTrustModalOpen(true)}
                    />
                </DonutGrid>
            </Section>

            {/* 모달 */}
            <WritingModal isOpen={writingModalOpen} onClose={() => setWritingModalOpen(false)} writing={writing} />
            <TrustScoreModal isOpen={trustModalOpen} onClose={() => setTrustModalOpen(false)} trust={trust} />

            {/* 칭호 섹션 */}
            <Section>
                <SectionTitle>나의 칭호 현황</SectionTitle>
                <TitleSection />
            </Section>
        </>
    );
}

/* ================== styled-components ================== */

const Section = styled.section`
    background: ${theme.color.bgWhite};
    backdrop-filter: blur(8px);
    border-radius: ${theme.radius.section};
    padding: ${theme.spacing.sectionPadding};
    box-shadow: ${theme.shadow.section};
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const SectionTitle = styled.h2`
    ${theme.mixin.sectionTitle}
`;

const TopCardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @media (max-width: 900px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const DetailButton = styled.button`
    margin-top: 10px;
    padding: 6px 14px;
    font-size: ${theme.font.small};
    font-weight: 600;
    background: linear-gradient(90deg, ${theme.color.primary}, ${theme.color.secondary});
    color: white;
    border: none;
    border-radius: ${theme.radius.button};
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.25);
    transition: all 0.25s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
    }
`;

const TopCard = styled.div`
    background: white;
    border-radius: ${theme.radius.card};
    padding: ${theme.spacing.cardPadding};
    text-align: center;
    box-shadow: ${theme.shadow.card};
    transition: all 0.25s ease;
    border-top: 4px solid rgba(59, 130, 246, 0.5);

    display: flex;
    flex-direction: column;
    justify-content: center; /* 기본 중앙 정렬 */
    align-items: center;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    }

    p {
        font-size: ${theme.font.small};
        color: ${theme.color.textMuted};
        margin: 4px 0;
    }

    strong {
        font-size: 18px;
        font-weight: 700;
        color: ${theme.color.text};
        margin-bottom: 6px;
    }

    /* 버튼이 있을 때는 하단 여백 확보 */
    ${DetailButton} {
        margin-top: auto; /* 카드 하단에 정렬 */
    }
`;

const DonutGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @media (max-width: 900px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const DonutCard = styled.div<{ isPrimary?: boolean }>`
    padding: 20px 10px 16px;
    background: ${({ isPrimary }) => (isPrimary ? "#EFF6FF" : "white")};
    border: ${({ isPrimary }) =>
            isPrimary ? `1.5px solid ${theme.color.primary}` : `1px solid ${theme.color.border}`};
    border-radius: ${theme.radius.card};
    box-shadow: ${theme.shadow.card};
    transition: all 0.25s ease;
    text-align: center;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

const ChartWrapper = styled.div`
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CenterText = styled.div`
    position: absolute;
    text-align: center;

    p {
        font-size: 22px;
        font-weight: 700;
        color: ${theme.color.text};
    }
`;

const DonutLabelTop = styled.p`
    font-size: ${theme.font.small};
    color: ${theme.color.textMuted};
    margin-bottom: 12px;
    text-align: center;
`;

const LoadingText = styled.p`
    font-size: ${theme.font.body};
    color: ${theme.color.textMuted};
    text-align: center;
    margin-top: 40px;
`;
