import React from 'react';
import { Announcement } from '../../data/mockData';
import '../../styles/AnnouncementDetail.css';

interface CurrentUser {
    role: 'leader' | 'member';
    id: string;
}

interface AnnouncementDetailProps {
    announcement: Announcement;
    onEdit: () => void;     // 수정 버튼 클릭 핸들러
    onDelete: () => void;   // 삭제 버튼 클릭 핸들러
    currentUser: CurrentUser; // 👇 현재 유저 정보 prop 추가
    onMarkAsRead: () => void; // 👇 읽음 확인 핸들러 prop 추가
}

const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({ announcement, onEdit, onDelete, currentUser, onMarkAsRead }) => {
    const hasRead = announcement.readBy?.includes(currentUser.id);

    return (
        <div className="announcement-detail-container">
            <div className="detail-header">
                <h2>{announcement.pinned && '📌 '} {announcement.title}</h2>
                <div className="detail-meta">
                    <span>작성자: {announcement.author}</span>
                    <span>작성일: {new Date(announcement.createdAt).toLocaleString()}</span>
                </div>
            </div>
            <div className="detail-content">
                <p>{announcement.content}</p>
            </div>

            <div className="detail-actions">
                {currentUser.role === 'leader' ? (
                    // 모임장: 수정/삭제 버튼
                    <>
                        <button className="edit-btn" onClick={onEdit}>수정</button>
                        <button className="delete-btn" onClick={onDelete}>삭제</button>
                    </>
                ) : (
                    // 참가자: 읽음 확인 체크박스
                    <label className="read-checkbox-label">
                        <input
                            type="checkbox"
                            checked={hasRead}
                            onChange={onMarkAsRead}
                            disabled={hasRead} // 이미 읽었다면 비활성화
                        />
                        {hasRead ? '✔ 확인했습니다.' : '내용을 확인했습니다.'}
                    </label>
                )}
            </div>

            {/* 👇 모임장에게만 읽은 사람 목록 표시 */}
            {currentUser.role === 'leader' && (
                <div className="read-by-list">
                    <h4>읽은 사람 ({announcement.readBy?.length || 0}명)</h4>
                    {announcement.readBy && announcement.readBy.length > 0 ? (
                        <ul>
                            {announcement.readBy.map(user => <li key={user}>{user}</li>)}
                        </ul>
                    ) : (
                        <p>아직 읽은 사람이 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnnouncementDetail;