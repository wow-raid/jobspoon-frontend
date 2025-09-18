import React from "react";
import styled from "styled-components";

export default function TrustScoreCriteria() {
    return (
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
