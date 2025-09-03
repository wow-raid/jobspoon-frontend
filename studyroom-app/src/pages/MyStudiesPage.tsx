import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import { StudyRoom } from "../types/study";
import { FAKE_STUDY_ROOMS } from "../data/mockData";
import JoinedStudyRoomList from "../components/JoinedStudyRoomList";
import FilterBar, { FilterValues } from "../components/FilterBar";
import axiosInstance from "../api/axiosInstance";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterValues>({
    searchTerm: '',
    location: '전체',
    job: '전체',
    showRecruitingOnly: false,
  });

  useEffect(() => {
    const fetchMyStudies = async () => {
      try {
        setLoading(true);
        // GET /api/my-studies 로 API 요청
        const response = await axiosInstance.get<StudyRoom[]>('/study-rooms/my-studies');
        setMyStudies(response.data);
      } catch (err) {
        console.error("참여 중인 스터디 목록을 불러오는 데 실패했습니다:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyStudies();
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

  if (loading) {
    return <Page><p>로딩 중...</p></Page>;
  }
  if (error) {
    return <Page><p>{error}</p></Page>;
  }

  return (
      <Page>
        <Title>참여중인 면접스터디 목록</Title>
        <FilterBar
            onFilterChange={setFilters}
            showRecruitingFilter={false}
        />
        {filteredStudies.length > 0 ? (
            <ListContainer>
              {/* 👇 이 부분을 수정합니다. */}
              {filteredStudies.map((room) => {
                try {
                  // 정상적으로 렌더링을 시도합니다.
                  return <JoinedStudyRoomList key={room.id} room={room} />;
                } catch (e) {
                  // 만약 JoinedStudyRoomList 컴포넌트가 렌더링되다 에러가 나면 여기서 잡습니다.
                  console.error("카드 렌더링 중 에러 발생:", {
                    error: e,
                    roomData: room // 어떤 데이터에서 에러가 났는지 확인
                  });
                  // 에러가 난 카드는 대체 UI를 보여줍니다.
                  return <div key={room.id}>이 항목을 표시하는 중 오류가 발생했습니다.</div>;
                }
              })}
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
