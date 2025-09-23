{/* 이력 관리 메뉴 */}

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    fetchUserLevel,
    fetchMyTitles,
    fetchTrustScore,
    UserLevel,
    TrustScore,
    TitleItem,
} from "../api/profileAppearanceApi";
import TrustScoreCriteria from "../components/history/TrustScoreCriteria";
import TitleGuideModal from "../components/modals/TitleGuideModal";

export default function UserHistoryPage() {
    const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
    const [titles, setTitles] = useState<TitleItem[]>([]);
    const [trustScore, setTrustScore] = useState<TrustScore | null>(null);

    // 토글 상태
    const [showTrustCriteria, setShowTrustCriteria] = useState(false);
    const [isTitleGuideOpen, setIsTitleGuideOpen] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) return;

        // 레벨 + 칭호
        Promise.all([fetchUserLevel(), fetchMyTitles()])
            .then(([lvl, t]) => {
                setUserLevel(lvl);
                setTitles(t);
            })
            .catch(console.error);

        // 신뢰점수
        fetchTrustScore().then(setTrustScore).catch(console.error);
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
                        <ToggleButton
                            onClick={() => setShowTrustCriteria(!showTrustCriteria)}
                        >
                            {showTrustCriteria ? "숨기기" : "산정 기준"}
                        </ToggleButton>
                    </HistoryHeader>
                    {trustScore ? (
                        <TrustGrid>
                            <TrustItem>
                                <span>출석률</span>
                                <ProgressBar percent={trustScore.attendanceRate} />
                                <Count>{trustScore.attendanceRate.toFixed(1)}%</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>인터뷰</span>
                                <Count>{trustScore.monthlyInterviews}회</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>문제풀이</span>
                                <Count>{trustScore.monthlyProblems}개</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>글 작성</span>
                                <Count>{trustScore.monthlyPosts}개</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>스터디룸</span>
                                <Count>{trustScore.monthlyStudyrooms}개</Count>
                            </TrustItem>
                            <TrustItem>
                                <span>댓글</span>
                                <Count>{trustScore.monthlyComments}개</Count>
                            </TrustItem>
                        </TrustGrid>
                    ) : (
                        <Empty>신뢰점수를 불러오는 중...</Empty>
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
                    </HistoryHeader>
                    {userLevel ? (
                        <LevelBox>
                            <p>
                                현재 Lv.{userLevel.level} (Exp {userLevel.exp}/
                                {userLevel.level * 100})
                            </p>
                            <ProgressBar
                                percent={(userLevel.exp / (userLevel.level * 100)) * 100}
                            />
                        </LevelBox>
                    ) : (
                        <Empty>레벨 정보를 불러오는 중...</Empty>
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
                    {titles.length > 0 ? (
                        <ul>
                            {titles.map((title) => (
                                <HistoryItemBox key={title.id}>
                  <span>
                    {title.displayName} (
                      {new Date(title.acquiredAt).toLocaleDateString()})
                  </span>
                                </HistoryItemBox>
                            ))}
                        </ul>
                    ) : (
                        <Empty>획득한 칭호가 없습니다.</Empty>
                    )}
                </Card>

                <TitleGuideModal
                    isOpen={isTitleGuideOpen}
                    onClose={() => setIsTitleGuideOpen(false)}
                />
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

const HistoryItemBox = styled.li`
  border: 1px solid rgb(229, 231, 235);
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 6px;
  background: white;

  span {
    font-size: 14px;
    color: rgb(31, 41, 55);
  }
`;

const Empty = styled.p`
  font-size: 14px;
  color: #888;
`;
