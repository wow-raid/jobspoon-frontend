// TestInterview.tsx
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Modal from '../Modal';
import LinkEditForm from './LinkEditForm.tsx';
import kakaoLogo from '../../assets/kakao_logo.png';
import googleLogo from '../../assets/google_logo.png';
import zoomLogo from '../../assets/zoom_logo.png';
import discordLogo from '../../assets/discord_logo.png';
import naverLogo from '../../assets/naver_logo.png';
import {NavLink, useOutletContext, useParams} from "react-router-dom";

type Channel = {
    name: string;
    url: string;
    icon: string;
};

interface StudyRoomContext {
    studyId: string;
    userRole: 'LEADER' | 'MEMBER' | null;
    studyStatus: 'RECRUITING' | 'COMPLETED' | 'CLOSED';
    onLeaveOrClose: () => void;
}

const INITIAL_LINKS: Channel[] = [
    { name: 'Kakao', url: 'https://open.kakao.com/o/', icon: kakaoLogo },
    { name: 'Google', url: 'https://meet.google.com/', icon: googleLogo },
    { name: 'Zoom', url: '', icon: zoomLogo },
    { name: 'Discord', url: 'https://discord.gg/', icon: discordLogo },
    { name: 'Naver', url: '', icon: naverLogo },
];

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
    padding: 0 8px 24px 8px;

    h2 {
        margin: 0;
        font-size: 20px;
        color: ${({ theme }) => theme.fg};
    }
`;

const ContentWrapper = styled.div`
  margin-top: 24px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 24px;
`;

const Description = styled.p`
    font-size: 15px;
    color: ${({ theme }) => theme.subtle};
    line-height: 1.6;
    margin-bottom: 32px;
    text-align: center;
`;

const Grid = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px; /* 아이콘 버튼과 수정 버튼 사이 간격 */
`;

const channelButtonBase = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.fg};
    text-decoration: none;
    border-radius: 10px;
    padding: 16px;
    width: 100px;
    height: 100px;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.border};
    }
`;

const LinkBtn = styled.a`
  ${channelButtonBase}
`;

const DisabledBtn = styled.div`
    ${channelButtonBase}
    opacity 0.4;
    cursor: not-allowed;

    &:hover {
        background-color: ${({ theme }) => theme.surfaceHover};
    }
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
`;

const Name = styled.span`
  font-size: 14px;
`;

const EditButton = styled.button`
    background-color: transparent;
    color: ${({ theme }) => theme.subtle};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: ${({ theme }) => theme.fg};
        color: ${({ theme }) => theme.fg};
    }
`;

const TestInterview: React.FC = () => {
    const { id: studyRoomId } = useParams<{ id: string }>();
    const { studyId, userRole, studyStatus, onLeaveOrClose } = useOutletContext<StudyRoomContext>();
    const [channels, setChannels] = useState<Channel[]>(INITIAL_LINKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

    const handleOpenModal = (channel: Channel) => {
        setEditingChannel(channel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingChannel(null);
    };

    const handleUpdateLink = (newUrl: string) => {
        if (!editingChannel) return;
        setChannels(prev =>
            prev.map(ch => (ch.name === editingChannel.name ? { ...ch, url: newUrl } : ch)),
        );
        handleCloseModal();
    };

    return (
        <Container>
            <Header>
                <h2>🎙️모의면접채널</h2>
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
            <Description>
                선호하는 플랫폼을 선택하여 모의면접 채널에 참여하세요.
                <br />
                링크를 등록하거나 수정할 수 있습니다.
            </Description>

            <Grid>
                {channels.map(channel => {
                    const disabled = !channel.url;

                    return (
                        <Item key={channel.name}>
                            {disabled ? (
                                <DisabledBtn>
                                    <Icon src={channel.icon} alt={channel.name} />
                                    <Name>{channel.name}</Name>
                                </DisabledBtn>
                            ) : (
                                <LinkBtn href={channel.url} target="_blank" rel="noopener noreferrer">
                                    <Icon src={channel.icon} alt={channel.name} />
                                    <Name>{channel.name}</Name>
                                </LinkBtn>
                            )}
                            {studyStatus !== 'CLOSED' && userRole === 'LEADER' && (
                            <EditButton onClick={() => handleOpenModal(channel)}>
                                {disabled ? '링크 등록' : '링크 수정'}
                            </EditButton>
                            )}
                        </Item>
                    );
                })}
            </Grid>
            </ContentWrapper>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {editingChannel && (
                    <LinkEditForm
                        channelName={editingChannel.name}
                        initialUrl={editingChannel.url}
                        onSubmit={handleUpdateLink}
                    />
                )}
            </Modal>
        </Container>
    );
};

export default TestInterview;
