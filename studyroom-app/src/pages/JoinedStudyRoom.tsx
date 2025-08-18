import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams} from 'react-router-dom';
import { StudyRoom } from '../types/study';
import { FAKE_STUDY_ROOMS } from '../data/mockData';
import '../styles/JoinedStudyRoom.css';

const JoinedStudyRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [study, setStudy] = useState<StudyRoom | undefined>(undefined);

    useEffect(() => {
        const foundStudy = FAKE_STUDY_ROOMS.find(room => String(room.id) === id);
        setStudy(foundStudy);
    }, [id]);

    if (!study) {
        return <div>스터디 정보를 불러오는 중...</div>;
    }

    return (
        <div className="study-room-container">
            <header className="room-header">
                <h2>{study.title}</h2>
                <p>
                    모임장: {study.host} | 인원 {study.currentMembers}/{study.maxMembers} | 진행방식: {study.location}
                </p>
            </header>

            <main className="room-main-content">
                <nav className="room-sidebar">
                    <NavLink to="" end className={({ isActive }) => isActive ? 'active' : ''}> 공지사항 </NavLink>
                    <NavLink to="schedule" end className={({ isActive }) => isActive ? 'active' : ''}> 일정관리 </NavLink>
                    <NavLink to="interview" end className={({ isActive }) => isActive ? 'active' : ''}> 모의면접 </NavLink>
                </nav>

                <section className="room-content-area">
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default JoinedStudyRoom;