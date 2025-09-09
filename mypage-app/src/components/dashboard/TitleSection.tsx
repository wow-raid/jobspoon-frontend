import React, { useEffect, useState } from "react";
import {
    fetchMyProfile,
    fetchMyTitles,
    ProfileAppearanceResponse,
    HistoryItem,
} from "../api/profileAppearanceApi.ts";
import styled from "styled-components";
import defaultTitle from "../assets/default_rank.png"; // 👉 임시 아이콘 (칭호용 이미지 준비되면 교체)
import TitleGuideModal from "./TitleGuideModal.tsx";

export default function TitleSection() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [titles, setTitles] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // 👉 페이징 상태
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + 1, Math.max(titles.length - visibleCount, 0))
        );
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken") || "";
        Promise.all([fetchMyProfile(token), fetchMyTitles(token)])
            .then(([profileData, titlesData]) => {
                setProfile(profileData);
                setTitles(titlesData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>불러오는 중...</p>;

    return (
        <>
            <SectionHeader>
                <SectionTitle>나의 칭호 현황</SectionTitle>
                <GuideButton onClick={() => setIsGuideOpen(true)}>칭호 가이드</GuideButton>
            </SectionHeader>

            <ContentGrid>
                {/* 대표 칭호 */}
                <Box>
                    {profile?.title ? (
                        <>
                            <TitleIconLarge src={defaultTitle} alt={profile.title.displayName} />
                            <p><strong>{profile.title.displayName}</strong></p>
                            <span>현재 장착 중</span>
                        </>
                    ) : (
                        <>
                            <TitleIconLarge src={defaultTitle} alt="no title" />
                            <p>대표 칭호가 없습니다.</p>
                        </>
                    )}
                </Box>

                {/* 보유 칭호 */}
                <Box>
                    <p><strong>획득 개수 {titles.length}개</strong></p>
                    {titles.length === 0 ? (
                        <Empty>아직 획득한 칭호가 없습니다.</Empty>
                    ) : (
                        <PreviewWrapper>
                            <NavButton position="left" onClick={handlePrev} disabled={currentIndex === 0}>
                                {"<"}
                            </NavButton>

                            <PreviewList>
                                {titles
                                    .slice(currentIndex, currentIndex + visibleCount)
                                    .map((title) => (
                                        <PreviewItem key={title.id}>
                                            <TitleIconSmall src={defaultTitle} alt={title.displayName} />
                                            <span>{title.displayName}</span>
                                            <DateText>
                                                {new Date(title.acquiredAt).toLocaleDateString()}
                                            </DateText>
                                        </PreviewItem>
                                    ))}
                            </PreviewList>

                            <NavButton
                                position="right"
                                onClick={handleNext}
                                disabled={currentIndex >= titles.length - visibleCount}
                            >
                                {">"}
                            </NavButton>
                        </PreviewWrapper>
                    )}
                </Box>
            </ContentGrid>

            <TitleGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
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

const TitleIconLarge = styled.img`
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
  color: rgb(107, 114, 128);
`;

const TitleIconSmall = styled.img`
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
  color: rgb(75, 85, 99);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: rgb(59, 130, 246);
    transform: translateY(-50%) scale(1.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
