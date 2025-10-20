{/* 이력 관리 메뉴 */}

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ProfileAppearanceResponse } from "../api/profileAppearanceApi"; // 프로필만
import {
    fetchUserLevel,
    fetchUserLevelHistory,
    UserLevelResponse,
    UserLevelHistoryResponse
} from "../api/userLevelApi"; // 레벨 관련
import {
    equipTitle,
    unequipTitle,
    UserTitleResponse
} from "../api/userTitleApi"; // 칭호 관련
import {
    fetchTrustScore,
    TrustScoreResponse
} from "../api/userTrustScoreApi"; // 신뢰점수 관련
import {
    calcAttendanceScore,
    calcInterviewScore,
    calcProblemScore,
    calcPostScore,
    calcStudyroomScore,
    calcCommentScore,
    calcTotalScore
} from "../utils/trustScoreUtils";
import TrustScoreCriteriaModal from "../components/modals/TrustScoreCriteriaModal.tsx";
import TitleGuideModal from "../components/modals/TitleGuideModal";
import { useOutletContext } from "react-router-dom";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

type Status = "loading" | "empty" | "loaded"; // (status 타입)

type OutletContext = {
    profile: ProfileAppearanceResponse | null;
    userLevel: UserLevelResponse | null;
    titles: UserTitleResponse[];
    refreshAll: () => Promise<void>;
};

