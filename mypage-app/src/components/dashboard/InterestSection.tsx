import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchMyTechStack, UserTechStackResponse } from "../../api/userTechStackApi";
import { useNavigate } from "react-router-dom";

export default function InterestSection() {
    const [data, setData] = useState<UserTechStackResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) return <Wrapper>불러오는 중...</Wrapper>;

    if (!data || !data.hasInterview) {
        return (
            <>
                <EmptyBox>
                    <p>아직 관심 분야가 등록되지 않았어요.</p>
                    <p>AI 면접을 통해 나의 기술 스택을 설정해보세요!</p>
                    <StartButton onClick={() => (window.location.href = "/vue-ai-interview/ai-interview/landing")}>
                        AI 면접 시작하기
                    </StartButton>
                </EmptyBox>
            </>
        );
    }

    return (
        <>
            <JobLabel>{data.job} 개발자</JobLabel>
            <TagList>
                {data.techStacks?.map((stack) => (
                    <Tag key={stack.key}>{stack.displayName}</Tag>
                ))}
            </TagList>
        </>
    );
}

/* ---------- styled-components ---------- */
const Wrapper = styled.section`
    margin-bottom: 32px;
    padding: 20px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
`;

const JobLabel = styled.p`
    color: #2998c5;
    font-weight: 600;
    margin-bottom: 12px;
`;

const TagList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Tag = styled.span`
    background: #e8f3ff;
    color: #1e40af;
    font-size: 0.875rem;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 500;
`;

const EmptyBox = styled.div`
    background: transparent;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    color: #6b7280;
    font-size: 0.95rem;
`;

const StartButton = styled.button`
    margin-top: 12px;
    background: linear-gradient(90deg, #4cc4a8, #3ab49a); /* 💚 따뜻한 민트 그라데이션 */
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
    cursor: pointer;
    transition: 0.25s ease;
    box-shadow: 0 3px 8px rgba(76, 196, 168, 0.25);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(76, 196, 168, 0.35);
        background: linear-gradient(90deg, #3ab49a, #4cc4a8);
    }
`;
