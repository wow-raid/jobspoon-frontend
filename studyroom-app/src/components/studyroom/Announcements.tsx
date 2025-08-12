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
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 👇 1. 폼 제출을 처리하는 함수 (새 글, 수정 모두 담당)
    const handleFormSubmit = (formData: { title: string; content: string }) => {
        if (editingAnnouncement) {
            // 수정 모드일 경우
            setAnnouncements(prev => prev.map(item =>
                item.id === editingAnnouncement.id ? { ...item, ...formData } : item
            ));
        } else {
            // 새 글 작성 모드일 경우
            const newAnnouncement: Announcement = {
                id: Date.now(),
                author: '모임장',
                createdAt: '방금 전',
                pinned: false,
                ...formData,
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        closeFormModal(); // 폼 제출 후 모달 닫기
    };

    const handleViewDetail = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDetailModalOpen(true);
    };

    const handlePinToggle = (id: number) => {
        setAnnouncements(prev =>
            prev.map(item =>
                item.id === id ? { ...item, pinned: !item.pinned } : item
            )
        );
    };

    const handleEditClick = () => {
        if (!selectedAnnouncement) return;
        setEditingAnnouncement(selectedAnnouncement);
        setIsDetailModalOpen(false);
        setIsWriteModalOpen(true);
    };

    // 👇 2. 폼 모달을 닫고 수정 상태를 초기화하는 함수
    const closeFormModal = () => {
        setIsWriteModalOpen(false);
        setEditingAnnouncement(null);
    };

    const displayedAnnouncements = useMemo(() => {
        return [...announcements]
            .sort((a, b) => {
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 최신순 정렬
            })
            .filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [announcements, searchTerm]);

    return (
        <div className="announcements-container">
            <div className="announcements-header">
                <h2>📢 공지사항</h2>
                <button className="write-btn" onClick={() => {
                    setEditingAnnouncement(null); // 새 글쓰기 모드로 설정
                    setIsWriteModalOpen(true);
                }}>글쓰기</button>
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

            <Modal isOpen={isWriteModalOpen} onClose={closeFormModal}>
                <AnnouncementForm
                    onSubmit={handleFormSubmit}
                    initialData={editingAnnouncement ? { title: editingAnnouncement.title, content: editingAnnouncement.content } : undefined}
                />
            </Modal>

            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
                {selectedAnnouncement && (
                    <AnnouncementDetail
                        announcement={selectedAnnouncement}
                        onEdit={handleEditClick}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Announcements;