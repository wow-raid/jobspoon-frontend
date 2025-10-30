import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { fetchInterviewResultList } from "../api/InterviewApi.ts";
import { FaRobot, FaRegClock, FaSearch } from "react-icons/fa";
import Spinner from "../components/common/Spinner.tsx";
import { notifyError } from "../utils/toast.ts";
import { useNavigate } from "react-router-dom";

/* ---------- 타입 ---------- */
type InterviewSummary = {
    interviewId: number;
    interviewType: string;
    createdAt: string;
    sender: string;
    finished: boolean;
};

/* ---------- 팔레트 ---------- */
const palette = {
    primary: "#4CC4A8",
    accent: "#1B8C95",
    lightBG: "#F8FBF8",
    border: "rgba(76,196,168,0.35)",
    shadow: "rgba(76,196,168,0.22)",
    textMain: "#0F172A",
    textSub: "#64748B",
};

/* ---------- 애니메이션 ---------- */
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

/* ---------- 메인 ---------- */
export default function InterviewResultPage() {
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<InterviewSummary[]>([]);
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "progress">("all");
    const [sortOption, setSortOption] = useState<"latest" | "oldest" | "status">("latest");

    const navigate = useNavigate();

    /* ---------- 데이터 로드 ---------- */
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchInterviewResultList();
                if (!data || !Array.isArray(data.interviewResultList))
                    throw new Error("Invalid response");

                setList(data.interviewResultList);
            } catch (err) {
                console.error(err);
                notifyError("면접 결과 목록을 불러오지 못했습니다 ❗");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <Spinner />;

    /* ---------- 검색/필터/정렬 ---------- */
    const filteredList = list
        .filter((item) =>
            (item.interviewType ?? "").toLowerCase().includes(searchText.toLowerCase())
        )
        .filter((item) => {
            if (filterStatus === "completed") return item.finished;
            if (filterStatus === "progress") return !item.finished;
            return true;
        })
        .sort((a, b) => {
            if (sortOption === "latest")
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortOption === "oldest")
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortOption === "status") return Number(b.finished) - Number(a.finished);
            return 0;
        });

    /* ---------- 렌더링 ---------- */
    return (
        <Section>
            <SectionTitle>AI 면접 결과</SectionTitle>
            <SubText>최근 진행한 모의면접 결과를 확인할 수 있어요.</SubText>

            {/* 검색/필터/정렬 */}
            <FilterBar>
                <SearchBox>
                    <FaSearch color="#9ca3af" size={14} />
                    <SearchInput
                        type="text"
                        placeholder="면접 유형 검색..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </SearchBox>

                <Select
                    value={filterStatus}
                    onChange={(e) =>
                        setFilterStatus(e.target.value as "all" | "completed" | "progress")
                    }>
                    <option value="all">전체</option>
                    <option value="completed">완료</option>
                    <option value="progress">진행 중</option>
                </Select>

                <Select
                    value={sortOption}
                    onChange={(e) =>
                        setSortOption(e.target.value as "latest" | "oldest" | "status")
                    }>
                    <option value="latest">최신순</option>
                    <option value="oldest">오래된순</option>
                    <option value="status">상태별</option>
                </Select>
            </FilterBar>

            {/* 1. 전체 데이터가 아예 없을 때 */}
            {list.length === 0 ? (
                <EmptyState>
                    <FaRobot size={44} color={palette.primary} />
                    <h2>아직 진행한 AI 면접이 없어요</h2>
                    <p>AI 모의면접으로 나만의 첫 기록을 만들어보세요!</p>
                    <StartButton
                        onClick={() =>
                            (window.location.href = "/vue-ai-interview/ai-interview/landing")
                        }>
                        AI 면접 시작하기
                    </StartButton>
                </EmptyState>
            ) : filteredList.length === 0 ? (
                /* 2~3. 필터 또는 검색 결과 없음 */
                <EmptyState>
                    {filterStatus === "progress" ? (
                        <>
                            <FaRobot size={44} color={palette.primary} />
                            <h2>진행 중인 면접이 없습니다</h2>
                            <p>새로운 AI 모의면접을 다시 시작해보세요!</p>
                            <StartButton
                                onClick={() =>
                                    (window.location.href = "/vue-ai-interview/ai-interview/landing")
                                }>
                                AI 면접 시작하기
                            </StartButton>
                        </>
                    ) : (
                        <>
                            <FaSearch size={42} color={palette.accent} />
                            <h2>검색 결과가 없습니다</h2>
                            <p>입력하신 조건에 맞는 면접 결과를 찾을 수 없습니다.</p>
                            <p>다른 키워드로 검색해보세요</p>
                        </>
                    )}
                </EmptyState>
            ) : (
                /* 4. 정상 목록 출력 */
                <BaseCard>
                    {filteredList.map((item) => (
                        <InterviewRow key={item.interviewId}>
                            <LeftInfo>
                                <FaRobot size={18} color={palette.primary} />
                                <InfoText>
                                    <Topic>{item.interviewType}</Topic>
                                    <DateText>
                                        <FaRegClock size={12} color={palette.textSub} />
                                        {new Date(item.createdAt).toLocaleString("ko-KR")}
                                    </DateText>
                                </InfoText>
                            </LeftInfo>

                            <RightArea>
                                <StatusBadge isFinished={item.finished}>
                                    {item.finished ? "✅ COMPLETED" : "🟡 IN_PROGRESS"}
                                </StatusBadge>
                                <DetailButton
                                    onClick={() =>
                                        navigate(`/mypage/interview/history/${item.interviewId}`)
                                    }>
                                    상세보기
                                </DetailButton>
                            </RightArea>
                        </InterviewRow>
                    ))}
                </BaseCard>
            )}
        </Section>
    );
}

