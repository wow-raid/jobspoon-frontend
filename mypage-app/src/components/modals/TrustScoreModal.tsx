{/* 신뢰점수 안내 모달 */}

import React, {useEffect} from "react";
import styled from "styled-components";
import { TrustScoreResponse } from "../../api/userTrustScoreApi.ts";
import {
    calcAttendanceScore,
    calcInterviewScore,
    calcProblemScore,
    calcPostScore,
    calcStudyroomScore,
    calcCommentScore,
    calcTotalScore
} from "../../utils/trustScoreUtils.ts";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    trust: TrustScoreResponse;
};

export default function TrustScoreModal({ isOpen, onClose, trust }: Props) {
    const attendanceScore = calcAttendanceScore(trust.attendanceRate);
    const interviewScore = calcInterviewScore(trust.monthlyInterviews);
    const problemScore = calcProblemScore(trust.monthlyProblems);
    const postScore = calcPostScore(trust.monthlyPosts);
    const studyroomScore = calcStudyroomScore(trust.monthlyStudyrooms);
    const commentScore = calcCommentScore(trust.monthlyComments);

    // ✅ ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <Overlay isOpen={isOpen}>
            <Modal isOpen={isOpen}>
                <Header>
                    <h2>활동 점수 산정 기준</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>

                <Content>
                    <h3>내 점수 현황</h3>
                    <ul>
                        <li>🗓️ 출석률: {attendanceScore.toFixed(1)} / 25점</li>
                        <li>🎤 모의면접: {Math.round(interviewScore)} / 20점</li>
                        <li>🧩 문제풀이: {Math.round(problemScore)} / 20점</li>
                        <li>✍️ 글 작성: {Math.round(postScore)} / 15점</li>
                        <li>👥 스터디룸 개설: {Math.round(studyroomScore)} / 10점</li>
                        <li>💬 댓글 작성: {Math.round(commentScore)} / 15점</li>
                    </ul>
                    <Divider />
                    <TotalScore>
                        총점: {trust.totalScore?.toFixed(1) ?? "0.0"} / 100점
                    </TotalScore>
                </Content>

                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </Modal>
        </Overlay>
    );
}

/* ================= styled-components ================= */
const Overlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    background: ${({ isOpen }) => (isOpen ? "rgba(0,0,0,0.4)" : "transparent")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
    transition: all 0.3s ease-in-out;
`;

const Modal = styled.div<{ isOpen: boolean }>`
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.95)")};
    transition: all 0.3s ease-in-out;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
    }
`;

const CloseButton = styled.button`
    font-size: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
`;

const Content = styled.div`
    font-size: 14px;
    line-height: 1.6;

    ul {
        margin: 8px 0;
        padding-left: 18px;
    }

    li {
        margin-bottom: 4px;
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ConfirmButton = styled.button`
    padding: 8px 16px;
    background: rgb(59, 130, 246);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    transition: background 0.2s ease-in-out;
    &:hover {
        background: rgb(37, 99, 235);
    }
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 16px 0;
`;

const TotalScore = styled.div`
    font-size: 15px;
    font-weight: 700;
    color: #2563eb;
    background: rgba(37, 99, 235, 0.08);
    padding: 8px 12px;
    border-radius: 8px;
    margin-top: 8px;
    text-align: left;
`;