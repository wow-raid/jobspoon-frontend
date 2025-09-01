// studyroom-app/src/components/StudyRoomCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { StudyRoom } from "../types/study";

interface StudyRoomCardProps { room: StudyRoom; }

/* ─ styled-components (scoped) ─ */
const Card = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out;
  box-sizing: border-box;
`;

const WrapperLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;

  &:hover ${Card} {
    transform: scale(1.03);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const WrapperDiv = styled.div`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  cursor: not-allowed;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 13px;
`;

const StatusBadge = styled.span<{ $status: "RECRUITING" | "CLOSED" }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  ${({ $status, theme }) =>
    $status === "RECRUITING"
      ? `background-color: ${theme.badgeRecruitingBg}; color: ${theme.badgeRecruitingFg};`
      : `background-color: ${theme.badgeClosedBg}; color: ${theme.badgeClosedFg};`
  }
`;

const LocationInfo = styled.span`
  color: ${({ theme }) => theme.subtle};
`;

const CardBody = styled.div` flex-grow: 1; `;

const JobCategory = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.subtle};
  margin: 0 0 8px 0;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.fg};
  margin: 0 0 8px 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  min-height: 44px;
`;

const HostInfo = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
  margin-top: 16px;
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const TagItem = styled.span`
  background-color: ${({ theme }) => theme.tagBg};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const PostedAt = styled.div``;

const ClosedCardOverlay = styled(Card)`
  opacity: 0.6;
  background-color: ${({ theme }) => theme.surfaceAlt};
`;

/* ─ Component ─ */
const StudyRoomCard: React.FC<StudyRoomCardProps> = ({ room }) => {
  if (!room || !room.id) return null;
  const isClosed = room.status === "CLOSED";

  const content = (
    <>
      <CardTop>
        <StatusBadge $status={room.status}>
          {isClosed ? "모집완료" : "모집중"}
        </StatusBadge>
        <LocationInfo>{room.location}</LocationInfo>
      </CardTop>

      <CardBody>
        <JobCategory>{room.recruitingRoles?.[0] || '기타'}</JobCategory>
        <Title>{room.title}</Title>
        <HostInfo>by {room.host?.nickname || '모임장'}</HostInfo>
      </CardBody>

      <CardFooter>
        <Tags>
          {room.skillStack?.slice(0, 2).map((tag, idx) => (
            <TagItem key={`${tag}-${idx}`}>{tag}</TagItem>
          ))}
        </Tags>
        <PostedAt>{new Date(room.createdAt).toLocaleDateString()}</PostedAt>
      </CardFooter>
    </>
  );

  if (isClosed) {
    return (
      <WrapperDiv>
        <ClosedCardOverlay>{content}</ClosedCardOverlay>
      </WrapperDiv>
    );
  }

  return (
    <WrapperLink to={`study/${room.id}`}>
      <Card>{content}</Card>
    </WrapperLink>
  );
};

export default StudyRoomCard;
