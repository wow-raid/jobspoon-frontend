import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    fetchMyRanks,
    fetchMyTitles,
    HistoryItem
} from "../api/profileAppearanceApi";
import {
    getTrustScore,
    TrustScoreResponse
} from "../api/dashboardApi";
import TrustScoreCriteria from "../components/history/TrustScoreCriteria";

export default function UserHistoryPage() {
    const [ranks, setRanks] = useState<HistoryItem[]>([]);
    const [titles, setTitles] = useState<HistoryItem[]>([]);
    const [trustScore, setTrustScore] = useState<TrustScoreResponse | null>(null);

    // ✅ 토글 상태 (기본 닫힘)
    const [showRanks, setShowRanks] = useState(false);
    const [showTitles, setShowTitles] = useState(false);
    const [showTrustCriteria, setShowTrustCriteria] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        Promise.all([fetchMyRanks(token), fetchMyTitles(token)])
            .then(([r, t]) => {
                setRanks(r);
                setTitles(t);
            })
            .catch(console.error);

        getTrustScore(token)
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
                                <li>총점: {trustScore.trustScore}점</li>
                                <li>출석 점수: {trustScore.attendanceScore}</li>
                                <li>인터뷰 점수: {trustScore.interviewScore}</li>
                                <li>퀴즈 점수: {trustScore.quizScore}</li>
                                <li>리뷰 점수: {trustScore.reviewScore}</li>
                                <li>스터디룸 점수: {trustScore.studyroomScore}</li>
                                <li>댓글 점수: {trustScore.commentScore}</li>
                                {trustScore.bonusApplied && <li>보너스 +5점 적용됨 ✅</li>}
                            </ul>

                            {/* ✅ 산정 기준표 토글 */}
                            {showTrustCriteria && <TrustScoreCriteria />}
                        </>
                    ) : (
                        <p style={{ color: "#6b7280" }}>신뢰점수를 불러오는 중...</p>
                    )}
                </Card>

                {/* 등급 이력 */}
                <Card>
                    <HistoryHeader>
                        <h3>등급 이력</h3>
                        <ToggleButton onClick={() => setShowRanks(!showRanks)}>
                            {showRanks ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>
                    {showRanks && (
                        ranks.length > 0 ? (
                            <ul>
                                {ranks.map((rank) => (
                                    <HistoryItemBox key={rank.id}>
                                        <span>
                                            {rank.displayName} (
                                            {new Date(rank.acquiredAt).toLocaleDateString()})
                                        </span>
                                    </HistoryItemBox>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: "#6b7280" }}>
                                획득한 등급이 없습니다.
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
