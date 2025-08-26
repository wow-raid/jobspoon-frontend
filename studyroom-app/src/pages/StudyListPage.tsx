// StudyListPage.tsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FAKE_STUDY_ROOMS } from '../data/mockData';
import StudyRoomCard from '../components/StudyRoomCard';
import Modal from '../components/Modal';
import CreateStudyForm from '../components/CreateStudyForm';
import FilterBar, { FilterValues } from '../components/FilterBar';
import {StudyRoom} from "../types/study";

const PageTop = styled.div`
  text-align: center;
  padding: 20px 0 40px 0;
  border-bottom: 1px solid #3e414f;
  margin-bottom: 32px;
`;

const PageMainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #fff;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  margin: 0;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #fff;
  }

  h2 span {
    font-size: 20px;
    color: #a0a0a0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const NavBtnSecondary = styled(Link)`
  background-color: #3a3f4c;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4b5563;
  }
`;

const CreateStudyBtn = styled.button`
  background-color: #5865f2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const StudyListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
`;

const StudyListPage: React.FC = () => {
    const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(FAKE_STUDY_ROOMS)
    const [filters, setFilters] = useState<FilterValues>({
        searchTerm: '',
        location: '전체',
        job: '전체',
        showRecruitingOnly: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredRooms = useMemo(() => {
        let rooms = studyRooms;
        if (filters.showRecruitingOnly) {
            rooms = rooms.filter((room) => room.status === 'recruiting');
        }
        if (filters.location !== '전체') {
            rooms = rooms.filter((room) => room.location === filters.location);
        }
        if (filters.job !== '전체') {
            rooms = rooms.filter((room) => room.job === filters.job);
        }
        if (filters.searchTerm) {
            const q = filters.searchTerm.toLowerCase();
            rooms = rooms.filter((room) => room.title.toLowerCase().includes(q));
        }
        return rooms;
    }, [filters, studyRooms]);

    const handleCreateSuccess = (newStudy: StudyRoom) => {
        setStudyRooms(prevRooms => [newStudy, ...prevRooms]);
        setIsModalOpen(false);
        alert('스터디 모임이 성공적으로 생성되었습니다.')
    }

    return (
        <div>
            <PageTop>
                <PageMainTitle>면접스터디 찾기</PageMainTitle>
                <PageSubtitle>지금 바로 나에게 맞는 스터디를 찾아보세요!</PageSubtitle>
            </PageTop>

            <ListHeader>
                <h2>
                    모든 스터디 <span>({filteredRooms.length})</span>
                </h2>
                <HeaderActions>
                    <NavBtnSecondary to="my-studies">나의 스터디</NavBtnSecondary>
                    <NavBtnSecondary to="my-applications">신청 내역</NavBtnSecondary>
                    <CreateStudyBtn onClick={() => setIsModalOpen(true)}>스터디 생성</CreateStudyBtn>
                </HeaderActions>
            </ListHeader>

            <FilterBar onFilterChange={setFilters} />

            <StudyListContainer>
                {filteredRooms.map((room) => (
                    <StudyRoomCard key={room.id} room={room} />
                ))}
            </StudyListContainer>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateStudyForm onSuccess={handleCreateSuccess}/>
            </Modal>
        </div>
    );
};

export default StudyListPage;
