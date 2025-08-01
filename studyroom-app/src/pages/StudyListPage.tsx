import React, { useState, useMemo } from 'react';
import { StudyRoom } from '../types/study';
import { FAKE_STUDY_ROOMS } from '../data/mockData';
import StudyRoomCard from '../components/StudyRoomCard';
import FilterBar, { FilterValues } from '../components/FilterBar';
import '../styles/StudyListPage.css';

const StudyListPage: React.FC = () => {
    const [filters, setFilters] = useState<FilterValues>({
        searchTerm: '',
        location: '전체',
        job: '전체',
        showRecruitingOnly: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredRooms = useMemo(() => {
        let rooms = FAKE_STUDY_ROOMS;
        if (filters.showRecruitingOnly) {
            rooms = rooms.filter(room => room.status === 'recruiting');
        }
        if (filters.location !== '전체') {
            rooms = rooms.filter(room => room.location === filters.location);
        }
        if (filters.job !== '전체') {
            rooms = rooms.filter(room => room.job === filters.job);
        }
        if (filters.searchTerm) {
            rooms = rooms.filter(room => room.title.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        }
        return rooms;
    }, [filters]);

    return (
        <div className="study-list-page">
            <div className="page-top">
                <h1 className="page-main-title">면접스터디 찾기</h1>
                <p className="page-subtitle">지금 바로 나에게 맞는 스터디를 찾아보세요!</p>
            </div>
            <div className="list-page-header">
                <h2>모든 스터디 <span>({filteredRooms.length})</span></h2>
                <button className="create-study-btn" onClick={() => setIsModalOpen(true)}>
                    스터디 생성
                </button>
            </div>

            <FilterBar onFilterChange={setFilters} />

            <div className="study-list-container">
                {filteredRooms.map((room) => (
                    <StudyRoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
};

export default StudyListPage;