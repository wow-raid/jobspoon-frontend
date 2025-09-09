import React, { useEffect, useState } from "react";
import {
    getAttendanceRate,
    getInterviewCompletion,
    AttendanceRateResponse,
    InterviewCompletionResponse,
    QuizCompletionResponse, getQuizCompletion
} from "../api/dashboardApi.ts";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import RankSection from "./RankSection.tsx";
import TitleSection from "./TitleSection.tsx";

const COLORS = ["rgb(59,130,246)", "rgb(229,231,235)"]; // 파랑 / 회색

// 공통 도넛 데이터 생성
const makeDonutData = (percent: number) => [
    { name: "progress", value: percent },
    { name: "remain", value: 100 - percent },
];

// 공통 도넛 차트 컴포넌트
function DonutChart({
                        value,
                        label,
                        unit,
                        max = 100,
                    }: {
    value: number;
    label: string;
    unit: string;
    max?: number;
}) {
    const percent = Math.min(100, (value / max) * 100); // % 변환

    return (
        <DonutCard>
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
                        {/* 소수점 둘째 자리에서 반올림 */}
                        {unit === "%" ? value.toFixed(1) : Math.round(value)}
                        {unit}
                    </p>
                </CenterText>
            </ChartWrapper>
            <DonutLabel>{label}</DonutLabel>
        </DonutCard>
    );
}

export default function DashboardSection() {
    const [attendance, setAttendance] = useState<AttendanceRateResponse | null>(null);
    const [interview, setInterview] = useState<InterviewCompletionResponse | null>(null);
    const [quiz, setQuiz] = useState<QuizCompletionResponse | null>(null);

    // 👉 Mock 데이터 (백 준비 전)
    const [review] = useState({ reviewCount: 12 });
    const [studyroom] = useState({ studyroomCount: 3 });
    const [comment] = useState({ commentCount: 27 });
    const [trust] = useState({ trustScore: 88 });

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if(!token){
            console.error("로그인 토큰 없음");
            return;
        }
        getAttendanceRate(token).then(setAttendance).catch(console.error);
        getInterviewCompletion(token).then(setInterview).catch(console.error);
        getQuizCompletion(token).then(setQuiz).catch(console.error);
    }, []);

    if (!attendance || !interview || !quiz) {
        return <p>불러오는 중...</p>;
    }

    return (
        <>
            {/* 나의 활동 로그 */}
            <Section>
                <SectionTitle>나의 활동 로그</SectionTitle>

                {/* 텍스트 로그 */}
                <TopCardGrid>
                    <TopCard>
                        <p>이번 달 출석</p>
                        <strong>{attendance.attended}/{attendance.totalDays}일</strong>
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
                        <strong>{review.reviewCount}개</strong>
                    </TopCard>
                </TopCardGrid>

                {/* 도넛 차트 */}
                <DonutGrid>
                    <DonutChart value={attendance.attendanceRate} label="이번 달 출석률" unit="%" max={100} />
                    <DonutChart value={interview.interviewMonthlyCount} label="이번 달 모의면접" unit="회" max={10} />
                    <DonutChart value={quiz.quizMonthlyCount} label="이번 달 문제풀이" unit="개" max={20} />
                    <DonutChart value={trust.trustScore} label="신뢰 점수" unit="점" max={100} />
                </DonutGrid>
            </Section>

            {/* 나의 랭크 현황 */}
            <Section>
                <RankSection />
            </Section>

            {/* 나의 칭호 현황 */}
            <Section>
                <TitleSection />
            </Section>
        </>
    );
}

/* ================== styled-components ================== */

const Section = styled.section`
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;

    /* 추가 */
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: rgb(17, 24, 39);
`;

/* ✅ 상단 카드 레이아웃 */
const TopCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

/* ✅ 상단 카드 레이아웃 */
const TopCard = styled.div`
  background: rgb(249, 250, 251);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  p {
    font-size: 14px;
    color: rgb(107, 114, 128);
    margin-bottom: 8px;
  }

  strong {
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
  }
`;

const LogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const LogItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgb(249, 250, 251);
  border-radius: 8px;

  span {
    font-size: 13px;
    color: rgb(107, 114, 128);
  }

  strong {
    font-weight: 600;
    color: rgb(37, 99, 235);
  }
`;

const DonutGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const DonutCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgb(229, 231, 235);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenterText = styled.div`
  position: absolute;
  text-align: center;

  p {
    font-size: 18px;
    font-weight: 600;
    color: rgb(17, 24, 39);
  }
`;

const DonutLabel = styled.p`
  font-size: 14px;
  color: rgb(107, 114, 128);
  margin-top: 12px;
`;