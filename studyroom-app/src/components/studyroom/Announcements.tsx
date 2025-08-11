import React, { useState, useMemo } from 'react';
import { FAKE_ANNOUNCEMENTS, Announcement } from '../../data/mockData';
import '../../styles/Announcements.css';
import Modal from "../Modal";
import AnnouncementForm from './AnnouncementForm';
import AnnouncementDetail from "./AnnouncementDetail";

const Announcements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(FAKE_ANNOUNCEMENTS);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddAnnouncement = (formData: { title: string; content: string }) => {
        const newAnnouncement: Announcement = {
            id: Date.now(),
            author: '모임장',
            createdAt: '방금 전',
            pinned: false,
            ...formData,
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsWriteModalOpen(false);
    };

    const handleViewDetail = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDetailModalOpen(true);
    };

    const handlePinToggle = (id: number) => {
        // pinned 상태만 변경하고, 정렬은 useMemo에 맡깁니다.
        setAnnouncements(prevAnnouncements =>
            prevAnnouncements.map(item =>
                item.id === id ? { ...item, pinned: !item.pinned } : item
            )
        );
    };

    const displayedAnnouncements = useMemo(() => {
        return [...announcements]
            .sort((a, b) => {
                // 1. 고정 상태가 다르면, 고정된 것이 항상 위로 (b.pinned가 true이면 1, a.pinned가 true이면 -1)
                if (a.pinned !== b.pinned) {
                    return a.pinned ? -1 : 1;
                }
                // 2. 고정 상태가 같으면, 최신 글(id가 높은)이 위로
                return b.id - a.id;
            })
            .filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [announcements, searchTerm]);

    return (
        <div className="announcements-container">
            <div className="announcements-header">
                <h2>📢 공지사항</h2>
                <button className="write-btn" onClick={() => setIsWriteModalOpen(true)}>글쓰기</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="공지사항 제목으로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="announcements-list">
                {displayedAnnouncements.map(item => (
                    <div key={item.id} className={`announcement-item clickable ${item.pinned ? 'pinned' : ''}`}>
                        <div className="item-main-content" onClick={() => handleViewDetail(item)}>
                            <div className="item-header">
                                <span className="item-title">{item.pinned && '📌 '}{item.title}</span>
                                <span className="item-meta">{item.author} · {item.createdAt}</span>
                            </div>
                        </div>

                        <button className="pin-button" onClick={(e) => {
                            e.stopPropagation();
                            handlePinToggle(item.id);
                        }}>
                            {item.pinned ? '고정 해제' : '상단 고정'}
                        </button>
                    </div>
                ))}
            </div>

            <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
                <AnnouncementForm onSubmit={handleAddAnnouncement} />
            </Modal>

            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
                {selectedAnnouncement && <AnnouncementDetail announcement={selectedAnnouncement} />}
            </Modal>
        </div>
    );
};

export default Announcements;