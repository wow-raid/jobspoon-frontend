import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import { StudyRoom } from "../types/study";
import { FAKE_STUDY_ROOMS } from "../data/mockData";
import JoinedStudyRoomList from "../components/JoinedStudyRoomList";
import FilterBar, { FilterValues } from "../components/FilterBar";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fg};
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const EmptyBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.border};

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.muted};
    margin: 0;
  }
`;

const MY_STUDY_IDS = [2, 5, 8, 10, 16, 19];

const MyStudiesPage: React.FC = () => {
  const [myStudies, setMyStudies] = useState<StudyRoom[]>([]);

  const [filters, setFilters] = useState<FilterValues>({
    searchTerm: '',
    location: '전체',
    job: '전체',
    showRecruitingOnly: false,
  });

  useEffect(() => {
    const joinedStudies = FAKE_STUDY_ROOMS.filter((room) =>
      MY_STUDY_IDS.includes(room.id)
    );
    setMyStudies(joinedStudies);
  }, []);

  const filteredStudies = useMemo(() => {
    let studiesToFilter = myStudies;
    // 검색어 필터
    if (filters.searchTerm) {
      studiesToFilter = studiesToFilter.filter(room =>
          room.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    // 지역 필터
    if (filters.location !== '전체') {
      studiesToFilter = studiesToFilter.filter(room => room.location === filters.location);
    }
    // 직무 필터
    if (filters.job !== '전체') {
      studiesToFilter = studiesToFilter.filter(room => room.recruitingRoles.includes(filters.job));
    }

    return studiesToFilter;
  }, [myStudies, filters]); // myStudies 또는 filters 값이 변경될 때만 다시 계산

  return (
      <Page>
        <Title>참여중인 면접스터디 목록</Title>

        {/* 👇 4. FilterBar 컴포넌트 추가 */}
        <FilterBar
            onFilterChange={setFilters}
            showRecruitingFilter={false} // '모집 중' 필터는 이 페이지에선 불필요하므로 숨김
        />

        {/* 👇 5. myStudies 대신 filteredStudies를 사용하도록 수정 */}
        {filteredStudies.length > 0 ? (
            <ListContainer>
              {filteredStudies.map((room) => (
                  <JoinedStudyRoomList key={room.id} room={room} />
              ))}
            </ListContainer>
        ) : (
            <EmptyBox>
              <p>참여 중인 면접스터디 모임이 없습니다.</p>
            </EmptyBox>
        )}
      </Page>
  );
};

export default MyStudiesPage;
