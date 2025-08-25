// Participants.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useOutletContext } from 'react-router-dom';
import { StudyMember, FAKE_STUDY_MEMBERS } from '../../data/mockData';

interface StudyRoomContext {
    userRole: 'leader' | 'member';
    onLeaveOrClose: () => void;
}

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3e414f;
  padding-bottom: 16px;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #fff;

    span {
      color: #a0a0a0;
      font-size: 16px;
      margin-left: 6px;
    }
  }
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #a0a0a0;
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
  background-color: #1e2129;
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
  color: #8c92a7;
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

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const LeaveButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

const Participants: React.FC = () => {
    const { userRole, onLeaveOrClose } = useOutletContext<StudyRoomContext>();
    const [members, setMembers] = useState<StudyMember[]>([]);

    useEffect(() => {
        setMembers(FAKE_STUDY_MEMBERS);
    }, []);

    const handleKickMember = (memberId: string, memberName: string) => {
        if (window.confirm(`정말로 '${memberName}'님을 강퇴하시겠습니까?`)) {
            setMembers(prev => prev.filter(m => m.id !== memberId));
            console.log(`${memberId} 강퇴됨`);
        }
    };

    const leader = members.find(m => m.role === 'leader');
    const participants = members.filter(m => m.role === 'member');

    return (
        <Container>
            <Header>
                <h2>
                    👥 참여인원 <span>({members.length}명)</span>
                </h2>
            </Header>

            <Section>
                <SectionTitle>모임장</SectionTitle>
                {leader && (
                    <MemberItem>
                        <MemberInfo>
                            <MemberName>{leader.name}</MemberName>
                        </MemberInfo>
                        <RoleBadge $type="leader">모임장</RoleBadge>
                    </MemberItem>
                )}
            </Section>

            <Section>
                <SectionTitle>참가자</SectionTitle>
                <MemberList>
                    {participants.length > 0 ? (
                        participants.map(p => (
                            <MemberItem key={p.id}>
                                <MemberInfo>
                                    <MemberName>{p.name}</MemberName>
                                </MemberInfo>
                                <MemberActions>
                                    <RoleBadge $type="member">참가자</RoleBadge>
                                    {userRole === 'leader' && (
                                        <KickButton onClick={() => handleKickMember(p.id, p.name)}>강퇴하기</KickButton>
                                    )}
                                </MemberActions>
                            </MemberItem>
                        ))
                    ) : (
                        <NoMembersText>아직 참여한 멤버가 없습니다.</NoMembersText>
                    )}
                </MemberList>
            </Section>

            <Footer>
                <LeaveButton onClick={onLeaveOrClose}>
                    {userRole === 'leader' ? '스터디 폐쇄하기' : '탈퇴하기'}
                </LeaveButton>
            </Footer>
        </Container>
    );
};

export default Participants;
