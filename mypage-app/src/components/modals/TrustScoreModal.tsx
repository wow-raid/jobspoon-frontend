import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { TrustScoreResponse } from "../../api/userTrustScoreApi";
import {
    calcAttendanceScore,
    calcInterviewScore,
    calcProblemScore,
    calcPostScore,
    calcStudyroomScore,
    calcCommentScore,
} from "../../utils/trustScoreUtils";

/* ---------- 타입 ---------- */
type Status = "loading" | "empty" | "loaded";

type TrustScoreModalProps = {
    isOpen: boolean;
    onClose: () => void;
    trustScore: TrustScoreResponse | null;
    trustStatus: "loading" | "empty" | "loaded";
};

/* ---------- 메인 ---------- */
export default function TrustScoreModal({
                                            isOpen,
                                            onClose,
                                            trustScore,
                                            trustStatus,
                                        }: TrustScoreModalProps) {

    const [showCriteria, setShowCriteria] = useState(false);

    useEffect(() => {
        if (isOpen) setShowCriteria(false);
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                    {!showCriteria ? (
                        <SlideContent
                            key="summary"
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -40, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <Header>
                                <h3>활동 점수 요약</h3>
                            </Header>

                            {trustStatus === "loading" ? (
                                <Empty>불러오는 중...</Empty>
                            ) : trustStatus === "empty" ? (
                                <Empty>신뢰점수가 없습니다.</Empty>
                            ) : (
                                <>
                                    <TrustGrid>
                                        <TrustItem>
                                            <Label>출석률</Label>
                                            <ProgressBar percent={(calcAttendanceScore(trustScore!.attendanceRate) / 25) * 100} />
                                            <Count>{calcAttendanceScore(trustScore!.attendanceRate).toFixed(1)} / 25점</Count>
                                        </TrustItem>

                                        <TrustItem>
                                            <Label>모의면접</Label>
                                            <ProgressBar percent={(calcInterviewScore(trustScore!.monthlyInterviews) / 20) * 100} />
                                            <Count>{calcInterviewScore(trustScore!.monthlyInterviews)} / 20점</Count>
                                        </TrustItem>

                                        <TrustItem>
                                            <Label>문제풀이</Label>
                                            <ProgressBar percent={(calcProblemScore(trustScore!.monthlyProblems) / 20) * 100} />
                                            <Count>{calcProblemScore(trustScore!.monthlyProblems)} / 20점</Count>
                                        </TrustItem>

                                        <TrustItem>
                                            <Label>글 작성</Label>
                                            <ProgressBar percent={(calcPostScore(trustScore!.monthlyPosts) / 15) * 100} />
                                            <Count>{calcPostScore(trustScore!.monthlyPosts)} / 15점</Count>
                                        </TrustItem>

                                        <TrustItem>
                                            <Label>스터디룸</Label>
                                            <ProgressBar percent={(calcStudyroomScore(trustScore!.monthlyStudyrooms) / 10) * 100} />
                                            <Count>{calcStudyroomScore(trustScore!.monthlyStudyrooms)} / 10점</Count>
                                        </TrustItem>

                                        <TrustItem>
                                            <Label>댓글</Label>
                                            <ProgressBar percent={(calcCommentScore(trustScore!.monthlyComments) / 15) * 100} />
                                            <Count>{calcCommentScore(trustScore!.monthlyComments)} / 15점</Count>
                                        </TrustItem>
                                    </TrustGrid>

                                    <Total>
                                        총점 <strong>{trustScore?.totalScore?.toFixed(1) ?? "0.0"}</strong> / 100점
                                    </Total>

                                    <Footer>
                                        <ToggleButton onClick={() => setShowCriteria(true)}>산정 기준 보기</ToggleButton>
                                        <CloseButton onClick={onClose}>닫기</CloseButton>
                                    </Footer>
                                </>
                            )}
                        </SlideContent>
                    ) : (
                        <SlideContent
                            key="criteria"
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -40, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <Header>
                                <h3>활동 점수 산정 기준</h3>
                            </Header>

                            <CriteriaContent>
                                <p>🛡️ 활동 점수는 다음 여섯 가지 항목으로 구성됩니다.</p>

                                <CardList>
                                    <Card>
                                        <Title>🗓️ 출석률</Title>
                                        <Point>최대 25점</Point>
                                        <Desc>이번 달 출석률에 따라 점수 반영 (100% = 25점)</Desc>
                                        <Note>성실성 지표</Note>
                                    </Card>
                                    <Card>
                                        <Title>🎤 모의면접</Title>
                                        <Point>최대 15점</Point>
                                        <Desc>이번 달 완료한 모의면접 횟수 기준</Desc>
                                        <Note>실전 대비 지표</Note>
                                    </Card>
                                    <Card>
                                        <Title>🧩 문제풀이</Title>
                                        <Point>최대 15점</Point>
                                        <Desc>이번 달 풀이한 문제 수 기준</Desc>
                                        <Note>학습 꾸준함</Note>
                                    </Card>
                                    <Card>
                                        <Title>✍️ 게시글 작성</Title>
                                        <Point>최대 15점</Point>
                                        <Desc>이번 달 작성한 게시글 수 기준</Desc>
                                        <Note>지식 공유 기여</Note>
                                    </Card>
                                    <Card>
                                        <Title>👥 스터디룸 개설</Title>
                                        <Point>최대 15점</Point>
                                        <Desc>이번 달 개설한 스터디룸 수 기준</Desc>
                                        <Note>커뮤니티 리더십</Note>
                                    </Card>
                                    <Card>
                                        <Title>💬 댓글 작성</Title>
                                        <Point>최대 15점</Point>
                                        <Desc>이번 달 작성한 댓글 수 기준</Desc>
                                        <Note>커뮤니티 참여</Note>
                                    </Card>
                                </CardList>

                                <p>총점은 최대 100점이며, 활동에 따라 월별로 갱신됩니다.</p>
                            </CriteriaContent>

                            <Footer>
                                <ToggleButton onClick={() => setShowCriteria(false)}>돌아가기</ToggleButton>
                                <CloseButton onClick={onClose}>닫기</CloseButton>
                            </Footer>

                        </SlideContent>
                    )}
                </AnimatePresence>
            </ModalCard>
        </Overlay>
    );
}

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
`;

const ModalCard = styled.div`
    background: #fff;
    width: 680px;
    max-width: 90vw;
    border-radius: 16px;
    padding: 32px 36px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
`;

const SlideContent = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Header = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
    }
`;

const Empty = styled.p`
    font-size: 14px;
    color: #888;
    text-align: center;
`;

const TrustGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px 20px;
`;

const TrustItem = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
`;

const ProgressBar = styled.div<{ percent: number }>`
    width: 100%;
    height: 12px;
    background: #f3f4f6;
    border-radius: 6px;
    margin-top: 6px;
    position: relative;
    &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: ${({ percent }) => percent}%;
        background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
        border-radius: 6px;
        transition: width 0.3s ease;
    }
`;

const Count = styled.div`
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-top: 4px;
`;

const Total = styled.div`
    text-align: center;
    font-size: 17px;
    font-weight: 700;
    color: #2563eb;
    background: rgba(59, 130, 246, 0.08);
    border-radius: 10px;
    padding: 10px 0;
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
`;

const ToggleButton = styled.button`
    font-size: 13px;
    color: #3b82f6;
    border: none;
    background: none;
    cursor: pointer;
`;

const CloseButton = styled.button`
    font-size: 13px;
    padding: 6px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #374151;
    background: #ffffff;
    cursor: pointer;
    &:hover {
        border-color: #2563eb;
        color: #2563eb;
    }
`;

/* ---- 산정 기준 ---- */
const CriteriaContent = styled.div`
    font-size: 14px;
    line-height: 1.6;
`;

const CardList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
    margin-top: 12px;
`;

const Card = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 12px;
    background: #fff;
`;

const Title = styled.h4`
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 4px;
`;

const Point = styled.p`
    font-size: 13px;
    font-weight: 500;
    color: #2563eb;
    margin: 0 0 4px;
`;

const Desc = styled.p`
    font-size: 13px;
    margin: 0 0 2px;
`;

const Note = styled.p`
    font-size: 12px;
    color: #6b7280;
    margin: 0;
`;
