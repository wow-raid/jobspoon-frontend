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

type Channel = {
    name: string;
    url: string;
    icon: string;
};

const INITIAL_LINKS: Channel[] = [
    { name: 'Kakao', url: 'https://open.kakao.com/o/', icon: kakaoLogo },
    { name: 'Google', url: 'https://meet.google.com/', icon: googleLogo },
    { name: 'Zoom', url: '', icon: zoomLogo },
    { name: 'Discord', url: 'https://discord.gg/', icon: discordLogo },
    { name: 'Naver', url: '', icon: naverLogo },
];

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;

  h2 {
    font-size: 22px;
    margin: 0 0 16px 0;
    color: #fff;
  }

  p {
    font-size: 15px;
    color: #a0a0a0;
    line-height: 1.6;
    margin-bottom: 32px;
  }
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
  background-color: #2d3748;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  padding: 16px;
  width: 100px;
  height: 100px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a5568;
  }
`;

const LinkBtn = styled.a`
  ${channelButtonBase}
`;

const DisabledBtn = styled.div`
  ${channelButtonBase}
  opacity: 0.4;
  cursor: not-allowed;

  &:hover {
    background-color: #2d3748; /* 비활성화 시 호버 없음 */
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
  color: #a0a0a0;
  border: 1px solid #4a5568;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #a0a0a0;
    color: white;
  }
`;

const TestInterview: React.FC = () => {
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
            <h2>🎙️ 모의면접 채널</h2>
            <p>
                선호하는 플랫폼을 선택하여 모의면접 채널에 참여하세요.
                <br />
                링크를 등록하거나 수정할 수 있습니다.
            </p>

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

                            <EditButton onClick={() => handleOpenModal(channel)}>
                                {disabled ? '링크 등록' : '링크 수정'}
                            </EditButton>
                        </Item>
                    );
                })}
            </Grid>

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
