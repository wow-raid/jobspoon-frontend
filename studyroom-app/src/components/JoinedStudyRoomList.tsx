import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { StudyRoom } from "../types/study";

interface JoinedStudyRoomListProps {
  room: StudyRoom;
}

/* ─ styled-components (themed) ─ */
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.fg};
`;

const Details = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.subtle};

  p {
    margin: 2px 0;
  }

  strong {
    color: ${({ theme }) => theme.muted};
    margin-right: 8px;
    display: inline-block;
    width: 60px;
  }
`;

const Actions = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end; 
  margin-top: 24px;
`;

const GoButton = styled(Link)`
  background-color: ${({ theme }) => theme.primary};
  text-decoration: none;
  border: none;
  border-radius: 6px;                                                                                                                                                                                                                                                                                                                                     
  padding: 12px 20px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  &&, &&:link, &&:visited, &&:hover, &&:active {
    color: #fff;
  }

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const ClosedButton = styled.div`
  background-color: ${({ theme }) => theme.muted};
  color: ${({ theme }) => theme.subtle};
  text-decoration: none;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: bold;
  cursor: not-allowed;
  text-align: center;
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
            <strong>모집직무:</strong> {room.recruitingRoles}
          </p>
          <p>
            <strong>기술스택:</strong> {room.skillStack.join(", ")}
          </p>
        </Details>
      </div>

      <Actions>
        {room.status === 'CLOSED' ? (
            <ClosedButton>폐쇄된 스터디모임</ClosedButton>
        ) : (
            <GoButton to={`../joined-study/${room.id}`}>면접스터디룸 바로가기</GoButton>
        )}
      </Actions>
    </Wrapper>
  );
};

export default JoinedStudyRoomList;
