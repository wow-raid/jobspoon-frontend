import React from 'react';
import { ScheduleEvent } from '../../data/mockData';
import '../../styles/EventDetail.css';

interface EventDetailProps {
    event: ScheduleEvent;
    currentUser: { id: string };
    onEdit: () => void;
    onDelete: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, currentUser, onEdit, onDelete }) => {
    const isOwner = currentUser.id === event.authorId;

    return (
        <div className="event-detail-container">
            <h3>{event.title}</h3>
            <p><strong>시간:</strong> {new Date(event.start).toLocaleString()} ~ {new Date(event.end).toLocaleString()}</p>
            {event.description && <p><strong>설명:</strong> {event.description}</p>}

            {/* 👇 본인이 작성한 글일 경우에만 수정/삭제 버튼 표시 */}
            {isOwner && (
                <div className="detail-actions">
                    <button className="edit-btn" onClick={onEdit}>수정</button>
                    <button className="delete-btn" onClick={onDelete}>삭제</button>
                </div>
            )}
        </div>
    );
};

export default EventDetail;