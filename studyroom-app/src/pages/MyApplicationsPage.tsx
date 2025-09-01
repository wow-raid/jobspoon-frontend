import React, { useMemo, useState } from "react";
import styled from "styled-components";
import ApplicationCard from "../components/ApplicationCard";
import { MY_APPLICATIONS } from "../data/mockData";

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

const FilterBar = styled.div`
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
    const [filter, setFilter] = useState<ApplicationStatus>("all");

    const handleCancel = (id: number) => {
        if (window.confirm("정말로 신청을 취소하시겠습니까?")) {
            setApplications((prev) => prev.filter((app) => app.id !== id));
        }
    };

    const filteredApplications = useMemo(() => {
        if (filter === "all") return applications;
        return applications.filter((app) => app.status === filter);
    }, [applications, filter]);

    const filterTags: { key: ApplicationStatus; text: string }[] = [
        { key: "all", text: "전체" },
        { key: "pending", text: "대기중" },
        { key: "approved", text: "수락됨" },
        { key: "rejected", text: "거절됨" },
    ];

    return (
        <Container>
            <Title>내 스터디 신청 내역</Title>

            <FilterBar>
                {filterTags.map((tag) => (
                    <FilterTag
                        key={tag.key}
                        $active={filter === tag.key}
                        onClick={() => setFilter(tag.key)}
                        aria-pressed={filter === tag.key}
                    >
                        {tag.text}
                    </FilterTag>
                ))}
            </FilterBar>

            {applications.length > 0 ? (
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
                    <p>신청한 면접스터디 모임이 없습니다.</p>
                </EmptyBox>
            )}
        </Container>
    );
};

export default MyApplicationsPage;
