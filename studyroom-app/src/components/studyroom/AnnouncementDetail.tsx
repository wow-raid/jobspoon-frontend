import React from 'react';
import { Announcement } from '../../data/mockData';
import '../../styles/AnnouncementDetail.css';

interface AnnouncementDetailProps {
    announcement: Announcement;
    onEdit: () => void;     // 수정 버튼 클릭 핸들러
}

const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({ announcement, onEdit }) => {
    return (
        <div className="announcement-detail-container">
            <header className="detail-header">
                <h2 className="detail-title">{announcement.title}</h2>
                <p className="detail-meta">{announcement.author} · {announcement.createdAt}</p>
            </header>
            <div className="detail-content">
                <p>{announcement.content}</p>
            </div>
            <div className="detail-actions">
                <button className="edit-btn" onClick={onEdit}> 수정 </button>
            </div>
        </div>
    );
};

export default AnnouncementDetail;