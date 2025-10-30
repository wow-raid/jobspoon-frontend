import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInterviewResult } from "../api/InterviewApi.ts";
import Spinner from "../components/common/Spinner.tsx";
import { notifyError } from "../utils/toast.ts";
import { FaArrowLeft, FaRobot } from "react-icons/fa";

/* ---------- 타입 ---------- */
type InterviewDetail = {
    interviewReviewList: {
        question: string;
        answer: string;
        feedback?: string;
        correction?: string;
    }[];
    hexagonScore: {
        productivity: number;
        communication: number;
        technical_skill: number;
        documentation_skills: number;
        flexibility: number;
        problem_solving: number;
    };
    overallComment: string;
};

/* ---------- 팔레트 ---------- */
const palette = {
    primary: "#4CC4A8",
    accent: "#1E3A8A",
    lightBG: "#F8FBF8",
    border: "#E5E7EB",
    textMain: "#0F172A",
    textSub: "#6B7280",
};

/* ---------- 애니메이션 ---------- */
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

/* ---------- 메인 ---------- */
export default function InterviewDetailPage() {
    const [detail, setDetail] = useState<InterviewDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { interviewId } = useParams<{ interviewId?: string }>();

    useEffect(() => {
        if (!interviewId) {
            console.warn("❌ useParams로 받은 interviewId 없음");
            setLoading(false);
            return;
        }

        const id = parseInt(interviewId, 10);
        if (isNaN(id)) {
            console.warn("❌ interviewId가 NaN:", interviewId);
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const res = await fetchInterviewResult(id);
                console.log("✅ 응답 성공:", res);
                setDetail(res);
            } catch (err: any) {
                console.error("❌ 요청 실패:", err.response?.status, err.response?.data);
                notifyError("면접 상세 정보를 불러오지 못했습니다 ❗");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [interviewId]);

    if (loading) return <Spinner />;
    if (!detail)
        return (
            <EmptyState>
                <FaRobot size={44} color={palette.primary} />
                <h2>면접 데이터를 찾을 수 없습니다</h2>
                <p>다시 시도하거나 이전 페이지로 돌아가세요.</p>
                <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
            </EmptyState>
        );

    return (
        <Section>
            <Header>
                <BackButton onClick={() => navigate(-1)}>
                    <FaArrowLeft /> 돌아가기
                </BackButton>
                <Title>AI 면접 결과</Title>
                <SubText>면접 ID: {interviewId}</SubText>
            </Header>

            {/* 질문 리스트 */}
            <QuestionContainer>
                {detail.interviewReviewList.map((q, idx) => (
                    <QuestionCard key={idx}>
                        <QuestionTitle>Q{idx + 1}. {q.question}</QuestionTitle>
                        <Answer>{q.answer}</Answer>
                        {q.feedback && <Feedback>💬 {q.feedback}</Feedback>}
                    </QuestionCard>
                ))}
            </QuestionContainer>

            {/* 종합 점수 */}
            <ScoreSection>
                <h3>📊 Hexagon Score</h3>
                <ul>
                    {Object.entries(detail.hexagonScore).map(([key, value]) => (
                        <li key={key}>
                            <span>{key.replace(/_/g, " ")}:</span>
                            <strong>{value}</strong>
                        </li>
                    ))}
                </ul>
                <CommentBox>{detail.overallComment}</CommentBox>
            </ScoreSection>
        </Section>
    );
}

/* ---------- 스타일 ---------- */
const Section = styled.section`
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    animation: ${fadeUp} 0.6s ease both;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 24px;
    gap: 6px;
`;

const Title = styled.h2`
    font-size: 22px;
    font-weight: 700;
    color: ${palette.textMain};
`;

const SubText = styled.p`
    color: ${palette.textSub};
    font-size: 14px;
`;

const BackButton = styled.button`
    background: transparent;
    border: none;
    color: ${palette.accent};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: 0.2s ease;

    &:hover {
        color: ${palette.primary};
        transform: translateX(-2px);
    }
`;

const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const QuestionCard = styled.div`
    background: white;
    border: 1px solid ${palette.border};
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
`;

const QuestionTitle = styled.h3`
    font-size: 15px;
    font-weight: 600;
    color: ${palette.textMain};
    margin-bottom: 6px;
`;

const Answer = styled.p`
    font-size: 14px;
    color: ${palette.textSub};
    line-height: 1.6;
`;

const Score = styled.p`
    font-size: 13px;
    color: ${palette.accent};
    margin-top: 8px;
    font-weight: 600;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
    gap: 12px;
    color: ${palette.textMain};
    h2 {
        color: ${palette.primary};
        font-weight: 700;
    }
    p {
        color: ${palette.textSub};
    }
`;

const ScoreSection = styled.div`
  margin-top: 32px;
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  border: 1px solid ${palette.border};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: ${palette.textMain};
    margin-bottom: 12px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
  }

  li {
    color: ${palette.textSub};
    font-size: 14px;
    span {
      font-weight: 500;
    }
    strong {
      color: ${palette.accent};
      margin-left: 4px;
    }
  }
`;

const Feedback = styled.p`
  font-size: 13px;
  color: ${palette.primary};
  margin-top: 8px;
  font-weight: 500;
`;

const CommentBox = styled.div`
  margin-top: 10px;
  padding: 12px 16px;
  background: ${palette.lightBG};
  border-radius: 8px;
  color: ${palette.textMain};
  font-size: 14px;
`;