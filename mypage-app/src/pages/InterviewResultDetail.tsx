{/* 인터뷰 상세 보기 */}

import React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

export default function InterviewResultDetail() {
    const { id } = useParams();

    const mockResult = {
        id,
        date: "2025-09-01",
        topic: "백엔드",
        grade: "A",
        qa: [
            { q: "자기소개를 해주세요.", a: "저는 백엔드 개발자로서...", feedback: "전달력은 좋으나 구체적 예시 필요" },
            { q: "프로젝트에서 맡은 역할은?", a: "DB 설계와 API 구현을 담당했습니다.", feedback: "성과 수치 강조 필요" }
        ],
    };

    return (
        <Section>
            <NoticeBanner>🚧 서비스 준비 중입니다</NoticeBanner>

            <Header>
                <Title>면접 결과 상세</Title>
                <BackLink to="/mypage/interview/history">목록으로 돌아가기</BackLink>
            </Header>

            {/* 요약 카드 섹션 */}
            <CardGrid>
                <TopCard>
                    <p>면접 날짜</p>
                    <strong>{mockResult.date}</strong>
                </TopCard>
                <TopCard>
                    <p>분야</p>
                    <strong>{mockResult.topic}</strong>
                </TopCard>
                <TopCard>
                    <p>등급</p>
                    <Grade grade={mockResult.grade}>{mockResult.grade}</Grade>
                </TopCard>
            </CardGrid>

            {/* 차트 */}
            <SubSection>
                <ChartPlaceholder>📊 HexagonChart 자리 (추후 연결)</ChartPlaceholder>
            </SubSection>

            {/* Q/A */}
            <SubSection>
                {mockResult.qa.map((item, idx) => (
                    <QACard key={idx}>
                        <Question>{idx + 1}. {item.q}</Question>
                        <Answer>{item.a}</Answer>
                        <Feedback>💡 {item.feedback}</Feedback>
                    </QACard>
                ))}
            </SubSection>
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
    gap: 24px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const BackLink = styled(Link)`
    font-size: 14px;
    color: rgb(37, 99, 235);
    &:hover {
        text-decoration: underline;
    }
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
`;

const TopCard = styled.div`
    background: rgb(249, 250, 251);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
        font-size: 14px;
        color: rgb(107, 114, 128);
        margin-bottom: 4px;
    }

    strong {
        font-size: 18px;
        font-weight: 700;
        color: rgb(17, 24, 39);
    }
`;

const Grade = styled.strong<{ grade: string }>`
    color: ${({ grade }) =>
            grade === "A"
                    ? "rgb(34,197,94)"
                    : grade === "B"
                            ? "rgb(59,130,246)"
                            : "rgb(239,68,68)"};
`;

const SubSection = styled.div`
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const ChartPlaceholder = styled.div`
    height: 300px;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(107, 114, 128);
`;

const QACard = styled.div`
    background: rgb(249, 250, 251);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
`;

const Question = styled.h3`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
`;

const Answer = styled.p`
    font-size: 14px;
    margin-bottom: 8px;
    color: rgb(55, 65, 81);
`;

const Feedback = styled.p`
  font-size: 14px;
  color: rgb(37, 99, 235);
  font-style: italic;
`;

const NoticeBanner = styled.div`
  background: #fef3c7; /* 연한 노랑 */
  color: #92400e;      /* 진한 주황/갈색 */
  font-size: 18px;     /* 글자 크게 */
  font-weight: 700;
  text-align: center;
  padding: 20px 12px;  /* 상하 넓게 */
  border-radius: 8px;
  margin: 24px 0;      /* 위아래 간격 */
`;