{/* 신뢰점수 기준 */}

import React from "react";
import styled from "styled-components";

export default function TrustScoreCriteria() {
    return (
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
            <Card>
                <Note>총점은 최대 100점</Note>
            </Card>
        </CardList>
    );
}

/* styled-components */
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
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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
