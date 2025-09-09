import React from "react";
import styled from "styled-components";
import { TrustScoreResponse } from "../api/dashboardApi.ts";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    trust: TrustScoreResponse;
};

export default function TrustScoreModal({ isOpen, onClose, trust }: Props) {
    if (!isOpen) return null;

    return (
        <Overlay>
            <Modal>
                <Header>
                    <h2>신뢰 점수 산정 기준</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>
                <Content>
                    <h3>내 점수 현황</h3>
                    <ul>
                        <li>🗓️ 출석률: {trust.attendanceScore.toFixed(1)} / 25점</li>
                        <li>🎤 모의면접: {Math.round(trust.interviewScore)} / 20점</li>
                        <li>🧩 문제풀이: {Math.round(trust.quizScore)} / 20점</li>
                        <li>✍️ 리뷰 작성: {Math.round(trust.reviewScore)} / 10점</li>
                        <li>👥 스터디룸 개설: {Math.round(trust.studyroomScore)} / 10점</li>
                        <li>💬 댓글 작성: {Math.round(trust.commentScore)} / 10점</li>
                        <li>⚡ 활성 보너스: {trust.bonusApplied ? "+5점" : "0점"}</li>
                    </ul>
                    <p><b>총점: {Math.round(trust.trustScore)} / 100점</b></p>

                    <Divider />

                    <h3>산정 기준표</h3>
                    <CardList>
                        <Card>
                            <Title>🗓️ 출석률</Title>
                            <Point>최대 25점</Point>
                            <Desc>출석률이 높을수록 점수 상승 (100% = 25점)</Desc>
                            <Note>성실성 지표</Note>
                        </Card>
                        <Card>
                            <Title>🎤 모의면접</Title>
                            <Point>최대 20점</Point>
                            <Desc>누적 참여 횟수 + 최근 한 달 활동 반영</Desc>
                            <Note>꾸준한 실전 연습</Note>
                        </Card>
                        <Card>
                            <Title>🧩 문제풀이</Title>
                            <Point>최대 20점</Point>
                            <Desc>누적 풀이 수 + 최근 한 달 풀이 반영</Desc>
                            <Note>학습 꾸준함</Note>
                        </Card>
                        <Card>
                            <Title>✍️ 리뷰 작성</Title>
                            <Point>최대 10점</Point>
                            <Desc>작성한 리뷰 개수에 따라 점수 상승</Desc>
                            <Note>피드백 기여</Note>
                        </Card>
                        <Card>
                            <Title>👥 스터디룸 개설</Title>
                            <Point>최대 10점</Point>
                            <Desc>스터디룸 개설 시 높은 점수 반영</Desc>
                            <Note>커뮤니티 리더십</Note>
                        </Card>
                        <Card>
                            <Title>💬 댓글 작성</Title>
                            <Point>최대 10점</Point>
                            <Desc>작성한 댓글 개수에 따라 점수 상승</Desc>
                            <Note>커뮤니티 참여</Note>
                        </Card>
                        <Card>
                            <Title>⚡ 활성 보너스</Title>
                            <Point>+5점</Point>
                            <Desc>최근 한 달 내 활동이 있으면 +5점</Desc>
                            <Note>총점은 최대 100점</Note>
                        </Card>
                    </CardList>
                </Content>

                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </Modal>
        </Overlay>
    );
}

/* styled-components (RankGuideModal 과 동일) */
const Overlay = styled.div`
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    max-height: 80vh;      /* 🔹 화면 높이 80%까지만 */
    overflow-y: auto;      /* 🔹 넘치면 스크롤 */
    display: flex;
    flex-direction: column;
    gap: 16px;
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

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
        font-size: 13px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 6px 8px;
        text-align: left;
    }

    th {
        background: #f9fafb;
        font-weight: 600;
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

    &:hover {
        background: rgb(37, 99, 235);
    }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
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
