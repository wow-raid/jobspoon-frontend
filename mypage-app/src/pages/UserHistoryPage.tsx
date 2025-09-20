{/* 이력 관리 메뉴 */}

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    fetchUserLevel,
    fetchMyTitles,
    fetchTrustScore,
    UserLevel,
    TrustScore,
    TitleItem
} from "../api/profileAppearanceApi";
import TrustScoreCriteria from "../components/history/TrustScoreCriteria";

export default function UserHistoryPage() {
    const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
    const [titles, setTitles] = useState<TitleItem[]>([]);
    const [trustScore, setTrustScore] = useState<TrustScore | null>(null);

    // 토글 상태 (기본 닫힘)
    const [showLevel, setShowLevel] = useState(false);
    const [showTitles, setShowTitles] = useState(false);
    const [showTrustCriteria, setShowTrustCriteria] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        // 레벨 + 칭호
        Promise.all([fetchUserLevel(token), fetchMyTitles(token)])
            .then(([lvl, t]) => {
                setUserLevel(lvl);
                setTitles(t);
            })
            .catch(console.error);

        // 신뢰점수
        fetchTrustScore(token)
            .then((res) => setTrustScore(res))
            .catch(console.error);
    }, []);

    return (
        <Wrapper>
            <Section>
                <SectionTitle>이력 관리</SectionTitle>

                {/* 신뢰점수 */}
                <Card>
                    <HistoryHeader>
                        <h3>신뢰점수</h3>
                        <ToggleButton onClick={() => setShowTrustCriteria(!showTrustCriteria)}>
                            {showTrustCriteria ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>
                    {trustScore ? (
                        <>
                            <ul>
                                <li>출석률: {(trustScore.attendanceRate * 100).toFixed(1)}%</li>
                                <li>이번 달 인터뷰: {trustScore.monthlyInterviews}회</li>
                                <li>이번 달 문제풀이: {trustScore.monthlyProblems}개</li>
                                <li>이번 달 글 작성: {trustScore.monthlyPosts}개</li>
                                <li>이번 달 스터디룸: {trustScore.monthlyStudyrooms}개</li>
                                <li>이번 달 댓글: {trustScore.monthlyComments}개</li>
                            </ul>

                            {/* 산정 기준표 토글 */}
                            {showTrustCriteria && <TrustScoreCriteria />}
                        </>
                    ) : (
                        <p style={{ color: "#6b7280" }}>신뢰점수를 불러오는 중...</p>
                    )}
                </Card>

                {/* 레벨 */}
                <Card>
                    <HistoryHeader>
                        <h3>레벨</h3>
                        <ToggleButton onClick={() => setShowLevel(!showLevel)}>
                            {showLevel ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>
                    {showLevel && (
                        userLevel ? (
                            <ul>
                                <HistoryItemBox>
                                    <span>
                                        현재 Lv.{userLevel.level} (Exp {userLevel.exp}/{userLevel.totalExp})
                                    </span>
                                </HistoryItemBox>
                            </ul>
                        ) : (
                            <p style={{ color: "#6b7280" }}>
                                레벨 정보를 불러오는 중...
                            </p>
                        )
                    )}
                </Card>

                {/* 칭호 이력 */}
                <Card>
                    <HistoryHeader>
                        <h3>칭호 이력</h3>
                        <ToggleButton onClick={() => setShowTitles(!showTitles)}>
                            {showTitles ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>
                    {showTitles && (
                        titles.length > 0 ? (
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
                            <p style={{ color: "#6b7280" }}>
                                획득한 칭호가 없습니다.
                            </p>
                        )
                    )}
                </Card>
            </Section>
        </Wrapper>
    );
}

/* ================== styled-components ================== */
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

    p, li {
        font-size: 14px;
        color: rgb(107, 114, 128);
    }
`;

const HistoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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

const HistoryItemBox = styled.li`
    border: 1px solid rgb(229,231,235);
    border-radius: 8px;
    padding: 8px 12px;
    margin-top: 6px;
    background: white;

    span {
        font-size: 14px;
        color: rgb(31,41,55);
    }
`;
