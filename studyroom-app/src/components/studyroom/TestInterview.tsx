import React, { useState } from 'react';
import '../../styles/TestInterview.css';
import Modal from '../Modal';
import LinkEditForm from "./LinkEditForm.tsx";
import kakaoLogo from '../../assets/kakao_logo.png';
import googleLogo from '../../assets/google_logo.png';
import zoomLogo from '../../assets/zoom_logo.png';
import discordLogo from '../../assets/discord_logo.png';
import naverLogo from '../../assets/naver_logo.png';

const INITIAL_LINKS = [
    {
        name: 'Kakao',
        url: 'https://open.kakao.com/o/',
        icon: kakaoLogo,
    },
    {
        name: 'Google',
        url: 'https://meet.google.com/',
        icon: googleLogo,
    },
    {
        name: 'Zoom',
        url: '',
        icon: zoomLogo,
    },
    {
        name: 'Discord',
        url: 'https://discord.gg/',
        icon: discordLogo,
    },
    {
        name: 'Naver',
        url: '',
        icon: naverLogo,
    },
];

const TestInterview: React.FC = () => {
    const [channels, setChannels] = useState(INITIAL_LINKS);

    // 모달창 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);

    const handleOpenModal = (channel) => {
        setEditingChannel(channel);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingChannel(null);
    }

    // 링크 수정 핸들러
    const handleUpdateLink = (newUrl: string) => {
        setChannels(prevChannels =>
            prevChannels.map(channel =>
                channel.name === editingChannel.name
                    ? { ...channel, url: newUrl }
                    : channel
            )
        );
        handleCloseModal();
    };

    return (
        <div className="test-interview-container">
            <h2>🎙️ 모의면접 채널</h2>
            <p>
                선호하는 플랫폼을 선택하여 모의면접 채널에 참여하세요.
                <br />
                링크를 등록하거나 수정할 수 있습니다.
            </p>
            <div className="channel-btns">
                    {channels.map((channel) => {
                        const isDisabled = !channel.url;
                        const ChannelTag = isDisabled ? 'div' : 'a';

                        return (
                            <div key={channel.name} className="channel-item">
                                <ChannelTag
                                    href={isDisabled ? undefined : channel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`channel-btn ${isDisabled ? 'disabled' : ''}`}
                                >
                                    <img src={channel.icon} alt={channel.name} className="channel-icon" />
                                    <span className="channel-name">{channel.name}</span>
                                </ChannelTag>
                                <button className="edit-link-btn" onClick={() => handleOpenModal(channel)}>
                                    {isDisabled ? '링크 등록' : '링크 수정'}
                                </button>
                            </div>
                        );
                    })}
                </div>

            {/* 링크 수정 모달 */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {editingChannel && (
                    <LinkEditForm
                        channelName={editingChannel.name}
                        initialUrl={editingChannel.url}
                        onSubmit={handleUpdateLink}
                    />
                )}
            </Modal>
        </div>
    );
};

export default TestInterview;