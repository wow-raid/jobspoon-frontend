import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import ApplicationCard from "../components/ApplicationCard";
import FilterBar, { FilterValues } from "../components/FilterBar";
import { Application, ApplicationStatus } from "../types/study";
import axiosInstance from "../api/axiosInstance";

type StatusFilter = ApplicationStatus | 'all';

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fg};
`;

const FilterBarContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
`;

const FilterTag = styled.button<{ $active?: boolean }>`
  background-color: ${({ theme, $active }) =>
        $active ? theme.primary : theme.surfaceAlt};
  color: ${({ theme, $active }) => ($active ? "#ffffff" : theme.muted)};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme, $active }) =>
        $active ? theme.primaryHover : theme.surfaceHover};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
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
    font-size: 36px;
    color: ${({ theme }) => theme.muted};
    margin: 0;
  }
`;
const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.fg};

  span {
    color: ${({ theme }) => theme.primary};
  }
`;

/* ─ Component ─ */
const MyApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [searchFilters, setSearchFilters] = useState<FilterValues>({
        searchTerm: '',
        location: '전체',
        job: '전체',
        showRecruitingOnly: false,
    });

    useEffect(() => {
        const fetchMyApplications = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/study-applications/my');
                setApplications(response.data);
            } catch (error) {
                console.error("내 신청 내역을 불러오는데 실패했습니다.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyApplications();
    }, []);

    const handleCancel = async (id: number) => {
        if (window.confirm("정말로 신청을 취소하시겠습니까?")) {
            try {
                // ✅ 백엔드에 삭제 요청 API 호출
                await axiosInstance.delete(`/study-applications/${id}`);

                // ✅ API 호출이 성공하면 화면에서도 해당 내역 제거
                setApplications((prev) => prev.filter((app) => app.id !== id));
                alert("신청이 성공적으로 취소되었습니다.");

            } catch (error) {
                console.error("신청 취소에 실패했습니다:", error);
                alert("신청 취소 중 오류가 발생했습니다.");
            }
        }
    };

    const filteredApplications = useMemo(() => {
        let filtered = applications;

        if (statusFilter !== "all") {
            filtered = filtered.filter((app) => app.status === statusFilter);
        }

        if (searchFilters.searchTerm) {
            const query = searchFilters.searchTerm.toLowerCase();
            filtered = filtered.filter((app) =>
                app.study.title.toLowerCase().includes(query)
            );
        }

        if (searchFilters.location !== '전체') {
            filtered = filtered.filter((app) => app.study.location === searchFilters.location);
        }

        if (searchFilters.job !== '전체') {
            filtered = filtered.filter((app) => app.study.recruitingRoles.includes(searchFilters.job));
        }
        return filtered;
    }, [applications, statusFilter, searchFilters]);

    const filterTags: { key: StatusFilter; text: string }[] = [
        { key: "all", text: "전체" },
        { key: "PENDING", text: "대기중" },
        { key: "APPROVED", text: "수락됨" },
        { key: "REJECTED", text: "거절됨" },
    ];

    // ✅ 로딩 상태 UI 추가
    if (loading) {
        return <Container><p>로딩 중...</p></Container>;
    }
    return (

        <Container>
            <Title>내 스터디 신청 내역</Title>
            <FilterBarContainer>
                {filterTags.map((tag) => (
                    <FilterTag
                        key={tag.key}
                        $active={statusFilter === tag.key}
                        onClick={() => setStatusFilter(tag.key)}
                        aria-pressed={statusFilter === tag.key}
                    >
                        {tag.text}
                    </FilterTag>
                ))}
            </FilterBarContainer>
            <SectionTitle>
                모든 신청 내역 <span>({filteredApplications.length})</span>
            </SectionTitle>
            <FilterBar
                onFilterChange={setSearchFilters}
                searchPlaceholder="신청한 스터디 제목으로 검색"
                showRecruitingFilter={false} // '모집 중' 필터는 이 페이지에선 불필요하므로 숨김
            />

            {filteredApplications.length > 0 ? (
                <Grid>
                    {filteredApplications.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onCancel={handleCancel}
                        />
                    ))}
                </Grid>
            ) : (
                <EmptyBox>
                    <p>면접스터디 모임에 신청한 내역이 없습니다.</p>
                </EmptyBox>
            )}
        </Container>
    );
};

export default MyApplicationsPage;
