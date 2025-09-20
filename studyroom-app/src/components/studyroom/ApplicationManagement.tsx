import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { NavLink, useOutletContext } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import TabSearchBar from "./TabSearchBar";

// 백엔드 응답 DTO와 일치하는 타입
interface Application {
    applicationId: number;
    applicantId: number;
    applicantNickname: string;
    message: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    appliedAt: string;
}

// 부모로부터 받을 context 타입
interface ManagementContext {
    studyId: string;
    userRole: 'LEADER' | 'MEMBER' | null;
}

/* --- Tab Navigation styled-components --- */
const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.surface};
    padding: 12px 20px;
    border-radius: 8px;
`;

const TabList = styled.nav`
  display: flex;
  gap: 8px;
`;

const TabLink = styled(NavLink)`
    padding: 10px 16px;
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.subtle};
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.fg};
    }

    &.active {
        color: ${({ theme }) => theme.accent ?? theme.primary};
        border-bottom-color: ${({ theme }) => theme.accent ?? theme.primary};
    }
`;
/* --- End of Tab Navigation --- */


/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
    padding: 0 8px 24px 8px;
    h2 {
        margin: 0;
        font-size: 20px;
        color: ${({ theme }) => theme.fg};
        span {
            font-size: 16px;
            font-weight: 500;
            color: ${({ theme }) => theme.subtle};
            margin-left: 8px;
        }
    }
`;

const ContentWrapper = styled.div`
  margin-top: 24px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 24px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.surfaceHover};
  border-radius: 8px;
  margin-bottom: 12px;
`;

const UserInfo = styled.div`
  color: ${({ theme }) => theme.fg};
`;

const Nickname = styled.p`
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.subtle};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ approve?: boolean }>`
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  background-color: ${({ theme, approve }) => approve ? (theme.accent ?? theme.primary) : theme.danger};
  color: white;
  &:hover { filter: brightness(1.1); }
`;


const ApplicationManagement: React.FC = () => {
    const { studyId, userRole } = useOutletContext<ManagementContext>();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = useCallback(async () => {
        if (!studyId || userRole !== 'LEADER') {
            setLoading(false);
            return;
        };
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/study-applications/host/${studyId}`);
            setApplications(response.data);
        } catch (error) {
            console.error("신청 목록 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    }, [studyId, userRole]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleProcess = async (applicationId: number, status: 'APPROVED' | 'REJECTED') => {
        const action = status === 'APPROVED' ? '수락' : '거절';
        if (!window.confirm(`이 신청을 ${action}하시겠습니까?`)) return;

        try {
            await axiosInstance.patch(`/study-applications/${applicationId}/process`, { status });
            alert(`신청을 ${action}했습니다.`);
            fetchApplications(); // 목록 새로고침
        } catch (error) {
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    const pendingApplications = applications.filter(app => app.status === 'PENDING');

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (userRole !== 'LEADER') {
        return <div>이 페이지에 접근할 권한이 없습니다.</div>
    }

    return (
        <Container>
            <Header>
                <h2>신청 관리 <span>({pendingApplications.length}건 대기중)</span></h2>
            </Header>

            <NavContainer>
                <TabList>
                    <TabLink to={`/studies/joined-study/${studyId}`} end>공지사항</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/schedule`}>일정관리</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/interview`}>모의면접</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/members`}>참여인원</TabLink>
                    {userRole === 'LEADER' && (
                        <>
                            <TabLink to={`/studies/joined-study/${studyId}/applications`}>신청 관리</TabLink>
                            <TabLink to={`/studies/joined-study/${studyId}/attendance`}>출석 관리</TabLink>
                        </>
                    )}
                </TabList>
                {/* 신청 관리 페이지에서는 검색창이 필요 없으므로 렌더링하지 않음 */}
            </NavContainer>

            <ContentWrapper>
                {pendingApplications.length > 0 ? (
                    pendingApplications.map(app => (
                        <Item key={app.applicationId}>
                            <UserInfo>
                                <Nickname>{app.applicantNickname}</Nickname>
                                <Message>{app.message}</Message>
                            </UserInfo>
                            <Actions>
                                <ActionButton onClick={() => handleProcess(app.applicationId, 'REJECTED')}>
                                    거절
                                </ActionButton>
                                <ActionButton approve onClick={() => handleProcess(app.applicationId, 'APPROVED')}>
                                    수락
                                </ActionButton>
                            </Actions>
                        </Item>
                    ))
                ) : (
                    <p>대기중인 신청이 없습니다.</p>
                )}
            </ContentWrapper>
        </Container>
    );
};

export default ApplicationManagement;