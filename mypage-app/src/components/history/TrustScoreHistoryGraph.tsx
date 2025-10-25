import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import {
    fetchTrustScore,
    fetchTrustScoreHistory,
    TrustScoreResponse,
    TrustScoreHistoryResponse,
} from "../../api/userTrustScoreApi";

/**
 * 📊 활동 점수 변화 추이 (제목 제거 버전)
 * - 상단: 이번 달(실시간) vs 지난달(히스토리) 비교
 * - 본문: 월별 점수 변화 그래프
 */
export default function TrustScoreHistoryGraph() {
    const [trustScore, setTrustScore] = useState<TrustScoreResponse | null>(null);
    const [history, setHistory] = useState<TrustScoreHistoryResponse[]>([]);
    const [status, setStatus] = useState<"loading" | "empty" | "loaded">("loading");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [trust, hist] = await Promise.all([
                    fetchTrustScore(),
                    fetchTrustScoreHistory(),
                ]);

                // 과거→현재 순으로 정렬
                const sorted = [...hist].sort(
                    (a, b) =>
                        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
                );

                setTrustScore(trust);
                setHistory(sorted);
                setStatus(sorted.length ? "loaded" : "empty");
            } catch (err) {
                console.error(err);
                setStatus("empty");
            }
        };
        loadData();
    }, []);

    if (status === "loading") return <Message>불러오는 중...</Message>;
    if (status === "empty") return <Message>활동 점수 이력이 없습니다.</Message>;

    /** ------------------ 계산 로직 ------------------ **/
    const currentScore = trustScore?.totalScore ?? 0;
    const lastMonthScore =
        history.length > 0 ? history[history.length - 1].score : 0;
    const diff = currentScore - lastMonthScore;
    const diffText =
        diff > 0
            ? `▲ ${diff.toFixed(1)} 상승`
            : diff < 0
                ? `▼ ${Math.abs(diff).toFixed(1)} 하락`
                : "변동 없음";

    const maxScore = Math.max(...history.map((h) => h.score), currentScore, 100);
    const yDomain = [0, Math.ceil(maxScore + 5)];

    /** 그래프용 데이터 (이번 달 실시간 포함) **/
    const chartData = [
        ...history,
        {
            score: currentScore,
            recordedAt: new Date().toISOString(),
        },
    ];

    /** ------------------ UI ------------------ **/
    return (
        <Card>
            <SummaryWrapper positive={diff > 0} negative={diff < 0}>
                <Label>이번 달 활동 점수</Label>
                <Value>
                    <strong>{currentScore.toFixed(1)}점</strong> ({diffText})
                </Value>
            </SummaryWrapper>

            <ChartWrapper>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorTrust" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#BFDBFE" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />

                        <XAxis
                            dataKey="recordedAt"
                            tickFormatter={(t) =>
                                new Date(t).toLocaleDateString("ko-KR", {
                                    month: "short",
                                })
                            }
                            interval="preserveStartEnd"
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={yDomain}
                            tick={{ fontSize: 12, fill: "#9CA3AF" }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                                fontSize: "13px",
                            }}
                            labelFormatter={(t) =>
                                new Date(t).toLocaleDateString("ko-KR", {
                                    month: "long",
                                    day: "numeric",
                                })
                            }
                            formatter={(v: any) => [`${v.toFixed(1)}점`, "활동 점수"]}
                        />

                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#3B82F6"
                            fill="url(#colorTrust)"
                            strokeWidth={2.3}
                            dot={{
                                r: 3,
                                fill: "#fff",
                                stroke: "#3B82F6",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 5,
                                strokeWidth: 1,
                                stroke: "#2563EB",
                                fill: "#fff",
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartWrapper>
        </Card>
    );
}

/* ================= styled-components ================= */

const Card = styled.div`
    background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
    border-radius: 12px;
    padding: 20px 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const SummaryWrapper = styled.div<{ positive?: boolean; negative?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    font-size: 13px;
    color: ${({ positive, negative }) =>
            positive ? "#16A34A" : negative ? "#DC2626" : "#6B7280"};
`;

const Label = styled.span`
    font-size: 12px;
    color: #9ca3af;
`;

const Value = styled.span<{ positive?: boolean; negative?: boolean }>`
    font-size: 14px;
    font-weight: 600;
    color: ${({ positive, negative }) =>
            positive ? "#16A34A" : negative ? "#DC2626" : "#374151"};
`;

const ChartWrapper = styled.div`
    width: 100%;
    height: 240px;
`;

const Message = styled.p`
    font-size: 14px;
    color: #888;
    text-align: center;
`;
