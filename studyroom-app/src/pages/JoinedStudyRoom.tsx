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
  position: relative;

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

const StatusBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #ff6b6b;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: bold;
`;

const Main = styled.main`
    display: flex;
    flex-direction: column; /* 수직 레이아웃으로 변경 */
    gap: 24px;
`;

const ContentArea = styled.section`
    background-color: ${({ theme }) => theme.surface};
    border-radius: 8px;
    padding: 24px;
    min-height: 400px;
`;

const JoinedStudyRoom: React.FC = () => {
    const { id: studyId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUserId } = useAuth();
    const [study, setStudy] = useState<StudyRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<"LEADER" | "MEMBER">("MEMBER");

    useEffect(() => {
        if (!studyId) return;
        const fetchStudyDetails = async () => {
            setLoading(true);
            try {
                const [studyResponse, roleResponse] = await Promise.all([
                    axiosInstance.get<StudyRoom>(`/study-rooms/${studyId}`),
                    axiosInstance.get<string>(`/study-rooms/${studyId}/role`)
                ]);
                setStudy(studyResponse.data);
                setUserRole(roleResponse.data as "LEADER" | "MEMBER");
            } catch (error) {
                // ...
            } finally {
                setLoading(false);
            }
        };
        fetchStudyDetails();
    }, [studyId, navigate]);

    const handleLeaveOrClose = async () => {
        if (userRole === 'LEADER') {
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
                {study.status === 'CLOSED' && (
                    <StatusBadge> 폐쇄된 스터디 </StatusBadge>
                )}
                <h2>{study.title}</h2>
                <p>
                    모임장: {study.hostNickname} | 인원 {study.currentMembers}/{study.maxMembers} | 진행방식:{" "}
                    {study.location}
                </p>
            </HeaderBox>
            <Main>
                <ContentArea>
                    <Outlet context={{ studyId, userRole, studyStatus: study.status, onLeaveOrClose: handleLeaveOrClose }} />
                </ContentArea>
            </Main>
        </Container>
    );
};

export default JoinedStudyRoom;
