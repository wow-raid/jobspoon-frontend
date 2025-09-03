// JoinedStudyRoom.tsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { StudyRoom } from "../types/study";
import { FAKE_STUDY_ROOMS } from "../data/mockData";

// 현재 사용자 역할을 시뮬레이션합니다.
const CURRENT_USER_ROLE = "member";

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  /* 자식(후손) 라우트에서 공통으로 쓰는 클래스 유지 */
  .room-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
  .leave-button {
    background-color: #ff6b6b;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const HeaderBox = styled.header`
  background-color: ${({ theme }) => theme.surface};
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;

  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: ${({ theme }) => theme.fg};
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.subtle};
  }
`;

const Main = styled.main`
  display: flex;
  gap: 24px;
`;

const Sidebar = styled.nav`
  flex: 0 0 200px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: fit-content;
`;

const SidebarLink = styled(NavLink)`
  color: ${({ theme }) => theme.fg};
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 6px;
  transition: background-color 0.2s;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.surfaceHover};
  }
  &.active {
    background-color: ${({ theme }) => theme.accent ?? theme.primary};
    color: #fff;
  }
`;

const ContentArea = styled.section`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 24px;
  min-height: 400px;
`;

const JoinedStudyRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [study, setStudy] = useState<StudyRoom | undefined>(undefined);

    useEffect(() => {
        const foundStudy = FAKE_STUDY_ROOMS.find((room) => String(room.id) === id);
        setStudy(foundStudy);
    }, [id]);

    const handleLeaveOrClose = () => {
        if (CURRENT_USER_ROLE === "leader") {
            if (window.confirm("정말로 스터디를 폐쇄하시겠습니까?")) {
                console.log(`스터디 ${id} 폐쇄됨`);
                alert("스터디가 폐쇄되었습니다.");
                navigate("/");
            }
        } else {
            if (window.confirm("정말로 스터디에서 탈퇴하시겠습니까?")) {
                console.log(`스터디 ${id}에서 탈퇴함`);
                alert("스터디에서 탈퇴 처리되었습니다.");
                navigate("/");
            }
        }
    };

    if (!study) {
        return <div>스터디 정보를 불러오는 중...</div>;
    }

    return (
        <Container>
            <HeaderBox className="room-header">
                <h2>{study.title}</h2>
                <p>
                    모임장: {study.host} | 인원 {study.currentMembers}/{study.maxMembers} | 진행방식:{" "}
                    {study.location}
                </p>
            </HeaderBox>

            <Main className="room-main-content">
                <Sidebar className="room-sidebar">
                    <SidebarLink to="" end>
                        공지사항
                    </SidebarLink>
                    <SidebarLink to="schedule">일정관리</SidebarLink>
                    <SidebarLink to="interview">모의면접</SidebarLink>
                    <SidebarLink to="members">참여인원</SidebarLink>
                </Sidebar>

                <ContentArea className="room-content-area">
                    {/* context를 통해 자식에게 필요한 데이터와 함수를 전달 */}
                    <Outlet context={{ userRole: CURRENT_USER_ROLE, onLeaveOrClose: handleLeaveOrClose }} />
                </ContentArea>
            </Main>
        </Container>
    );
};

export default JoinedStudyRoom;
