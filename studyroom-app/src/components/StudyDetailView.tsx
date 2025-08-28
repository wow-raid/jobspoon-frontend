// StudyDetailView.tsx
import React from "react";
import styled from "styled-components";
import { StudyRoom } from "../types/study";
import Tag from "./Tag";

interface StudyDetailViewProps {
    room: StudyRoom;
    isOwner: boolean; // 👈 모임장 여부 prop 추가
    onApplyClick: () => void;
    onEditClick: () => void; // 👈 수정 버튼 클릭 핸들러 prop 추가
    hasApplied: boolean;
}

/* ─ styled-components (scoped) ─ */
const Wrapper = styled.div`
  color: #d1d5db;
  padding: 8px;
`;

const Header = styled.header`
  border-bottom: 1px solid #3e414f;
  padding-bottom: 16px;
  margin-bottom: 24px;
`;

const Category = styled.span`
  font-size: 14px;
  color: #8c92a7;
  margin-bottom: 8px;
  display: block;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 12px 0;
`;

const Meta = styled.div`
  display: flex;
  gap: 24px;
  font-size: 14px;
`;

const Section = styled.section`
  margin-bottom: 24px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #e5e7eb;
    margin: 0 0 12px 0;
    border-left: 3px solid #6366f1;
    padding-left: 8px;
  }
`;

const SectionText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ReqList = styled.ul`
  list-style-position: inside;
  padding-left: 4px;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px solid #3e414f;
`;

const ApplyBtn = styled.button<{ $applied?: boolean }>`
  background-color: ${({ $applied }) => ($applied ? "#4a5568" : "#6366f1")};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 18px;
  font-weight: bold;
  cursor: ${({ $applied }) => ($applied ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $applied }) => ($applied ? "#4a5568" : "#4f46e5")};
  }
`;

const BaseButton = styled.button`
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const EditBtn = styled(BaseButton)`
  background-color: #3a3f4c;
  &:hover {
    background-color: #4b5563;
  }
`;

/* ─ Component ─ */
const StudyDetailView: React.FC<StudyDetailViewProps> = ({
    room,
    isOwner,
    onApplyClick,
    onEditClick,
    hasApplied,
}) => {
    return (
        <Wrapper>
            <Header>
                <Category>{room.studyLevel}</Category>
                <Title>{room.title}</Title>
                <Meta>
                    <span>
                        <strong>멤버:</strong> {room.maxMembers}명
                    </span>
                    <span>
                        <strong>상태:</strong>{" "}
                        {room.status === "RECRUITING" ? "모집 중" : "모집 완료"}
                    </span>
                </Meta>
            </Header>

            <Section>
                <h3>스터디 설명</h3>
                <SectionText>{room.description}</SectionText>
            </Section>

            <Section>
                <h3>모집 직군</h3>
                <TagList>
                    {room.recruitingRoles.map((role) => (
                        <Tag key={role} text={role} />
                    ))}
                </TagList>
            </Section>

            <Section>
                <h3>기술 스택</h3>
                <TagList>
                    {room.skillStack.map((tag) => (
                        <Tag key={tag} text={tag} />
                    ))}
                </TagList>
            </Section>

            <Footer>
                {isOwner ? (
                    // 모임장일 경우 '수정하기' 버튼 표시
                    <EditBtn onClick={onEditClick}>수정하기</EditBtn>
                ) : (
                    // 참가자일 경우 '참가 신청하기' 버튼 표시
                    room.status === "RECRUITING" && (
                        <ApplyBtn
                            $applied={hasApplied}
                            onClick={onApplyClick}
                            disabled={hasApplied}
                        >
                            {hasApplied ? "신청완료" : "참가 신청하기"}
                        </ApplyBtn>
                    )
                )}
            </Footer>
        </Wrapper>
    );
};

export default StudyDetailView;
