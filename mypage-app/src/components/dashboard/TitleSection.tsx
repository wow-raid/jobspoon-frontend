/* ========================== 마이페이지 대쉬보드 - 칭호 (Premium + 최신순 + Confetti Ver.) ========================== */

import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti"; // 🎉 confetti 라이브러리
import { fetchMyProfile, ProfileAppearanceResponse } from "../../api/profileAppearanceApi.ts";
import { fetchMyTitles, UserTitleResponse } from "../../api/userTitleApi.ts";
import styled from "styled-components";
import defaultTitle from "../../assets/default_rank.png";
import TitleGuideModal from "../modals/TitleGuideModal.tsx";
import { notifyError } from "../../utils/toast";
import { theme } from "../../styles/theme";
import { motion } from "framer-motion";

export default function TitleSection() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [titles, setTitles] = useState<UserTitleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;

    // 🎉 이전 칭호 개수를 저장 (신규 획득 감지용)
    const prevCount = useRef<number>(0);

    const handlePrev = () => setCurrentIndex((p) => Math.max(p - 1, 0));
    const handleNext = () =>
        setCurrentIndex((p) => Math.min(p + 1, Math.max(titles.length - visibleCount, 0)));

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            notifyError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        Promise.allSettled([fetchMyProfile(), fetchMyTitles()])
            .then(([profileRes, titlesRes]) => {
                if (profileRes.status === "fulfilled") setProfile(profileRes.value);
                if (titlesRes.status === "fulfilled") {
                    // ✅ 최신순 정렬
                    const sortedTitles = [...titlesRes.value].sort(
                        (a, b) => new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime()
                    );

                    // 🎉 신규 칭호 획득 감지 (기존보다 개수가 증가한 경우)
                    if (prevCount.current && sortedTitles.length > prevCount.current) {
                        triggerConfetti();
                    }

                    prevCount.current = sortedTitles.length;
                    setTitles(sortedTitles);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    /** 🎊 confetti 효과 함수 */
    const triggerConfetti = () => {
        // 화면 중앙에서 폭죽 터뜨리기
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 60,
                origin: { x: 0 },
                colors: ["#4F46E5", "#60A5FA", "#93C5FD"], // primary 톤
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 60,
                origin: { x: 1 },
                colors: ["#4F46E5", "#60A5FA", "#93C5FD"],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    if (loading) return <p>불러오는 중...</p>;

    const equippedTitle = titles.find((t) => t.equipped);

    return (
        <>
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>나의 칭호 현황</SectionTitle>
                    <GuideButton onClick={() => setIsGuideOpen(true)}>칭호 가이드</GuideButton>
                </SectionHeader>

                <ContentGrid>
                    {/* 🎖 현재 장착 칭호 */}
                    <CurrentTitleCard>
                        {equippedTitle ? (
                            <>
                                <Badge>현재 장착 중</Badge>
                                <img src={defaultTitle} alt={equippedTitle.displayName} />
                                <h3>{equippedTitle.displayName}</h3>
                                <p>나의 대표 칭호</p>
                            </>
                        ) : (
                            <>
                                <img src={defaultTitle} alt="no title" />
                                <h3>대표 칭호 없음</h3>
                                <p>아직 장착된 칭호가 없습니다.</p>
                            </>
                        )}
                    </CurrentTitleCard>

                    {/* 🏅 획득 칭호 리스트 */}
                    <TitleListCard>
                        <TitleListHeader>
                            <span>획득 개수 {titles.length}개</span>
                        </TitleListHeader>

                        {titles.length === 0 ? (
                            <EmptyWrapper>
                                <Empty>아직 획득한 칭호가 없습니다.</Empty>
                            </EmptyWrapper>
                        ) : (
                            <PreviewWrapper>
                                <NavButton position="left" onClick={handlePrev} disabled={currentIndex === 0}>
                                    {"<"}
                                </NavButton>

                                <TitleList>
                                    {titles.slice(currentIndex, currentIndex + visibleCount).map((title) => (
                                        <MotionTitleItem
                                            key={title.id}
                                            isEquipped={title.equipped}
                                            whileHover={{ scale: 1.05, y: -4 }} // 💫 hover 시 확대 및 위로 살짝 이동
                                            transition={{ type: "spring", stiffness: 250, damping: 15 }}
                                        >
                                            <div className="iconWrapper">
                                                <img src={defaultTitle} alt={title.displayName} />
                                                {title.equipped && <EquippedBadge>장착</EquippedBadge>}
                                            </div>
                                            <h4>{title.displayName}</h4>
                                            <p>{new Date(title.acquiredAt).toLocaleDateString()}</p>

                                            {/* ✨ Tooltip (hover 시 위로 부드럽게 등장) */}
                                            <Tooltip className="tooltip">{title.description}</Tooltip>
                                        </MotionTitleItem>
                                    ))}
                                </TitleList>

                                <NavButton
                                    position="right"
                                    onClick={handleNext}
                                    disabled={currentIndex >= titles.length - visibleCount}
                                >
                                    {">"}
                                </NavButton>
                            </PreviewWrapper>
                        )}
                    </TitleListCard>
                </ContentGrid>
            </SectionContainer>

            {/* 📘 칭호 가이드 모달 */}
            <TitleGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </>
    );
}

/* ========================== styled-components ========================== */

const SectionContainer = styled.section`
    background: ${theme.color.bgWhite};
    border-radius: ${theme.radius.section};
    box-shadow: ${theme.shadow.section};
    padding: ${theme.spacing.sectionPadding};
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SectionTitle = styled.h2`
    font-size: ${theme.font.title};
    font-weight: 700;
    color: ${theme.color.text};
`;

const GuideButton = styled.button`
    font-size: ${theme.font.small};
    color: ${theme.color.primary};
    background: transparent;
    border: none;
    cursor: pointer;
    font-weight: 600;
    &:hover {
        text-decoration: underline;
    }
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const CurrentTitleCard = styled.div`
    position: relative;
    flex: 1;
    background: linear-gradient(145deg, #f8fbff, #eef4ff);
    border: 1.5px solid ${theme.color.primary};
    border-radius: ${theme.radius.card};
    box-shadow: ${theme.shadow.card};
    padding: 28px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    img {
        width: 80px;
        height: 80px;
        margin-bottom: 8px;
        object-fit: contain;
        transition: transform 0.3s ease, filter 0.3s ease;
    }

    &:hover img {
        transform: scale(1.08);
        filter: drop-shadow(0 4px 10px rgba(59, 130, 246, 0.3));
    }

    h3 {
        font-size: 18px;
        font-weight: 700;
        color: ${theme.color.text};
    }

    p {
        font-size: 13px;
        color: ${theme.color.textMuted};
    }
`;

const Badge = styled.div`
    position: absolute;
    top: 14px;
    right: 14px;
    background: ${theme.color.primary};
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 8px;
`;

const TitleListCard = styled.div`
    flex: 2;
    background: white;
    border-radius: ${theme.radius.card};
    box-shadow: ${theme.shadow.card};
    padding: 24px;
    display: flex;
    flex-direction: column;
`;

const TitleListHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 14px;
    font-weight: 600;
    color: ${theme.color.textMuted};
`;

const PreviewWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible; /* ✅ 스크롤 숨김, 툴팁 보이게 */
`;

const TitleList = styled.div`
    display: flex;
    gap: 24px;
    padding: 4px 8px 8px;
    overflow: visible; /* ✅ 스크롤 제거 (버튼으로 제어) */
    justify-content: center;
`;

const MotionTitleItem = styled(motion.div)<{ isEquipped?: boolean }>`
    position: relative;
    min-width: 90px;
    flex-shrink: 0;
    text-align: center;
    background: ${({ isEquipped }) => (isEquipped ? "#EFF6FF" : "#F9FAFB")};
    border: ${({ isEquipped }) =>
            isEquipped ? `1.5px solid ${theme.color.primary}` : "1px solid #E5E7EB"};
    border-radius: 14px;
    padding: 14px 8px;
    box-shadow: ${({ isEquipped }) =>
            isEquipped ? "0 4px 12px rgba(59,130,246,0.25)" : "0 3px 8px rgba(0,0,0,0.06)"};
    transition: all 0.25s ease;
    transform-origin: center; /* ✅ 확대 시 기준 중앙 고정 */
    z-index: 2; /* ✅ hover 시 툴팁 위로 올라오게 */

    &:hover {
        background: #f3f8ff;
        z-index: 3; /* ✅ 다른 카드보다 위로 */
        .tooltip {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, -6px); /* 위로 부드럽게 */
        }
    }

    .iconWrapper {
        position: relative;
    }

    img {
        width: 42px;
        height: 42px;
        margin-bottom: 6px;
        transition: transform 0.25s ease;
    }

    h4 {
        font-size: 13px;
        font-weight: 600;
        color: ${theme.color.text};
        margin-bottom: 2px;
    }

    p {
        font-size: 11px;
        color: ${theme.color.textMuted};
    }
`;

const Tooltip = styled.div`
    position: absolute;
    top: -50px; /* ✅ 카드 위쪽으로 이동 */
    left: 50%;
    transform: translateX(-50%) translateY(0);
    width: 150px;
    background: rgba(17, 24, 39, 0.9);
    color: white;
    font-size: 11px;
    line-height: 1.3;
    padding: 6px 8px;
    border-radius: 8px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    pointer-events: none;
    z-index: 10;
    backdrop-filter: blur(4px);

    &::after {
        content: "";
        position: absolute;
        bottom: -5px; /* ✅ 방향 반전 (위쪽에서 나오므로 삼각형 아래로) */
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid rgba(17, 24, 39, 0.9);
    }
`;

const EquippedBadge = styled.span`
    position: absolute;
    top: -4px;
    right: -6px;
    background: ${theme.color.primary};
    color: white;
    font-size: 9px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 6px;
`;

const NavButton = styled.button<{ position: "left" | "right" }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${({ position }) => (position === "left" ? "left: 8px;" : "right: 8px;")}
    font-size: 22px;
    font-weight: bold;
    color: rgb(75, 85, 99);
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover:not(:disabled) {
        color: ${theme.color.primary};
        transform: translateY(-50%) scale(1.2);
    }

    &:disabled {
        opacity: 0.3;
        cursor: default;
    }
`;

const EmptyWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
`;

const Empty = styled.p`
    margin: 0;
    color: #888;
    font-size: 14px;
`;
