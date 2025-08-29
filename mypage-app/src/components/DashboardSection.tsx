import React, { useEffect, useState } from "react";
import { getAttendanceRate, getInterviewCompletion } from "../api/dashboardApi.ts";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#e5e7eb"]; // 파랑/회색

// 도넛 차트 데이터 생성 함수
const makeDonutData = (value: number) => [
    { name: "progress", value },
    { name: "remain", value: 100 - value },
];

interface AttendanceRateResponse {
    attendanceRate: number;
    attended: number;
    totalDays: number;
}

interface InterviewCompletionResponse {
    interviewTotalCount: number;
    interviewMonthlyCount: number;
}

export default function DashboardSection() {

    const [attendance, setAttendance] = useState<AttendanceRateResponse | null>(null);
    const [interview, setInterview] = useState<InterviewCompletionResponse | null>(null);

    // TODO: 👉 로그인 연동 전까지는 임시 하드코딩
    useEffect(() => {
        const token = "test-token2";
        getAttendanceRate(token).then(setAttendance).catch(console.error);
        getInterviewCompletion(token).then(setInterview).catch(console.error);
    }, []);

    // TODO: 👉 실제 로그인 붙었을 때 사용할 버전 (주석으로 보관)
    // useEffect(() => {
    //     const token = localStorage.getItem("userToken") || "";
    //     if (!token) return;
    //     getAttendanceRate(token).then(setAttendance).catch(console.error);
    //     getInterviewCompletion(token).then(setInterview).catch(console.error);
    // }, []);

    // 아직 API 로드 전이면 로딩 표시
    if (!attendance || !interview) {
        return <p>불러오는 중...</p>;
    }

    return (
        <section className="border bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">활동 지표</h2>

            {/* 2단 레이아웃 */}
            <div className="grid grid-cols-2 gap-6">
                {/* 왼쪽: 텍스트 로그 */}
                <div className="flex flex-col space-y-2 text-sm">
                    <p>출석률: <span className="font-semibold">{attendance.attendanceRate.toFixed(1)}%</span></p>
                    <p>출석일수: <span className="font-semibold">{attendance.attended}/{attendance.totalDays}일</span></p>
                    <p>총 모의 면접 횟수: <span className="font-semibold">{interview.interviewTotalCount}회</span></p>
                    <p>이번 달 모의 면접 횟수: <span className="font-semibold">{interview.interviewMonthlyCount}회</span></p>
                </div>

                {/* 오른쪽: 도넛 차트 */}
                <div className="grid grid-cols-2 gap-6">
                    {/* 출석률 */}
                    <div className="text-center">
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie
                                    data={makeDonutData(attendance.attendanceRate)}
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {makeDonutData(attendance.attendanceRate).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="font-bold">{attendance.attendanceRate.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">출석률</p>
                    </div>

                    {/* 이번 달 모의면접 */}
                    <div className="text-center">
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie
                                    data={makeDonutData(interview.interviewMonthlyCount)}
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {makeDonutData(interview.interviewMonthlyCount).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="font-bold">{interview.interviewMonthlyCount}회</p>
                        <p className="text-sm text-gray-600">이번 달 모의면접</p>
                    </div>
                </div>
            </div>
        </section>
    );
}