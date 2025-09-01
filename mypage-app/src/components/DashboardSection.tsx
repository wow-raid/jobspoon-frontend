import React, { useEffect, useState } from "react";
import {
    getAttendanceRate,
    getInterviewCompletion,
    AttendanceRateResponse,
    InterviewCompletionResponse
} from "../api/dashboardApi.ts";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import '../assets/tailwind.css'

const COLORS = ["#3b82f6", "#e5e7eb"]; // 파랑/회색

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
                    }: { value: number; label: string; unit: string; max?: number }) {
    const percent = Math.min(100, (value / max) * 100); // % 변환

    return (
        <div className="text-center">
            <div className="relative w-full h-[120px] flex items-center justify-center">
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

                {/* 중앙 값 표시 */}
                <div className="absolute text-center">
                    <p className="font-bold text-base">{value}{unit}</p>
                </div>
            </div>

            {/* 라벨은 아래 */}
            <p className="text-sm text-gray-600 mt-2">{label}</p>
        </div>
    );
}

export default function DashboardSection() {
    const [attendance, setAttendance] = useState<AttendanceRateResponse | null>(null);
    const [interview, setInterview] = useState<InterviewCompletionResponse | null>(null);

    // 👉 Mock 데이터 (백 준비 전)
    const [quiz] = useState({ quizTotalCount: 42, quizMonthlyCount: 5 });
    const [review] = useState({ reviewCount: 12 });
    const [studyroom] = useState({ studyroomCount: 3 });
    const [comment] = useState({ commentCount: 27 });
    const [trust] = useState({ trustScore: 88 });

    useEffect(() => {
        const token = "test-token2";     // 👉 Mock 데이터 (백 준비 전)
        getAttendanceRate(token).then(setAttendance).catch(console.error);
        getInterviewCompletion(token).then(setInterview).catch(console.error);
    }, []);

    if (!attendance || !interview) {
        return <p>불러오는 중...</p>;
    }

    return (
        <section className="border bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">활동 지표</h2>

            {/* 텍스트 로그 */}
            <div className="flex flex-col space-y-2 text-sm mb-6">
                <p>출석률: <span className="font-semibold">{attendance.attendanceRate.toFixed(1)}%</span></p>
                <p>출석일수: <span className="font-semibold">{attendance.attended}/{attendance.totalDays}일</span></p>
                <p>총 모의 면접 횟수: <span className="font-semibold">{interview.interviewTotalCount}회</span></p>
                <p>이번 달 모의 면접 횟수: <span className="font-semibold">{interview.interviewMonthlyCount}회</span></p>
                <p>총 문제풀이 횟수: <span className="font-semibold">{quiz.quizTotalCount}개</span></p>
                <p>이번 달 문제풀이 횟수: <span className="font-semibold">{quiz.quizMonthlyCount}개</span></p>
                <p>리뷰 작성: <span className="font-semibold">{review.reviewCount}개</span></p>
                <p>모임 작성: <span className="font-semibold">{studyroom.studyroomCount}개</span></p>
                <p>댓글 작성: <span className="font-semibold">{comment.commentCount}개</span></p>
                <p>신뢰 점수: <span className="font-semibold">{trust.trustScore}점</span></p>
            </div>

            {/* 도넛 차트 (한 줄에 4개) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DonutChart value={attendance.attendanceRate} label="출석률" unit="%" max={100} />
                <DonutChart value={interview.interviewMonthlyCount} label="이번 달 모의면접" unit="회" max={10} />
                <DonutChart value={quiz.quizMonthlyCount} label="이번 달 문제풀이" unit="개" max={20} />
                <DonutChart value={trust.trustScore} label="신뢰 점수" unit="점" max={100} />
            </div>
        </section>
    );
}