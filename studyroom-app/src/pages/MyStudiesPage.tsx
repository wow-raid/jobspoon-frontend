import React, { useState, useEffect } from 'react';
import { StudyRoom } from '../types/study';
import { FAKE_STUDY_ROOMS } from '../data/mockData';
import JoinedStudyRoomList from '../components/JoinedStudyRoomList.tsx';
import '../styles/MyStudiesPage.css';

const MY_STUDY_IDS = [2, 5, 8, 10, 16, 19];

const MyStudiesPage: React.FC = () => {
    const [myStudies, setMyStudies] = useState<StudyRoom[]>([]);

    useEffect(() => {
        const joinedStudies = FAKE_STUDY_ROOMS.filter(room =>
            MY_STUDY_IDS.includes(room.id)
        );
        setMyStudies(joinedStudies);
    }, []);

    return (
        <div className="my-studies-page">
            <h1 className="page-title">참여중인 면접스터디 목록</h1>

            {myStudies.length > 0 ? (
                <div className="studies-list-container">
                    {myStudies.map(room => (
                        <JoinedStudyRoomList
                            key={room.id}
                            room={room}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-message-container">
                    <p>참여 중인 면접스터디 모임이 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default MyStudiesPage;