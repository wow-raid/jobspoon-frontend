import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ActivityLogSection() {
    const log = {
        attendanceRate: 85,
        interviewTotalCount: 34,
        interviewMonthlyCount: 3,
        quizTotalCount: 120,
        quizMonthlyCount: 2,
        reviewCount: 1,
        studyroomCount: 5,
        commentCount: 6,
        trustScore: 78,
    };

    const COLORS = ["#3b82f6", "#e5e7eb"]; // 파랑/회색

    // 도넛 차트 데이터 생성 함수
    const makeDonutData = (value: number) => [
        { name: "progress", value },
        { name: "remain", value: 100 - value },
    ];

    return (
        <section className="border bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">활동 로그</h2>

            {/* 2단 레이아웃 */}
            <div className="grid grid-cols-2 gap-6">
                {/* 왼쪽: 텍스트 로그 */}
                <div className="flex flex-col space-y-2 text-sm">
                    <p>출석률: <span className="font-semibold">{log.attendanceRate}%</span></p>
                    <p>총 모의 면접 횟수: <span className="font-semibold">{log.interviewTotalCount}회</span></p>
                    <p>이번 달 모의 면접 횟수: <span className="font-semibold">{log.interviewMonthlyCount}회</span></p>
                    <p>총 문제 풀이 횟수: <span className="font-semibold">{log.quizTotalCount}회</span></p>
                    <p>이번 달 문제 풀이 횟수: <span className="font-semibold">{log.quizMonthlyCount}회</span></p>
                    <p>리뷰 작성 횟수: <span className="font-semibold">{log.reviewCount}회</span></p>
                    <p>모임 작성 횟수: <span className="font-semibold">{log.studyroomCount}회</span></p>
                    <p>댓글 작성 횟수: <span className="font-semibold">{log.commentCount}회</span></p>
                    <p>신뢰 점수: <span className="font-semibold">{log.trustScore}점</span></p>
                </div>

                {/* 오른쪽: 도넛 차트 4개 */}
                <div className="grid grid-cols-4 gap-6">
                    {/* 출석률 */}
                    <div className="text-center">
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie
                                    data={makeDonutData(log.attendanceRate)}
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {makeDonutData(log.attendanceRate).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="font-bold">{log.attendanceRate}%</p>
                        <p className="text-sm text-gray-600">출석률</p>
                    </div>

                    {/* 이번 달 문제풀이 */}
                    <div className="text-center">
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie
                                    data={makeDonutData(log.quizMonthlyCount)}
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {makeDonutData(log.quizMonthlyCount).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="font-bold">{log.quizMonthlyCount}회</p>
                        <p className="text-sm text-gray-600">이번 달 문제풀이</p>
                    </div>

                    {/* 이번 달 모의면접 */}
                    <div className="text-center">
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie
                                    data={makeDonutData(log.interviewMonthlyCount)}
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {makeDonutData(log.interviewMonthlyCount).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="font-bold">{log.interviewMonthlyCount}회</p>
                        <p className="text-sm text-gray-600">이번 달 모의면접</p>
                    </div>

                    {/* 신뢰 점수 */}
                    <div className="text-center">
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie
                                    data={makeDonutData(log.trustScore)}
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {makeDonutData(log.trustScore).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="font-bold">{log.trustScore}점</p>
                        <p className="text-sm text-gray-600">신뢰 점수</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
