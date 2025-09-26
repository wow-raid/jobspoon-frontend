// Participants.tsx
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { NavLink, useOutletContext, useParams } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import ParticipantsReportModal from "./ParticipantsReportModal";

interface Member {
    id: number;
    nickname: string;
    role: 'LEADER' | 'MEMBER';
}

interface StudyRoomContext {
    studyId: string;
    userRole: 'LEADER' | 'MEMBER' | null;
    studyStatus: 'RECRUITING' | 'COMPLETED' | 'CLOSED';
    onLeaveOrClose: () => void;
}

/* --- NEW: Tab Navigation styled-components --- */
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px 24px 8px;

    h2 {
        margin: 0;
        font-size: 20px;
        color: ${({ theme }) => theme.fg};

        span {
            color: ${({ theme }) => theme.subtle};
            font-size: 16px;
            margin-left: 6px;
        }
    }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const LeaveButton = styled.button`
  background-color: #ff6b6b;
  color: white;
`;

const ContentWrapper = styled.div`
  margin-top: 24px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 24px;
`;

const Section = styled.section`
    margin-bottom: 32px;

    &:last-of-type {
        margin-bottom: 0;
    }
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.subtle};
    margin: 0 0 12px 0;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
    background-color: ${({ theme }) => theme.surfaceHover};
  padding: 12px 16px;
  border-radius: 8px;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MemberName = styled.span`
  font-weight: 500;
  color: #e5e7eb;
`;

const RoleBadge = styled.span<{ $type: 'leader' | 'member' }>`
  font-size: 13px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 12px;
  ${({ $type }) =>
        $type === 'leader'
            ? `color: #ffc107; background-color: rgba(255,193,7,0.1);`
            : `color: #878e99; background-color: rgba(135,142,153,0.2);`}
`;

const NoMembersText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.subtle};
  text-align: center;
  padding: 40px;
  margin: 0;
`;

const MemberActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const KickButton = styled.button`
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ff6b6b;
    color: white;
  }
`;

const ReportButton = styled(KickButton)`
    color: $f59e0b;
    border-color: $f59e0b;
    &:hover { background-color: $f59e0b; color: white; }
`;


const Participants: React.FC = () => {
    const { studyId, userRole, studyStatus, onLeaveOrClose } = useOutletContext<StudyRoomContext>();
    const { nickname: currentUserNickname } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [reportingMember, setReportingMember] = useState<Member | null>(null);

    const fetchMembers = useCallback(async () => {
        if (!studyId) return;
        try {
            const response = await axiosInstance.get<Member[]>(`/study-rooms/${studyId}/members`);
            setMembers(response.data);
        } catch (error) {
            console.error("멤버 목록 로딩 실패:", error);
        }
    }, [studyId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleKickMember = async (memberId: number, memberNickname: string) => {
        if (window.confirm(`정말로 '${memberNickname}'님을 강퇴하시겠습니까?`)) {
            try {
                await axiosInstance.delete(`/study-rooms/${studyId}/members/${memberId}`);
                alert(`${memberNickname}님을 강퇴했습니다.`);
                fetchMembers(); // 멤버 목록 새로고침
            } catch (error) {
                console.error("멤버 강퇴 실패:", error);
                alert("멤버 강퇴에 실패했습니다.");
            }
        }
    };

    const currentUser = members.find(member => member.nickname === currentUserNickname);
    const currentUserId = currentUser?.id;

    const leader = members.find(m => m.role === 'LEADER');
    const participants = members.filter(m => m.role === 'MEMBER');

    return (
        <Container>
            <Header>
                <h2>
                    👥참여인원<span>({members.length}명)</span>
                </h2>
            </Header>

            <NavContainer>
            <TabList>
                <TabLink to={`/studies/joined-study/${studyId}`} end>공지사항</TabLink>
                <TabLink to={`/studies/joined-study/${studyId}/schedule`}>일정관리</TabLink>
                <TabLink to={`/studies/joined-study/${studyId}/interview`}>모의면접</TabLink>
                <TabLink to={`/studies/joined-study/${studyId}/members`}>참여인원</TabLink>
                {userRole === 'LEADER' && (
                    <>
                        <TabLink to={`/studies/joined-study/${studyId}/applications`}>신청관리</TabLink>
                        <TabLink to={`/studies/joined-study/${studyId}/attendance`}>출석관리</TabLink>
                    </>
                )}
            </TabList>
            </NavContainer>

            <ContentWrapper>
            <Section>
                <SectionTitle>모임장</SectionTitle>
                {leader && (
                    <MemberItem>
                        <MemberInfo>
                            <MemberName>{leader.nickname}</MemberName>
                        </MemberInfo>
                        <MemberActions>
                            <RoleBadge $type="leader">모임장</RoleBadge>
                            {leader.id !== currentUserId && studyStatus !== 'CLOSED' && (
                                <ReportButton onClick={() => setReportingMember(leader)}>신고하기</ReportButton>
                            )}
                        </MemberActions>
                    </MemberItem>
                )}
            </Section>

            <Section>
                <SectionTitle>참가자</SectionTitle>
                <MemberList>
                    {participants.length > 0 ? (
                        participants.map(p => (
                            <MemberItem key={p.id}>
                                <MemberInfo><MemberName>{p.nickname}</MemberName></MemberInfo>
                                <MemberActions>
                                    <RoleBadge $type="member">참가자</RoleBadge>
                                    {p.id !== currentUserId && studyStatus !== 'CLOSED' && (
                                        <>
                                            {userRole === 'LEADER' && (
                                                <KickButton onClick={() => handleKickMember(p.id, p.nickname)}>강퇴하기</KickButton>
                                                )}
                                            <ReportButton onClick={() => setReportingMember(p)}>신고하기</ReportButton>
                                        </>
                                    )}
                                </MemberActions>
                            </MemberItem>
                        ))
                    ) : (
                        <NoMembersText>아직 참여한 멤버가 없습니다.</NoMembersText>
                    )}
                </MemberList>
            </Section>
            </ContentWrapper>
            <Footer>
                <LeaveButton onClick={onLeaveOrClose} disabled={studyStatus === 'CLOSED'}>
                    {userRole === 'LEADER' ? '스터디 폐쇄하기' : '탈퇴하기'}
                </LeaveButton>
            </Footer>
            <ParticipantsReportModal
                studyId={studyId}
                reportedMember={reportingMember}
                onClose={() => setReportingMember(null)}
            />
        </Container>
    );
};

export default Participants;
