import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Status, Application } from "../types/study";

interface ApplicationCardProps {
  application: Application;
  onCancel: (id: number) => void;
}

/* ─ styled-components (scoped) ─ */
const Card = styled(Link)`
  background-color: ${({ theme }) => theme.surface};
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease-in-out, border-color 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    /* primary 색에 고정된 알파 그림자 */
    box-shadow: 0 0 0 2px rgba(1, 176, 241, 0.35);
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

const Content = styled.div`
  flex-grow: 1;
  margin-right: 16px;
  overflow: hidden;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const AppliedDate = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.muted};
  margin: 0;
`;

const StatusTag = styled.div<{ $status: Status }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: bold;
  font-size: 13px;
  flex-shrink: 0;

  ${({ $status }) => {
    switch ($status) {
      case "pending":
        return `background-color: rgba(255,165,0,0.2); color: #ffa500;`;
      case "approved":
        return `background-color: rgba(4,199,114,0.2); color: #04c772;`;
      case "rejected":
        return `background-color: rgba(255,107,107,0.2); color: #ff6b6b;`;
    }
  }}
`;

const CancelButton = styled.button`
  background-color: #ff6b6b;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e05252;
  }

  &:disabled {
    background-color: #1A1A1F;
    color: #ffffff;
    cursor: not-allowed;
    border: 1px solid ${({ theme }) => theme.border};
  }
`;

/* ─ Component ─ */
const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onCancel,
}) => {
  const { id, study, status, appliedAt } = application;

  const STATUS_MAP = {
    pending: "대기중",
    approved: "수락됨",
    rejected: "거절됨",
  };
  const statusText = STATUS_MAP[status.toLowerCase()] || "알 수 없음";

    const formattedDate = new Date(appliedAt).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleCancelClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation(); // 부모(Link) 클릭 전파 방지
    onCancel(id);
  };

  return (
    <Card to={`../study/${study.id}`}>
      <Content>
        <Title>{study.title}</Title>

        <Meta>
          <AppliedDate>{formattedDate} 신청</AppliedDate>

          {status.toLowerCase() === "pending" ? (
            <CancelButton onClick={handleCancelClick}>신청 취소</CancelButton>
          ) : (
            <CancelButton disabled>취소 불가</CancelButton>
          )}
        </Meta>
      </Content>

      <StatusTag $status={status}>{statusText}</StatusTag>
    </Card>
  );
};

export default ApplicationCard;