export default function UserHistoryPage() {

    // context
    const { profile, titles, refreshAll } = useOutletContext<OutletContext>();

    // 로컬 상태
    const [userLevel, setUserLevel] = useState<UserLevelResponse | null>(null);
    const [trustScore, setTrustScore] = useState<TrustScoreResponse | null>(null);
    const [levelHistory, setLevelHistory] = useState<UserLevelHistoryResponse[]>([]);

    // 섹션별 status 관리
    const [levelStatus, setLevelStatus] = useState<Status>("loading");
    const [trustStatus, setTrustStatus] = useState<Status>("loading");

    // 토글 상태
    const [showTrustCriteria, setShowTrustCriteria] = useState(false);
    const [isTitleGuideOpen, setIsTitleGuideOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 칭호 장착/해제
    const handleEquip = async (titleId: number) => {
        try {
            const target = titles.find(t => t.id === titleId);

            if (target?.equipped) {
                await unequipTitle();
                await refreshAll(); // 전체 상태 갱신
                alert("칭호가 해제되었습니다.");
            } else {
                const updated = await equipTitle(titleId);
                await refreshAll(); // 전체 상태 갱신
                alert(`${updated.displayName} 칭호가 장착되었습니다.`);
            }
        } catch (error: any) {
            alert(error.message || "칭호 장착/해제 실패");
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            try {
                const [lvl, trust, history] = await Promise.all([
                    fetchUserLevel(),
                    fetchTrustScore(),
                    fetchUserLevelHistory(),
                ]);
                setUserLevel(lvl || null);
                setTrustScore(trust || null);
                setLevelHistory(history || []);
                setLevelStatus(lvl ? "loaded" : "empty");
                setTrustStatus(trust ? "loaded" : "empty");
            } catch (err) {
                console.error(err);
                setLevelStatus("empty");
                setTrustStatus("empty");
            }
        };

        loadAll();
    }, []);

    return (
        <Wrapper>
            <Section>
                <SectionTitle>이력 관리</SectionTitle>

                {/* 신뢰점수 */}
                <Card>
                    <HistoryHeader>
                        <HeaderLeft>
                            <Icon>🛡️</Icon>
                            <h3>신뢰점수</h3>
                        </HeaderLeft>
                        <ToggleButton onClick={() => setShowTrustCriteria(!showTrustCriteria)}>
                            {showTrustCriteria ? "숨기기" : "산정 기준"}
                        </ToggleButton>
                    </HistoryHeader>
                    {trustStatus === "loading" ? (
                        <Empty>불러오는 중...</Empty>
                    ) : trustStatus === "empty" ? (
                        <Empty>아직 신뢰점수가 없습니다.</Empty>
                    ) : (
                        <>
                            <TrustContent> {/* ✅ 새로운 컨테이너 */}
                                <TrustGrid>
                                    <TrustItem>
                                        <span>출석률</span>
                                        <ProgressBar
                                            percent={(calcAttendanceScore(trustScore!.attendanceRate) / 25) * 100}
                                        />
                                        <Count>{calcAttendanceScore(trustScore!.attendanceRate).toFixed(1)} / 25점</Count>
                                    </TrustItem>

                                    <TrustItem>
                                        <span>모의면접</span>
                                        <ProgressBar
                                            percent={(calcInterviewScore(trustScore!.monthlyInterviews) / 20) * 100}
                                        />
                                        <Count>{calcInterviewScore(trustScore!.monthlyInterviews)} / 20점</Count>
                                    </TrustItem>

                                    <TrustItem>
                                        <span>문제풀이</span>
                                        <ProgressBar
                                            percent={(calcProblemScore(trustScore!.monthlyProblems) / 20) * 100}
                                        />
                                        <Count>{calcProblemScore(trustScore!.monthlyProblems)} / 20점</Count>
                                    </TrustItem>

                                    <TrustItem>
                                        <span>글 작성</span>
                                        <ProgressBar
                                            percent={(calcPostScore(trustScore!.monthlyPosts) / 15) * 100}
                                        />
                                        <Count>{calcPostScore(trustScore!.monthlyPosts)} / 15점</Count>
                                    </TrustItem>

                                    <TrustItem>
                                        <span>스터디룸</span>
                                        <ProgressBar
                                            percent={(calcStudyroomScore(trustScore!.monthlyStudyrooms) / 10) * 100}
                                        />
                                        <Count>{calcStudyroomScore(trustScore!.monthlyStudyrooms)} / 10점</Count>
                                    </TrustItem>

                                    <TrustItem>
                                        <span>댓글</span>
                                        <ProgressBar
                                            percent={(calcCommentScore(trustScore!.monthlyComments) / 15) * 100}
                                        />
                                        <Count>{calcCommentScore(trustScore!.monthlyComments)} / 15점</Count>
                                    </TrustItem>
                                </TrustGrid>

                                <Divider />

                                {/* 총점 왼쪽 아래 */}
                                <TotalScore>
                                    총점: {calcTotalScore(trustScore!).toFixed(1)} / 100점
                                </TotalScore>
                            </TrustContent>
                        </>
                    )}
                    <TrustScoreCriteriaModal
                        isOpen={showTrustCriteria}
                        onClose={() => setShowTrustCriteria(false)}
                    />
                </Card>

                {/* 레벨 */}
                <Card>
                    <HistoryHeader>
                        <HeaderLeft>
                            <Icon>🏅</Icon>
                            <h3>레벨</h3>
                        </HeaderLeft>
                        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
                            {isOpen
                                ? <><FaChevronUp size={10}/> 닫기</>
                                : <><FaChevronDown size={10}/> 히스토리</>
                            }
                        </ToggleButton>
                    </HistoryHeader>

                    {levelStatus === "loading" ? (
                        <Empty>불러오는 중...</Empty>
                    ) : levelStatus === "empty" ? (
                        <Empty>레벨 정보가 없습니다.</Empty>
                    ) : (
                        <LevelBox>
                            <p>
                                현재 Lv.{userLevel!.level} (Exp {userLevel!.exp}/{userLevel!.totalExp})
                            </p>
                            <ProgressBar percent={(userLevel!.exp / userLevel!.totalExp) * 100} />
                        </LevelBox>
                    )}

                    {isOpen && (
                        <Timeline>
                            {levelHistory.length === 0 ? (
                                <Empty>레벨 업 기록이 없습니다.</Empty>
                            ) : (
                                levelHistory.map((item) => (
                                    <TimelineItem key={item.achievedAt}>
                                        <TimelineDate>
                                            {new Date(item.achievedAt).toLocaleDateString()}
                                        </TimelineDate>
                                        <TimelineEvent>Lv.{item.level} 달성</TimelineEvent>
                                    </TimelineItem>
                                ))
                            )}
                        </Timeline>
                    )}
                </Card>

                {/* 칭호 이력 */}
                <Card>
                    <HistoryHeader>
                        <HeaderLeft>
                            <Icon>🎖️</Icon>
                            <h3>칭호 이력</h3>
                        </HeaderLeft>
                        <ToggleButton onClick={() => setIsTitleGuideOpen(true)}>
                            칭호 가이드
                        </ToggleButton>
                    </HistoryHeader>

                    {titles.length === 0 ? (
                        <Empty>획득한 칭호가 없습니다.</Empty>
                    ) : (
                        <TitleGrid>
                            {titles.map((title) => (
                                <TitleCard key={title.id} equipped={title.equipped}>
                                    <TitleName>{title.displayName}</TitleName>

                                    <AcquiredDate>
                                        {new Date(title.acquiredAt).toLocaleDateString()}
                                    </AcquiredDate>

                                    <Description>{title.description}</Description>

                                    {/* 버튼 */}
                                    <ActionButton onClick={() => handleEquip(title.id)}>
                                        {title.equipped ? "해제" : "장착"}
                                    </ActionButton>
                                </TitleCard>
                            ))}
                        </TitleGrid>
                    )}
                </Card>

                <TitleGuideModal isOpen={isTitleGuideOpen} onClose={() => setIsTitleGuideOpen(false)} />
            </Section>
        </Wrapper>
    );
}

