import React from 'react';
import { Link } from 'react-router-dom';
import { StudyRoom } from '../types/study';
import '../styles/StudyRoomCard.css';

interface StudyRoomCardProps {
    room: StudyRoom;
}

const StudyRoomCard: React.FC<StudyRoomCardProps> = ({ room }) => {
    const isClosed = room.status === 'closed';
    const cardClassName = `card ${isClosed ? 'card-closed' : ''}`;
    const wrapperClassName = `card-wrapper ${isClosed ? 'disabled' : 'enabled'}`;

    const content = (
        <div className={cardClassName}>
            <div className="card-top">
                <span className={`status-badge ${room.status}`}>
                    {isClosed ? '모집완료' : '모집중'}
                </span>
                <span className="location-info">{room.location}</span>
            </div>

            <div className="card-body">
                <p className="job-category">{room.job}</p>
                <h3 className="title">{room.title}</h3>
                <p className="host-info">by {room.host}</p>
            </div>

            <div className="card-footer">
                <div className="tags">
                    {room.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag-item">{tag}</span>
                    ))}
                </div>
                <div className="posted-at">
                    {isClosed ? '종료됨' : room.postedAt}
                </div>
            </div>
        </div>
    );

    if (isClosed) {
        return <div className={wrapperClassName}>{content}</div>;
    }

    return (
        <Link to={`/study/${room.id}`} className={wrapperClassName}>
            {content}
        </Link>
    );
};

export default StudyRoomCard;