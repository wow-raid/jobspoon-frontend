import React, { useState } from 'react';
import { FAKE_ANNOUNCEMENTS, Announcement } from '../../data/mockData';
import '../../styles/Announcements.css';
import Modal from "../Modal";
import AnnouncementForm from './AnnouncementForm';

const Announcements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(FAKE_ANNOUNCEMENTS);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddAnnouncement = (formData: { title: string; content: string }) => {
        const newAnnouncement: Announcement = {
            id: Date.now(),
            author: '모임장',
            createdAt: '방금 전',
            ...formData,
        };

        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsModalOpen(false);

    }

    return (
        <div className="announcements-container">
            <div className="announcements-header">
                <h2> 📢 공지사항 </h2>
                <button className="write-btn" onClick={() => setIsModalOpen(true)}> 글쓰기 </button>
            </div>
            <div className="announcements-list">
                {announcements.map(item => (
                    <div key={item.id} className="announcement-item">
                        <div className="item-header">
                            <span className="item-title"> {item.title} </span>
                            <span className="item-meta"> {item.author} ㆍ {item.createdAt}</span>
                        </div>
                        <p className="item-content"> {item.content} </p>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AnnouncementForm onSubmit={handleAddAnnouncement} />
            </Modal>
        </div>
    );
};

export default Announcements;