// JoinedStudyRoomList.tsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { StudyRoom } from "../types/study";

interface JoinedStudyRoomListProps {
    room: StudyRoom;
}

/* ─ styled-components (scoped) ─ */
const Wrapper = styled.div`
  background-color: #2c2f3b;
  border: 1px solid #3e414f;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const Details = styled.div`
  font-size: 14px;
  color: #d1d5db;

  p {
    margin: 2px 0;
  }

  strong {
    color: #8c92a7;
    margin-right: 8px;
    display: inline-block;
    width: 60px;
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const GoButton = styled(Link)`
  background-color: #5865f2;
  color: #ffffff;
  text-decoration: none;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4f46e5;
  }
`;

/* ─ Component ─ */
const JoinedStudyRoomList: React.FC<JoinedStudyRoomListProps> = ({ room }) => {
    return (
        <Wrapper>
            <div>
                <Title>{room.title}</Title>
                <Details>
                    <p>
                        <strong>지역:</strong> {room.location}
                    </p>
                    <p>
                        <strong>최대인원:</strong> {room.currentMembers} / {room.maxMembers} 명
                    </p>
                    <p>
                        <strong>모집직무:</strong> {room.job}
                    </p>
                    <p>
                        <strong>기술스택:</strong> {room.tags.join(", ")}
                    </p>
                </Details>
            </div>

            <Actions>
                <GoButton to={`../joined-study/${room.id}`}>면접스터디룸 바로가기</GoButton>
            </Actions>
        </Wrapper>
    );
};

export default JoinedStudyRoomList;
