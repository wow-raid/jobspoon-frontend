{/* 마이페이지 대쉬보드 - 레벨 */}

import React, { useEffect, useState } from "react";
import {
    fetchMyProfile,
    fetchUserLevel,
    ProfileAppearanceResponse,
    UserLevel,
} from "../../api/profileAppearanceApi.ts";
import styled from "styled-components";
import LevelGuideModal from "../modals/LevelGuideModal.tsx"; // 새 모달 추가

export default function LevelSection() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            console.error("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        Promise.all([fetchMyProfile(), fetchUserLevel()])
            .then(([profileData, levelData]) => {
                setProfile(profileData);
                setUserLevel(levelData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);


    if (loading) return <p>불러오는 중...</p>;

    return (
        <Box>
            <SectionHeader>
                <SectionTitle>나의 레벨 현황</SectionTitle>
                <GuideButton onClick={() => setIsGuideOpen(true)}>레벨 가이드</GuideButton>
            </SectionHeader>

            {userLevel ? (
                <>
                    <LevelText>
                        Lv. {userLevel.level}{" "}
                        <span role="img" aria-label="badge">
                            🏅
                        </span>
                    </LevelText>

                    {(() => {
                        const expNeeded = userLevel.level * 100;
                        const progress = expNeeded > 0
                            ? Math.min((userLevel.exp / expNeeded) * 100, 100)
                            : 0;

                        return (
                            <>
                                <ExpBarWrapper>
                                    <ExpBarFill
                                        level={userLevel.level}
                                        style={{ width: `${progress}%` }}
                                    />
                                </ExpBarWrapper>
                                <ExpText>
                                    경험치 {userLevel.exp} / {expNeeded} ({progress.toFixed(1)}%)
                                </ExpText>
                                <NextLevelText>
                                    다음 레벨까지 {Math.max(0, expNeeded - userLevel.exp)} Exp 남음
                                </NextLevelText>
                                <TotalExpText>
                                    누적 경험치: {userLevel.totalExp}
                                </TotalExpText>
                            </>
                        );
                    })()}
                </>
            ) : (
                <Empty>레벨 정보가 없습니다.</Empty>
            )}

            {/* 레벨 가이드 모달 */}
            <LevelGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </Box>
    );
}

/* ================= styled-components ================= */

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
    margin-bottom: 16px;
`;

const GuideButton = styled.button`
    font-size: 14px;
    color: rgb(59, 130, 246);
    border: none;
    background: transparent;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const Box = styled.div`
    padding: 24px;
    border: 1px solid #eee;
    border-radius: 12px;
    text-align: center;
    background: #fafafa;
`;

const LevelText = styled.p`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 12px;
`;

const ExpBarWrapper = styled.div`
    width: 100%;
    height: 14px;
    border-radius: 8px;
    background: #e5e7eb;
    overflow: hidden;
    margin-bottom: 8px;
`;

const ExpBarFill = styled.div<{ level: number }>`
    height: 100%;
    background: ${({ level }) =>
            level < 5
                    ? "#3b82f6"
                    : level < 10
                            ? "linear-gradient(90deg, #3b82f6, #10b981)"
                            : "linear-gradient(90deg, #f59e0b, #ef4444)"};
    transition: width 0.5s ease;
`;

const ExpText = styled.p`
    font-size: 14px;
    color: #444;
`;

const NextLevelText = styled.p`
    font-size: 13px;
    color: #888;
`;

const TotalExpText = styled.p`
    font-size: 13px;
    color: #666;
    margin-top: 4px;
`;

const Empty = styled.p`
    margin-top: 8px;
    color: #888;
    font-size: 14px;
`;
