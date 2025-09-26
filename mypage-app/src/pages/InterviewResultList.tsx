{/* 인터뷰 목록 보기 */}

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ServiceModal from "../components/modals/ServiceModal";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type InterviewItem = {
    id: number;
    topic: string;
    yearsOfExperience: number;
    created_at: Date;
    status: "IN_PROGRESS" | "COMPLETED";
};

export default function InterviewResultList() {
    const [interviews, setInterviews] = useState<InterviewItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ 목데이터 적용
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            console.error("로그인이 필요합니다.");
            return;
        }

        const mockInterviews: InterviewItem[] = [
            {
                id: 1,
                topic: "Spring Boot 기술 면접",
                yearsOfExperience: 2,
                created_at: new Date("2025-09-01"),
                status: "COMPLETED",
            },
            {
                id: 2,
                topic: "React 프로젝트 경험",
                yearsOfExperience: 1,
                created_at: new Date("2025-09-05"),
                status: "IN_PROGRESS",
            },
            {
                id: 3,
                topic: "MySQL 성능 최적화",
                yearsOfExperience: 3,
                created_at: new Date("2025-09-10"),
                status: "COMPLETED",
            },
        ];

        setInterviews(mockInterviews);
    }, []);

    // 도넛 차트용 데이터 계산
    const completedCount = interviews.filter((i) => i.status === "COMPLETED").length;
    const inProgressCount = interviews.filter((i) => i.status === "IN_PROGRESS").length;

    const chartData = [
        { name: "완료", value: completedCount },
        { name: "진행 중", value: inProgressCount },
    ];

    const COLORS = ["#10B981", "#F59E0B"]; // 완료=초록, 진행중=노랑

    // 검색/필터/정렬용
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "COMPLETED" | "IN_PROGRESS">("all");
    const [sortOption, setSortOption] = useState<"latest" | "oldest" | "status">("latest");

    const displayedInterviews = interviews
        .filter((i) =>
            filterStatus === "all" || i.status === filterStatus
        )
        .filter((i) =>
            i.topic.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOption === "latest") return b.created_at.getTime() - a.created_at.getTime();
            if (sortOption === "oldest") return a.created_at.getTime() - b.created_at.getTime();
            if (sortOption === "status") return a.status.localeCompare(b.status);
            return 0;
        });

    return (
        <Section>
            <NoticeBanner>🚧 서비스 준비 중입니다</NoticeBanner>

            <Title>면접 기록 보관함</Title>

            {/* 도넛 차트 */}
            <ChartBox>
                <ChartTitle>상태별 분포</ChartTitle>
                <Desc>📊 완료/진행 중 비율을 한눈에 확인할 수 있습니다.</Desc>

                <ChartRow>
                    {/* 도넛 차트 */}
                    <ChartWrapper>
                        <ResponsiveContainer width={240} height={240}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value">
                                    {chartData.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* 중앙 텍스트 */}
                        <CenterText>
                            <CenterNumber>{completedCount + inProgressCount}</CenterNumber>
                            <CenterLabel>총 건수</CenterLabel>
                        </CenterText>
                    </ChartWrapper>

                    {/* 범례는 오른쪽 */}
                    <Legend>
                        <LegendItem>
                            <ColorDot color={COLORS[0]} />
                            완료 {completedCount}건
                        </LegendItem>
                        <LegendItem>
                            <ColorDot color={COLORS[1]} />
                            진행 중 {inProgressCount}건
                        </LegendItem>
                    </Legend>
                </ChartRow>
            </ChartBox>

            {/* 목록 헤더 */}
            <ListHeader>
                <SearchInput
                    type="text"
                    placeholder="주제 검색..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                    value={filterStatus}
                    onChange={(e) =>
                            setFilterStatus(e.target.value as "IN_PROGRESS" | "COMPLETED" | "all")}>
                    <option value="all">전체</option>
                    <option value="COMPLETED">완료</option>
                    <option value="IN_PROGRESS">진행 중</option>
                </Select>
                <Select
                    value={sortOption}
                    onChange={(e) =>
                        setSortOption(e.target.value as "latest" | "oldest" | "status")}>
                    <option value="latest">최신순</option>
                    <option value="oldest">오래된순</option>
                    <option value="status">상태별</option>
                </Select>
            </ListHeader>

            <List>
                {displayedInterviews.map((item, index) => (
                    <Card key={item.id}>
                        <Info>
                            <IndexCircle>{index + 1}</IndexCircle>
                            <DateText>{item.created_at.toLocaleDateString()}</DateText>
                            <Topic>{item.topic}</Topic>
                        </Info>
                        <DetailSection>
                            <StatusBadge status={item.status}>
                                {item.status === "COMPLETED" ? "완료" : "진행 중"}
                            </StatusBadge>
                            <DetailButton onClick={() => setIsModalOpen(true)}>
                                상세보기
                            </DetailButton>
                            {/*<DetailLink to={`/mypage/interview/history/${item.id}`}>*/}
                            {/*    상세보기*/}
                            {/*</DetailLink>*/}
                        </DetailSection>
                    </Card>
                ))}
            </List>

            {isModalOpen && (
                <ServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

        </Section>
    );
}

/* ================== styled-components ================== */
const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const ChartBox = styled.div`
    background: #f9fafb;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center; /* ✅ 타이틀/설명은 가운데 */
    gap: 12px;
    text-align: center;
`;

const ChartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* ✅ 도넛을 중앙 기준으로 */
  gap: 32px; /* 도넛과 범례 간격 */
`;

const ChartWrapper = styled.div`
    position: relative;
    width: 240px;
    height: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CenterText = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 1.2;
`;

const CenterNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

const CenterLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
`;

const ChartTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;  /* 제목과 설명 간격 최소화 */
`;

const Desc = styled.p`
    font-size: 14px;
    color: #6b7280;
    text-align: center;
    margin-top: 0;  /* 불필요한 간격 제거 */
`;

const Legend = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* ✅ 오른쪽에서 세로 정렬 */
    gap: 12px;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #374151;
`;

const ColorDot = styled.span<{ color: string }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Card = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Info = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const DateText = styled.span`
    font-size: 14px;
    color: #6b7280;
`;

const Topic = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #111827;
`;

const DetailButton = styled.button`
    font-size: 14px;
    font-weight: 500;
    color: rgb(37, 99, 235);
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const IndexCircle = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #93C5FD; /* 연한 하늘색 */
    color: #1E3A8A; /* 남색 글씨 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
`;

const DetailSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ status }) =>
    status === "COMPLETED" ? "#065f46" : "#92400e"};
  background-color: ${({ status }) =>
    status === "COMPLETED" ? "#d1fae5" : "#fef3c7"};
`;

const ListHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin: 8px 0 16px;
`;

const SearchInput = styled.input`
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #374151;
    width: 220px;
    background-color: #f9fafb;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        background-color: #fff;
    }

    &::placeholder {
        color: #9ca3af;
    }
`;

const Select = styled.select`
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #374151;
    background: #f9fafb;
    cursor: pointer;
    appearance: none; /* 기본 화살표 제거 */
    background-image: url("data:image/svg+xml;utf8,<svg fill='%236b7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;

    &:hover {
        border-color: #9ca3af;
    }

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        background-color: #fff;
    }
`;

const NoticeBanner = styled.div`
  background: #fef3c7; /* 연한 노랑 */
  color: #92400e;      /* 진한 주황/갈색 */
  font-size: 18px;     /* 글자 크게 */
  font-weight: 700;
  text-align: center;
  padding: 20px 12px;  /* 상하 넓게 */
  border-radius: 8px;
  margin: 24px 0;      /* 위아래 간격 */
`;
