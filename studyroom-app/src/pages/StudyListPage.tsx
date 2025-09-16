// studyroom-app/src/pages/StudyListPage.tsx
import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import StudyRoomCard from '../components/StudyRoomCard';
import Modal from '../components/Modal';
import CreateStudyForm from '../components/CreateStudyForm';
import FilterBar, { FilterValues } from '../components/FilterBar';
import { StudyRoom } from "../types/study";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const PageTop = styled.div`
  text-align: center;
  padding: 20px 0 40px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 32px;
`;

const PageMainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.subtle};
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
  }

  h2 span {
    font-size: 20px;
    color: ${({ theme }) => theme.subtle};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const NavBtnSecondary = styled(Link)`
  background-color: #3A3F4B;
  &&, &&:link, &&:visited, &&:hover, &&:active {
    color: #fff;
  }
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s, border-color .2s;

  &:hover {
    background-color: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const CreateStudyBtn = styled.button`
  background-color: #01B0F1;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover { background-color: ${({ theme }) => theme.primaryHover}; }
`;

const StudyListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
`;

const StudyListPage: React.FC = () => {
    const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);
    const [filters, setFilters] = useState<FilterValues>({
        searchTerm: '',
        location: '전체',
        job: '전체',
        showRecruitingOnly: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudyRooms = async () => {
            try {
                const response = await axiosInstance.get('/study-rooms', { params: { size: 20 } });
                setStudyRooms(response.data.studyRoomList);
            } catch (error) {
                console.error("스터디모임 목록을 불러오는 데 실패했습니다:", error);
            }
        };
        fetchStudyRooms();
    }, []);

    const filteredRooms = useMemo(() => {
        let rooms = studyRooms;
        if (filters.showRecruitingOnly) {
            rooms = rooms.filter((room) => room.status === 'RECRUITING');
        }
        if (filters.location !== '전체') {
            rooms = rooms.filter((room) => room.location === filters.location);
        }
        if (filters.job !== '전체') {
            rooms = rooms.filter((room) => room.recruitingRoles.includes(filters.job));
        }
        if (filters.searchTerm) {
            const q = filters.searchTerm.toLowerCase();
            rooms = rooms.filter((room) => room.title.toLowerCase().includes(q));
        }
        return rooms;
    }, [filters, studyRooms]);

    const handleLoginRedirect = () => {
        alert('로그인 후 이용할 수 있습니다.');
        window.location.href = 'http://localhost/vue-account/account/login';
    };

    const handleCreateSuccess = (newStudy: StudyRoom) => {
        if (!newStudy || !newStudy.id) {
            console.warn("생성된 스터디 데이터가 유효하지 않습니다:", newStudy);
            return;
        }
        setStudyRooms(prev => [newStudy, ...prev]);
        setIsModalOpen(false);
        alert('스터디 모임이 성공적으로 생성되었습니다.');
    };

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
                    {isLoggedIn ? (
                        <>
                            <NavBtnSecondary to="my-studies">나의 스터디</NavBtnSecondary>
                            <NavBtnSecondary to="my-applications">신청 내역</NavBtnSecondary>
                            <CreateStudyBtn onClick={() => setIsModalOpen(true)}>스터디 생성</CreateStudyBtn>
                        </>
                    ) : (
                        <>
                            <NavBtnSecondary to="#" onClick={handleLoginRedirect}>나의 스터디</NavBtnSecondary>
                            <NavBtnSecondary to="#" onClick={handleLoginRedirect}>신청 내역</NavBtnSecondary>
                            <CreateStudyBtn onClick={handleLoginRedirect}>스터디 생성</CreateStudyBtn>
                        </>
                    )}
                </HeaderActions>
            </ListHeader>

            <FilterBar onFilterChange={setFilters} />

            <StudyListContainer>
                {filteredRooms.map((room) => (
                    <StudyRoomCard
                        key={room.id}
                        room={room}
                        isLoggedIn={isLoggedIn}
                        onCardClick={isLoggedIn ? undefined : handleLoginRedirect}
                    />
                ))}
            </StudyListContainer>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateStudyForm onSuccess={handleCreateSuccess} />
            </Modal>
        </div>
    );
};

export default StudyListPage;
