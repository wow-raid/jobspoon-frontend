{/* 인터뷰 목록 보기 */}

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const mockResults = [
    { id: 1, date: "2025-09-01", topic: "백엔드", grade: "A" },
    { id: 2, date: "2025-08-15", topic: "프론트엔드", grade: "B" },
];

export default function InterviewResultList() {
    return (
        <Section>
            <Title>면접 기록 보관함</Title>
            <List>
                {mockResults.map((item) => (
                    <Card key={item.id}>
                        <Info>
                            <Date>{item.date}</Date>
                            <Topic>{item.topic}</Topic>
                            <Grade grade={item.grade}>{item.grade}</Grade>
                        </Info>
                        <DetailLink to={`/mypage/interview/history/${item.id}`}>
                            상세보기
                        </DetailLink>
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

const Date = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const Topic = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
`;

const Grade = styled.span<{ grade: string }>`
  font-size: 14px;
  font-weight: bold;
  color: ${({ grade }) =>
    grade === "A"
        ? "rgb(34,197,94)" // green-500
        : grade === "B"
            ? "rgb(59,130,246)" // blue-500
            : "rgb(239,68,68)"}; // red-500
`;

const DetailLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: rgb(37, 99, 235);
  &:hover {
    text-decoration: underline;
  }
`;
