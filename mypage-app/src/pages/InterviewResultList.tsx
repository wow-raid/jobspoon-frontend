{/* 인터뷰 목록 보기 */}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchInterviewList } from "../api/interviewApi";

type InterviewItem = {
    id: number;
    topic: string;
    yearsOfExperience: number;
    created_at: Date;
    status: "IN_PROGRESS" | "COMPLETED"; // ✅ 추가
};

export default function InterviewResultList() {
    const [interviews, setInterviews] = useState<InterviewItem[]>([]);

    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        if (!userToken) return;

        fetchInterviewList(userToken).then((data) => {
            const normalized: InterviewItem[] = (data.interviewList || []).map((item: any) => ({
                ...item,
                created_at: new Date(item.created_at),
                status: item.status, // ✅ 추가
            }));
            setInterviews(normalized);
        });
    }, []);

    return (
        <Section>
            <Title>면접 기록 보관함</Title>
            <List>
                {interviews.map((item, index) => (
                    <Card key={item.id}>
                        <Info>
                            <IndexCircle>{index + 1}</IndexCircle>
                            <DateText>{item.created_at.toLocaleDateString()}</DateText>
                            <Topic>{item.topic}</Topic>
                        </Info>
                        <DetailSection>
                            <StatusBadge status={item.status}>
                                {item.status === "COMPLETED" ? "완료" : "진행 중"}
                            </StatusBadge>
                            <DetailLink to={`/mypage/interview/history/${item.id}`}>
                                상세보기
                            </DetailLink>
                        </DetailSection>
                    </Card>
                ))}
            </List>

        </Section>
    );
}

/* ================== styled-components ================== */
const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Card = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Info = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const DateText = styled.span`
    font-size: 14px;
    color: #6b7280;
`;

const Topic = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #111827;
`;

const DetailLink = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    color: rgb(37, 99, 235);
    &:hover {
        text-decoration: underline;
    }
`;

const IndexCircle = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #93C5FD; /* 연한 하늘색 */
    color: #1E3A8A; /* 남색 글씨 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
`;

/* styled-components */
const DetailSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ status }) =>
    status === "COMPLETED" ? "#065f46" : "#92400e"};
  background-color: ${({ status }) =>
    status === "COMPLETED" ? "#d1fae5" : "#fef3c7"};
`;
