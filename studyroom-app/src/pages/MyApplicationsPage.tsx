import React, { useMemo, useState } from "react";
import styled from "styled-components";
import ApplicationCard from "../components/ApplicationCard";
import { MY_APPLICATIONS } from "../data/mockData";
import FilterBar, { FilterValues } from "../components/FilterBar";

type ApplicationStatus = "all" | "pending" | "approved" | "rejected";

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  max-width: 800px;
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

/* ─ Component ─ */
const MyApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState(MY_APPLICATIONS);
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("all")
    const [searchFilters, setSearchFilters] = useState<FilterValues>({
        searchTerm: '',
        location: '전체',
        job: '전체',
        showRecruitingOnly: false,
    });

    const handleCancel = (id: number) => {
        if (window.confirm("정말로 신청을 취소하시겠습니까?")) {
            setApplications((prev) => prev.filter((app) => app.id !== id));
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

    const filterTags: { key: ApplicationStatus; text: string }[] = [
        { key: "all", text: "전체" },
        { key: "pending", text: "대기중" },
        { key: "approved", text: "수락됨" },
        { key: "rejected", text: "거절됨" },
    ];

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
                    <p>조건에 맞는 신청 내역이 없습니다.</p>
                </EmptyBox>
            )}
        </Container>
    );
};

export default MyApplicationsPage;
