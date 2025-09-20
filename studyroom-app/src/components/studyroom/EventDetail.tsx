import React from 'react';
import styled from 'styled-components';
import { Schedule } from "../../types/study";

interface CurrentUser {
    id: number | null;
    role: string | null;
}

interface EventDetailProps {
  event: Schedule
  currentUser: CurrentUser;
    onEdit?: () => void;
    onDelete?: () => void;
    onAttend: () => void;
}

const Container = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.fg};
`;

const Title = styled.h3`
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.fg};
`;

const Info = styled.p`
  font-size: 14px;
  margin: 8px 0;
  color: ${({ theme }) => theme.fg};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const ActionsWrapper = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const OwnerActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const MemberActions = styled.div`
  display: flex;
  justify-content: center;
`;

const Btn = styled.button`
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
`;

const AttendBtn = styled(Btn)<{ $attended?: boolean }>`
  background-color: ${({ theme, $attended }) => $attended ? theme.successFg : theme.accent};
  color: white;
  width: 100%;
  padding: 12px 20px;

  &:hover {
    background-color: ${({ theme, $attended }) => $attended ? theme.successFg : theme.accentHover};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const EditBtn = styled(Btn)`
  background-color: ${({ theme }) => theme.surfaceHover};
  &:hover { filter: brightness(1.05); }
`;

const DeleteBtn = styled(Btn)`
  background-color: ${({ theme }) => theme.danger ?? '#ff6b6b'};
  &:hover { background-color: ${({ theme }) => theme.dangerHover ?? '#f05252'}; }
`;

const EventDetail: React.FC<EventDetailProps> = ({ event, currentUser, onEdit, onDelete, onAttend }) => {
    const isOwner = (currentUser.id !== null && currentUser.id === event.authorId) || currentUser.role === 'LEADER';

    // 내가 이미 참석했는지 여부
    const hasAttended = !!event.myAttendanceStatus;

  return (
    <Container>
      <Title>{event.title}</Title>
        <Info>
            <strong>작성자:</strong> {event.authorNickname}
        </Info>
      <Info>
        <strong>시간:</strong> {new Date(event.start).toLocaleString()} ~ {new Date(event.end).toLocaleString()}
      </Info>
      {event.description && (
        <Info>
          <strong>설명:</strong> {event.description}
        </Info>
      )}

        <ActionsWrapper>
            {/* 멤버는 누구나 출석 버튼을 볼 수 있음 */}
            <MemberActions>
                <AttendBtn onClick={onAttend} disabled={hasAttended} $attended={hasAttended}>
                    {hasAttended ? "참석 완료" : "참석하기"}
                </AttendBtn>
            </MemberActions>

            {isOwner && onEdit && onDelete && (
                <OwnerActions style={{ marginTop: '12px' }}>
                    <EditBtn onClick={onEdit}>수정</EditBtn>
                    <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>
                </OwnerActions>
            )}
        </ActionsWrapper>
    </Container>
  );
};
export default EventDetail;
