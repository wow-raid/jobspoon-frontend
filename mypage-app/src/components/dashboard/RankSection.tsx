import React, { useEffect, useState } from "react";
import {
    fetchMyProfile,
    fetchMyRanks,
    ProfileAppearanceResponse,
    HistoryItem,
} from "../../api/profileAppearanceApi.ts";
import styled from "styled-components";
import defaultRank from "../../assets/default_rank.png";
import RankGuideModal from "../modals/RankGuideModal.tsx";

export default function RankSection() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [ranks, setRanks] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + 1, Math.max(ranks.length - visibleCount, 0))
        );
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken") || "";
        Promise.all([fetchMyProfile(token), fetchMyRanks(token)])
            .then(([profileData, ranksData]) => {
                setProfile(profileData);
                setRanks(ranksData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>불러오는 중...</p>;

    return (
        <>
            <SectionHeader>
                <SectionTitle>나의 랭크 현황</SectionTitle>
                <GuideButton onClick={() => setIsGuideOpen(true)}>랭크 가이드</GuideButton>
            </SectionHeader>

            <ContentGrid>
                {/* 대표 랭크 */}
                <Box>
                    {profile?.rank ? (
                        <>
                            <RankIconLarge src={defaultRank} alt={profile.rank.displayName} />
                            <p><strong>{profile.rank.displayName}</strong></p>
                            <span>현재 장착 중</span>
                        </>
                    ) : (
                        <>
                            <RankIconLarge src={defaultRank} alt="no rank" />
                            <p>대표 랭크가 없습니다.</p>
                        </>
                    )}
                </Box>

                {/* 보유 랭크 */}
                <Box>
                    <p><strong>획득 개수 {ranks.length}개</strong></p>
                    {ranks.length === 0 ? (
                        <Empty>아직 획득한 랭크가 없습니다.</Empty>
                    ) : (
                        <PreviewWrapper>
                            <NavButton position="left" onClick={handlePrev} disabled={currentIndex === 0}>
                                {"<"}
                            </NavButton>

                            <PreviewList>
                                {ranks
                                    .slice(currentIndex, currentIndex + visibleCount)
                                    .map((rank) => (
                                        <PreviewItem key={rank.id}>
                                            <RankIconSmall src={defaultRank} alt={rank.displayName} />
                                            <span>{rank.displayName}</span>
                                            <DateText>
                                                {new Date(rank.acquiredAt).toLocaleDateString()}
                                            </DateText>
                                        </PreviewItem>
                                    ))}
                            </PreviewList>

                            <NavButton
                                position="right"
                                onClick={handleNext}
                                disabled={currentIndex >= ranks.length - visibleCount}
                            >
                                {">"}
                            </NavButton>
                        </PreviewWrapper>
                    )}
                </Box>
            </ContentGrid>

            <RankGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </>
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Box = styled.div`
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  text-align: center;
  background: #fafafa;
`;

const Empty = styled.p`
  margin-top: 8px;
  color: #888;
  font-size: 14px;
`;

const RankIconLarge = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 8px;
  object-fit: contain;
  background: #f0f0f0;
`;

const PreviewWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PreviewList = styled.div`
    display: flex;
    gap: 32px;   /* 👉 16px → 32px */
    justify-content: center;
`;

const PreviewItem = styled.div`
    text-align: center;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const DateText = styled.span`
  font-size: 11px;
  color: rgb(107, 114, 128); /* 회색 톤 */
`;

const RankIconSmall = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: contain;
  background: #f5f5f5;
  display: block;
  margin: 0 auto 6px auto;
`;

const NavButton = styled.button<{ position: "left" | "right" }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${({ position }) => (position === "left" ? "left: 12px;" : "right: 12px;")}

    font-size: 24px;
    font-weight: bold;
    color: rgb(75, 85, 99); /* 더 진한 회색 */
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        color: rgb(59, 130, 246); /* 파란색으로 강조 */
        transform: translateY(-50%) scale(1.2); /* 확대 효과 */
    }

    &:disabled {
        opacity: 0.3;
        cursor: default;
    }
`;
