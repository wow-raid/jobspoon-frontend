import React from 'react';
import styled from 'styled-components';
import { ScheduleEvent } from '../../data/mockData';

interface EventDetailProps {
  event: ScheduleEvent;
  currentUser: { id: string };
  onEdit: () => void;
  onDelete: () => void;
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

const Btn = styled.button`
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
`;

const EditBtn = styled(Btn)`
  background-color: ${({ theme }) => theme.surfaceHover};
  &:hover { filter: brightness(1.05); }
`;

const DeleteBtn = styled(Btn)`
  background-color: ${({ theme }) => theme.danger ?? '#ff6b6b'};
  &:hover { background-color: ${({ theme }) => theme.dangerHover ?? '#f05252'}; }
`;

const EventDetail: React.FC<EventDetailProps> = ({ event, currentUser, onEdit, onDelete }) => {
  const isOwner = currentUser.id === event.authorId;

  return (
    <Container>
      <Title>{event.title}</Title>
      <Info>
        <strong>시간:</strong> {new Date(event.start).toLocaleString()} ~ {new Date(event.end).toLocaleString()}
      </Info>
      {event.description && (
        <Info>
          <strong>설명:</strong> {event.description}
        </Info>
      )}

      {isOwner && (
        <Actions>
          <EditBtn onClick={onEdit}>수정</EditBtn>
          <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>
        </Actions>
      )}
    </Container>
  );
};

export default EventDetail;