/* ================= styled-components ================= */
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const Card = styled.div`
    background: rgb(249, 250, 251);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 {
        font-size: 16px;
        font-weight: 600;
        color: rgb(17, 24, 39);
    }

    p,
    li {
        font-size: 14px;
        color: rgb(107, 114, 128);
    }
`;

const HistoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Icon = styled.span`
    font-size: 18px;
`;

const ToggleButton = styled.button`
    font-size: 13px;
    color: #3b82f6;
    border: none;
    background: none;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const TrustGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
`;

const TrustItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
`;

const ProgressBar = styled.div<{ percent: number }>`
    width: 100%;
    height: 10px;
    background: #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
    position: relative;

    &::after {
        content: "";
        display: block;
        height: 100%;
        width: ${({ percent }) => percent}%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        transition: width 0.3s ease;
    }
`;

const Count = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: rgb(31, 41, 55);
`;

const LevelBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    p {
        font-size: 14px;
        color: #374151;
    }
`;

const Empty = styled.p`
    font-size: 14px;
    color: #888;
`;

const TitleGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
`;

const TitleCard = styled.div<{ equipped: boolean }>`
    border: 1px solid ${({ equipped }) => (equipped ? "#3b82f6" : "rgb(229,231,235)")};
    border-radius: 8px;
    padding: 12px;
    background: ${({ equipped }) => (equipped ? "rgba(59,130,246,0.05)" : "white")};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
`;

const TitleName = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: rgb(31,41,55);
`;

const AcquiredDate = styled.span`
    font-size: 12px;
    color: rgb(107,114,128);
`;

const Timeline = styled.ul`
    margin: 1rem 0;
    padding-left: 0;
    list-style: none;
`;

const TimelineItem = styled.li`
    position: relative;
    margin-bottom: 1.5rem;
    padding-left: 24px; // 점 공간 확보

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8B5CF6, #EC4899); // 퍼플→핑크
        box-shadow: -3px 3px 0 rgba(156, 163, 175, 0.4); // 은은한 그림자
    }
`;

const TimelineDate = styled.span`
    font-size: 0.85rem;
    color: #6b7280;
    margin-right: 8px;
`;

const TimelineEvent = styled.span`
    font-size: 0.95rem;
    font-weight: 500;
    color: #111827;
`;

// 신뢰점수 전체 영역 묶는 컨테이너
const TrustContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const TotalScore = styled.div`
    margin-top: 0;
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(37, 99, 235, 0.08);
    font-size: 15px;
    font-weight: 700;
    color: #2563eb;
    align-self: flex-start;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
`;

const Description = styled.p`
    font-size: 12px;
    color: #6b7280;
    text-align: center;
    margin: 8px 0;
    flex-grow: 1; /* 설명이 늘어나도 버튼은 항상 아래 */
`;

const ActionButton = styled.button`
    margin-top: auto;
    align-self: center;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #3b82f6;   /* 파란 테두리 */
    color: #3b82f6;              /* 파란 글씨 */
    background: white;           /* 흰 배경 */
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #eff6ff;     /* 연한 파랑 배경 */
    }
`;