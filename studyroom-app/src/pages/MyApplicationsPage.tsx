// MyApplicationsPage.tsx
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
  color: #fff;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const FilterTag = styled.button<{ $active?: boolean }>`
  background-color: ${({ $active }) => ($active ? "#5865f2" : "#3a3f4c")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#e0e0e0")};
  border: 1px solid ${({ $active }) => ($active ? "#5865f2" : "#3a3f4c")};
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#5865f2" : "#4b5563")};
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
  background-color: #2c2f3b;
  border-radius: 8px;
  border: 1px dashed #4a4e59;

  p {
    font-size: 36px;
    color: #8c92a7;
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
