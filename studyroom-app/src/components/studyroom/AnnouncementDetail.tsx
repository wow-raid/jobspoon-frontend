import React from 'react';
import { Announcement } from '../../data/mockData';
import '../../styles/AnnouncementDetail.css';

interface AnnouncementDetailProps {
    announcement: Announcement;
}

const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({ announcement }) => {
    return (
        <div className="announcement-detail-container">
            <header className="detail-header">
                <h2 className="detail-title">{announcement.title}</h2>
                <p className="detail-meta">{announcement.author} · {announcement.createdAt}</p>
            </header>
            <div className="detail-content">
                <p>{announcement.content}</p>
            </div>
        </div>
    );
};

export default AnnouncementDetail;