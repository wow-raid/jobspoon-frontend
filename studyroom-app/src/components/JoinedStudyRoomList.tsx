import React from 'react';
import { Link } from 'react-router-dom';
import { StudyRoom } from '../types/study';
import '../styles/JoinedStudyRoomList.css';

interface JoinedStudyRoomListProps {
    room: StudyRoom;
}

const JoinedStudyRoomList: React.FC<JoinedStudyRoomListProps> = ({ room }) => {
    return (
        <div className="joined-study-room-list">
            <div className="item-main-content">
                <h3 className="study-title">{room.title}</h3>
                <div className="study-details">
                    <p><strong>지역:</strong> {room.location}</p>
                    <p><strong>최대인원:</strong> {room.currentMembers} / {room.maxMembers} 명</p>
                    <p><strong>모집직무:</strong> {room.job}</p>
                    <p><strong>기술스택:</strong> {room.tags.join(', ')}</p>
                </div>
            </div>
            <div className="item-actions">
                <Link to={`/joined-study/${room.id}`} className="go-to-study-btn">
                    면접스터디룸 바로가기
                </Link>
            </div>
        </div>
    );
};

export default JoinedStudyRoomList;