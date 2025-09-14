// JoinedStudyRoom.tsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { StudyRoom } from "../types/study";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

type UserRole = "LEADER" | "MEMBER";

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
    flex-direction: column; /* 수직 레이아웃으로 변경 */
    gap: 24px;
`;

const ContentArea = styled.section`
  width: 100%; /* 너비를 100%로 설정 */
`;

const JoinedStudyRoom: React.FC = () => {
    const { id: studyId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUserId } = useAuth();
    const [study, setStudy] = useState<StudyRoom | null>(null);
    const [userRole, setUserRole] = useState<UserRole>("MEMBER");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studyId) return;
        const fetchStudyDetails = async () => {
            try {
                const response = await axiosInstance.get<StudyRoom>(`/study-rooms/${studyId}`);
                setStudy(response.data);
                // 모임장 ID와 현재 사용자 ID를 비교하여 역할 결정
                if (response.data.hostId === currentUserId) {
                    setUserRole("LEADER");
                } else {
                    setUserRole("MEMBER");
                }
            } catch (error) {
                console.error("스터디 정보 로딩 실패:", error);
                alert("스터디 정보를 불러올 수 없습니다.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchStudyDetails();
    }, [studyId, currentUserId, navigate]);

    const handleLeaveOrClose = async () => {
        if (userRole === "LEADER") {
            if (window.confirm("정말로 스터디를 폐쇄하시겠습니까? 모든 데이터가 삭제됩니다.")) {
                try {
                    await axiosInstance.delete(`/study-rooms/${studyId}`);
                    alert("스터디가 폐쇄되었습니다.");
                    navigate("/studies/my-studies"); // 내 스터디 목록으로 이동
                } catch (error) {
                    alert("스터디 폐쇄에 실패했습니다.");
                }
            }
        } else {
            if (window.confirm("정말로 스터디에서 탈퇴하시겠습니까?")) {
                try {
                    await axiosInstance.delete(`/study-rooms/${studyId}/membership`);
                    alert("스터디에서 탈퇴 처리되었습니다.");
                    navigate("/studies/my-studies");
                } catch (error) {
                    alert("스터디 탈퇴에 실패했습니다.");
                }
            }
        }
    };

    if (loading || !study) {
        return <div>스터디 정보를 불러오는 중...</div>;
    }

    return (
        <Container>
            <HeaderBox className="room-header">
                <h2>{study.title}</h2>
                <p>
                    모임장: {study.hostNickname} | 인원 {study.currentMembers}/{study.maxMembers} | 진행방식:{" "}
                    {study.location}
                </p>
            </HeaderBox>

            <Main className="room-main-content">
                <ContentArea className="room-content-area">
                    <Outlet context={{ studyId, userRole, onLeaveOrClose: handleLeaveOrClose }} />
                </ContentArea>
            </Main>
        </Container>
    );
};

export default JoinedStudyRoom;