/* ---------- 스타일 ---------- */
const Section = styled.section`
    background: ${palette.lightBG};
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    animation: ${fadeUp} 0.6s ease both;
`;

const SectionTitle = styled.h2`
    font-size: 19px;
    font-weight: 700;
    color: ${palette.textMain};
    margin-bottom: 6px;
`;

const SubText = styled.p`
    color: ${palette.textSub};
    font-size: 14px;
    margin-bottom: 18px;
`;

const FilterBar = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
`;

const SearchBox = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 6px 10px;
    width: 220px;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    font-size: 14px;
    margin-left: 6px;
    color: ${palette.textMain};
    width: 100%;
`;

const Select = styled.select`
    padding: 6px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: ${palette.textMain};
    background: #fff;
    cursor: pointer;
`;

const BaseCard = styled.div`
    background: linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%);
    border: 1px solid ${palette.border};
    border-radius: 14px;
    box-shadow: 0 4px 10px ${palette.shadow};
    padding: 18px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const InterviewRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 12px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    transition: 0.2s ease;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px ${palette.shadow};
    }
`;

const LeftInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const InfoText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Topic = styled.span`
    font-weight: 600;
    color: ${palette.textMain};
`;

const DateText = styled.span`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: ${palette.textSub};
`;

const RightArea = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const StatusBadge = styled.span<{ isFinished: boolean }>`
    font-size: 12px;
    font-weight: 600;
    color: ${({ isFinished }) => (isFinished ? "#065F46" : "#92400E")};
    background-color: ${({ isFinished }) => (isFinished ? "#D1FAE5" : "#FEF3C7")};
    border: 1px solid ${({ isFinished }) => (isFinished ? "#A7F3D0" : "#FCD34D")};
    border-radius: 999px;
    padding: 4px 10px;
`;

const DetailButton = styled.button`
    background: transparent;
    border: 1px solid ${palette.border};
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 13px;
    color: ${palette.textMain};
    cursor: pointer;
    transition: 0.2s ease;
    &:hover {
        background: ${palette.primary};
        color: white;
        border-color: ${palette.primary};
    }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    text-align: center;
    color: ${palette.textMain};
    gap: 12px;
    h2 {
        color: ${palette.primary};
        font-weight: 700;
    }
    p {
        color: ${palette.textSub};
    }
`;

const StartButton = styled.button`
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    color: white;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    padding: 10px 22px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 10px rgba(59,130,246,0.25);
    &:hover {
        transform: translateY(-2px);
        opacity: 0.95;
    }
`;
