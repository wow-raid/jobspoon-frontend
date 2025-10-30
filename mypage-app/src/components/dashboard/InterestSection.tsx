import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchMyTechStack, UserTechStackResponse } from "../../api/userTechStackApi";

export default function InterestSection() {
    const [data, setData] = useState<UserTechStackResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (isoString?: string) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchMyTechStack();
                setData(res);
            } catch (err) {
                console.error("Failed to fetch tech stack:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <LoadingBox>불러오는 중...</LoadingBox>;

    // Empty State (AI 면접 전)
    if (!data || !data.hasInterview) {
        return (
            <GlassCard>
                <Content>
                    <p>관심사를 아직 등록하지 않았어요</p>
                    <p>AI 면접으로 나의 기술 여정을 시작해보세요.</p>
                    <StartButton
                        onClick={() => (window.location.href = "/vue-ai-interview/ai-interview/landing")}
                    >
                        AI 면접 시작하기
                    </StartButton>
                </Content>
            </GlassCard>
        );
    }

    // 관심사 데이터 있을 때
    return (
        <GlassCard>
            <Content>
                <JobLabel>{data.job} 개발자</JobLabel>
                <TagList>
                    {data.techStacks?.map((stack) => (
                        <Tag key={stack.key}>{stack.displayName}</Tag>
                    ))}
                </TagList>
                <InfoText>
                    ※ 최근 완료된 AI 면접 ({formatDate(data.createdAt)}) 기준으로 표시됩니다.
                </InfoText>
            </Content>
        </GlassCard>
    );
}

/* ================== styled-components ================== */

const GlassCard = styled.section`
    position: relative;
    overflow: hidden;
    padding: 22px 20px; /* 🔹 기존 40px → 22px */
    border-radius: 14px; /* 🔹 기존 20px → 14px */
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(76, 196, 168, 0.2);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(8px);
    text-align: center;
    transition: 0.25s ease all;

    &:hover {
        box-shadow: 0 6px 16px rgba(76, 196, 168, 0.12);
        transform: translateY(-1px);
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        color: #6b7280;
        font-size: 0.95rem;
    }
`;

const StartButton = styled.button`
    margin-top: 6px;
    padding: 10px 24px;
    border-radius: 100px;
    background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
    color: white;
    font-weight: 500;
    font-size: 0.95rem;
    border: none;
    letter-spacing: 0.3px;
    box-shadow: 0 3px 10px rgba(59, 130, 246, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        filter: brightness(1.07);
        box-shadow: 0 5px 14px rgba(59, 130, 246, 0.4);
    }

    &:active {
        transform: scale(0.98);
    }
`;

const LoadingBox = styled.div`
    text-align: center;
    padding: 30px;
    color: #6b7280;
    font-size: 0.95rem;
`;

const JobLabel = styled.p`
    color: #25a58b;
    font-weight: 600;
    font-size: 0.95rem; /* 🔹 기존 1.05rem → 줄이기 */
`;

const TagList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
`;

const Tag = styled.span`
    background: rgba(67, 208, 178, 0.1);
    color: #0f766e;
    font-size: 0.8rem; /* 🔹 기존 0.85rem → 미세 조정 */
    padding: 5px 12px;
    border-radius: 16px;
    font-weight: 500;
`;

const InfoText = styled.p`
    margin-top: 6px;
    font-size: 0.7rem !important; /* 🔹 작게 */
    color: #b0b0b0;
    letter-spacing: 0.1px;
`;