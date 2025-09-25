{/* 이력 관리 메뉴 */}

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    fetchUserLevel,
    fetchMyTitles,
    fetchTrustScore,
    fetchUserLevelHistory,
    equipTitle,
    unequipTitle,
    UserLevel,
    UserLevelHistory,
    TrustScore,
    TitleItem,
    ProfileAppearanceResponse
} from "../api/profileAppearanceApi";
import TrustScoreCriteria from "../components/history/TrustScoreCriteria";
import TitleGuideModal from "../components/modals/TitleGuideModal";
import { useOutletContext } from "react-router-dom";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

type Status = "loading" | "empty" | "loaded"; // (status 타입)

type OutletContext = {
    profile: ProfileAppearanceResponse | null;
    refreshProfile: () => Promise<void>;
};

export default function UserHistoryPage() {

    // context
    const { profile, refreshProfile } = useOutletContext<OutletContext>();

    // 로컬 상태
    const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
    const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
    const [titles, setTitles] = useState<TitleItem[]>([]);
    const [levelHistory, setLevelHistory] = useState<UserLevelHistory[]>([]);


    // 섹션별 status 관리
    const [levelStatus, setLevelStatus] = useState<Status>("loading");
    const [titleStatus, setTitleStatus] = useState<Status>("loading");
    const [trustStatus, setTrustStatus] = useState<Status>("loading");

    // 토글 상태
    const [showTrustCriteria, setShowTrustCriteria] = useState(false);
    const [isTitleGuideOpen, setIsTitleGuideOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 칭호 장착/해제
    const handleEquip = async (titleId: number) => {
        try {
            if (profile?.title?.id === titleId) {
                await unequipTitle();
                await refreshProfile();
                alert("칭호가 해제되었습니다.");
            } else {
                const updated = await equipTitle(titleId);
                await refreshProfile();
                alert(`${updated.displayName} 칭호가 장착되었습니다.`);
            }
        } catch (error: any) {
            alert(error.message || "칭호 장착/해제 실패");
        }
    };

    useEffect(() => {
        Promise.all([fetchUserLevel(), fetchMyTitles(), fetchTrustScore(), fetchUserLevelHistory()])
            .then(([lvl, t, trust, history]) => {
                // 레벨
                if (lvl) {
                    setUserLevel(lvl);
                    setLevelStatus("loaded");
                } else {
                    setLevelStatus("empty");
                }

                // 칭호
                if (t && t.length > 0) {
                    setTitles(t);
                    setTitleStatus("loaded");
                } else {
                    setTitleStatus("empty");
                }

                // 신뢰점수
                if (trust) {
                    setTrustScore(trust);
                    setTrustStatus("loaded");
                } else {
                    setTrustStatus("empty");
                }

                // 레벨 이력
                setLevelHistory(history || []);
            })
            .catch((err) => {
                console.error(err);
                setLevelStatus("empty");
                setTitleStatus("empty");
                setTrustStatus("empty");
            });
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
                        <TrustGrid>
                            <TrustItem>
                                <span>출석률</span>
                                <ProgressBar percent={trustScore!.attendanceRate} />
                                <Count>{trustScore!.attendanceRate.toFixed(1)}%</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>인터뷰</span>
                                <Count>{trustScore!.monthlyInterviews}회</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>문제풀이</span>
                                <Count>{trustScore!.monthlyProblems}개</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>글 작성</span>
                                <Count>{trustScore!.monthlyPosts}개</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>스터디룸</span>
                                <Count>{trustScore!.monthlyStudyrooms}개</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>댓글</span>
                                <Count>{trustScore!.monthlyComments}개</Count>
                            </TrustItem>
                        </TrustGrid>
                    )}
                    {showTrustCriteria && <TrustScoreCriteria />}
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

                    {titleStatus === "loading" ? (
                        <Empty>불러오는 중...</Empty>
                    ) : titleStatus === "empty" ? (
                        <Empty>획득한 칭호가 없습니다.</Empty>
                    ) : (
                        <TitleGrid>
                            {titles.map((title) => (
                                <TitleCard key={title.id} equipped={profile?.title?.id === title.id}>
                                    <TitleName>{title.displayName}</TitleName>
                                    <AcquiredDate>{new Date(title.acquiredAt).toLocaleDateString()}</AcquiredDate>
                                    <ToggleButton onClick={() => handleEquip(title.id)}>
                                        {profile?.title?.id === title.id ? "해제" : "장착"}
                                    </ToggleButton>
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