{/* 마이페이지 대쉬보드 */}

import React, {useEffect, useState} from "react";
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
    TrustScore
} from "../../api/profileAppearanceApi.ts";
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";
import styled from "styled-components";
import LevelSection from "./LevelSection.tsx";
import TitleSection from "./TitleSection.tsx";
import TrustScoreModal from "../modals/TrustScoreModal.tsx";
import WritingModal from "../modals/WritingModal.tsx";

type InterviewItem = {
    id: number;
    topic: string;
    yearsOfExperience: number;
    created_at: Date;
    status: "IN_PROGRESS" | "COMPLETED"; // 추가
};

const COLORS = ["rgb(59,130,246)", "rgb(229,231,235)"]; // 파랑 / 회색

// 공통 도넛 데이터 생성
const makeDonutData = (percent: number) => [
    {name: "progress", value: percent},
    {name: "remain", value: 100 - percent},
];

// 공통 도넛 차트 컴포넌트
function DonutChart({
                        value,
                        label,
                        unit,
                        max = 100,
                        onDetailClick,
                    }: {
    value: number;
    label: string;
    unit: string;
    max?: number;
    onDetailClick?: () => void;
}) {
    const percent = Math.min(100, value); // % 변환

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
                            <Cell fill={COLORS[0]}/>
                            <Cell fill={COLORS[1]}/>
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

            {/* 신뢰 점수일 때만 버튼 */}
            {label === "신뢰 점수" && (
                <DetailButton onClick={onDetailClick}>자세히 보기</DetailButton>
            )}
        </DonutCard>
    );
}

export default function DashboardSection() {
    const [attendance, setAttendance] = useState<AttendanceRateResponse | null>(null);
    const [interview, setInterview] = useState<{ interviewTotalCount: number; interviewMonthlyCount: number } | null>(null);
    const [quiz, setQuiz] = useState<QuizCompletionResponse | null>(null);
    const [writing, setWriting] = useState<WritingCountResponse | null>(null);
    const [trust, setTrust] = useState<TrustScore | null>(null);

    const [trustModalOpen, setTrustModalOpen] = useState(false);
    const [writingModalOpen, setWritingModalOpen] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            console.error("로그인이 필요합니다.");
            return;
        }

        getAttendanceRate().then(setAttendance).catch(console.error);
        getQuizCompletion().then(setQuiz).catch(console.error);
        getWritingCount().then(setWriting).catch(console.error);
        fetchTrustScore().then(setTrust).catch(console.error);

        // ✅ 임시 목데이터 (API 삭제됨)
        setInterview({
            interviewTotalCount: 12,   // 총 인터뷰 횟수
            interviewMonthlyCount: 3,  // 이번 달 인터뷰 횟수
        });
    }, []);

    if (!attendance || !interview || !quiz || !writing || !trust) {
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
                        <strong>{writing.totalCount}개</strong>
                        <DetailButton onClick={() => setWritingModalOpen(true)}>자세히 보기</DetailButton>
                    </TopCard>
                </TopCardGrid>

                {/* 도넛 차트 */}
                <DonutGrid>
                    <DonutChart value={attendance.attendanceRate} label="이번 달 출석률" unit="%" max={100}/>
                    <DonutChart value={interview.interviewMonthlyCount} label="이번 달 모의면접" unit="회" max={10}/>
                    <DonutChart value={quiz.quizMonthlyCount} label="이번 달 문제풀이" unit="개" max={20}/>
                    <DonutChart value={trust.totalScore} label="신뢰 점수" unit="점" max={100}
                                onDetailClick={() => setTrustModalOpen(true)}/>
                </DonutGrid>
            </Section>

            {/* 글작성 모달 */}
            <WritingModal
                isOpen={writingModalOpen}
                onClose={() => setWritingModalOpen(false)}
                writing={writing}
            />

            {/* 신뢰점수 모달 */}
            <TrustScoreModal
                isOpen={trustModalOpen}
                onClose={() => setTrustModalOpen(false)}
                trust={trust}
            />

            {/* 나의 레벨 현황 */}
            <Section>
                <LevelSection/>
            </Section>

            {/* 나의 칭호 현황 */}
            <Section>
                <TitleSection/>
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

/* 상단 카드 레이아웃 */
const TopCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

/* 상단 카드 레이아웃 */
const TopCard = styled.div`
    background: rgb(249, 250, 251);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    display: flex;                /* flexbox 사용 */
    flex-direction: column;       /* 세로 정렬 */
    justify-content: center;      /* 세로 중앙 정렬 */
    align-items: center;          /* 가로 중앙 정렬 */

    p {
        font-size: 14px;
        color: rgb(107, 114, 128);
        margin-bottom: 4px;         /* 간격 줄임 */
    }

    strong {
        font-size: 18px;
        font-weight: 700;
        color: rgb(17, 24, 39);
        margin-bottom: 8px;         /* 항목별 간격 */
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

const DetailButton = styled.button`
  margin-top: 8px;
  padding: 6px 12px;
  font-size: 12px;
  background: rgb(59,130,246);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;