import React, { useState, useMemo } from 'react';
import { FAKE_ANNOUNCEMENTS, Announcement } from '../../data/mockData';
import '../../styles/Announcements.css';
import Modal from "../Modal";
import AnnouncementForm from './AnnouncementForm';
import AnnouncementDetail from "./AnnouncementDetail";

// 로그인 되었다는 가정하에 버튼 유무, 읽음 유무 테스트
const CURRENT_USER_ROLE = 'member';     // leader | member 로 화면별로 테스트 가능
const CURRENT_USER_ID = '모임장'         // 모임장, 참가자A, 참가자B 등 이건 아무렇게나 써도 상관없음

const Announcements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(FAKE_ANNOUNCEMENTS);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const currentUser = {
        role: CURRENT_USER_ROLE as 'leader' | 'member',
        id: CURRENT_USER_ID,
    };

// 👇 1. 폼 제출을 처리하는 함수 (새 글, 수정 모두 담당)
    const handleFormSubmit = (formData: { title: string; content: string }) => {
        if (editingAnnouncement) {
            setAnnouncements(prev => prev.map(item =>
                item.id === editingAnnouncement.id ? { ...item, ...formData } : item
            ));
        } else {
            const newAnnouncement: Announcement = {
                id: Date.now(),
                author: currentUser.id,
                createdAt: new Date(),
                pinned: false,
                readBy: [],
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

    const handleDelete = () => {
        if (!selectedAnnouncement) return;
        if (window.confirm("공지사항을 삭제하시겠습니까?")){
            setAnnouncements(prev =>
                prev.filter(item => item.id !== selectedAnnouncement.id)
            );
            setIsDetailModalOpen(false);
            setSelectedAnnouncement(null)
        }
    };

    const handleMarkAsRead = () => {
        if (!selectedAnnouncement) return;
        setAnnouncements(prev =>
            prev.map(item => {
                if(item.id === selectedAnnouncement.id && !item.readBy?.includes(currentUser.id)) {
                    const newReadBy = [...(item.readBy || []), currentUser.id];
                    setSelectedAnnouncement(prevSelected => prevSelected ? { ...prevSelected, readBy: newReadBy } : null);
                    return { ...item, readBy: newReadBy };
                }
                return item;
            })
        );
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
                {currentUser.role === 'leader' && (
                    <button className="write-btn" onClick={() => {
                        setEditingAnnouncement(null);
                        setIsWriteModalOpen(true);
                    }}>글쓰기</button>
                )}
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
                                <span className="item-meta">{item.author} · {item.createdAt.toLocaleDateString()}</span>
                            </div>
                        </div>
                        {currentUser.role === 'leader' && (
                            <button className="pin-button" onClick={(e) => {
                                e.stopPropagation();
                                handlePinToggle(item.id);
                            }}>
                                {item.pinned ? '고정 해제' : '상단 고정'}
                            </button>
                        )}
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
                        onDelete={handleDelete}
                        currentUser={currentUser} // 👇 현재 유저 정보 전달
                        onMarkAsRead={handleMarkAsRead} // 👇 읽음 처리 함수 전달
                    />
                )}
            </Modal>
        </div>
    );
};
export default Announcements;