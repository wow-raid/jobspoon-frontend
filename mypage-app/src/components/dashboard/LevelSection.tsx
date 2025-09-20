{/* 마이페이지 대쉬보드 - 레벨 */}

import React, { useEffect, useState } from "react";
import {
    fetchMyProfile,
    fetchUserLevel,
    ProfileAppearanceResponse,
    UserLevel,
} from "../../api/profileAppearanceApi.ts";
import styled from "styled-components";

export default function LevelSection() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("userToken") || "";
        Promise.all([fetchMyProfile(token), fetchUserLevel(token)])
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
            </SectionHeader>

            {userLevel ? (
                <>
                    <LevelText>Lv. {userLevel.level}</LevelText>
                    <ExpBarWrapper>
                        <ExpBarFill
                            style={{
                                width: `${Math.min(
                                    (userLevel.exp / userLevel.totalExp) * 100,
                                    100
                                )}%`,
                            }}
                        />
                    </ExpBarWrapper>
                    <ExpText>
                        경험치 {userLevel.exp} / {userLevel.totalExp}
                    </ExpText>
                </>
            ) : (
                <Empty>레벨 정보가 없습니다.</Empty>
            )}
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

const ExpBarFill = styled.div`
  height: 100%;
  background: rgb(59, 130, 246);
  transition: width 0.3s ease;
`;

const ExpText = styled.p`
  font-size: 14px;
  color: #666;
`;

const Empty = styled.p`
  margin-top: 8px;
  color: #888;
  font-size: 14px;
`;
