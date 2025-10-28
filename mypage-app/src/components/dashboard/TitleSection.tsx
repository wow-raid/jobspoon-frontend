import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { fetchMyProfile, ProfileAppearanceResponse } from "../../api/profileAppearanceApi.ts";
import { fetchMyTitles, UserTitleResponse } from "../../api/userTitleApi.ts";
import styled from "styled-components";
import defaultTitle from "../../assets/default_rank.png";
import TitleGuideModal from "../modals/TitleGuideModal.tsx";
import { notifyError } from "../../utils/toast";
import { motion } from "framer-motion";

export default function TitleSection() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [titles, setTitles] = useState<UserTitleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;
    const prevCount = useRef(0);

    const handlePrev = () => setCurrentIndex((p) => Math.max(p - 1, 0));
    const handleNext = () => setCurrentIndex((p) => Math.min(p + 1, Math.max(titles.length - visibleCount, 0)));

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
                    const sorted = [...titlesRes.value].sort(
                        (a, b) => new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime()
                    );
                    if (prevCount.current && sorted.length > prevCount.current) triggerConfetti();
                    prevCount.current = sorted.length;
                    setTitles(sorted);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const triggerConfetti = () => {
        const duration = 2000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors: ["#4F46E5", "#60A5FA", "#93C5FD"] });
            confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors: ["#4F46E5", "#60A5FA", "#93C5FD"] });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    };

    if (loading) return <p>불러오는 중...</p>;

    const equipped = titles.find((t) => t.equipped);

    return (
        <>
            <ContentGrid>
                <CurrentTitleCard>
                    {equipped ? (
                        <>
                            <Badge>현재 장착 중</Badge>
                            <img src={defaultTitle} alt={equipped.displayName} />
                            <h3>{equipped.displayName}</h3>
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

                <TitleListCard>
                    <TitleListHeader>
                        <span>획득 개수 {titles.length}개</span>
                    </TitleListHeader>

                    {titles.length === 0 ? (
                        <EmptyWrapper><Empty>아직 획득한 칭호가 없습니다.</Empty></EmptyWrapper>
                    ) : (
                        <PreviewWrapper>
                            <NavButton position="left" onClick={handlePrev} disabled={currentIndex === 0}>{"<"}</NavButton>
                            <TitleList>
                                {titles.slice(currentIndex, currentIndex + visibleCount).map((t) => (
                                    <MotionTitleItem key={t.id} isEquipped={t.equipped}
                                                     whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 250, damping: 15 }}>
                                        <div className="iconWrapper">
                                            <img src={defaultTitle} alt={t.displayName} />
                                            {t.equipped && <EquippedBadge>장착</EquippedBadge>}
                                        </div>
                                        <h4>{t.displayName}</h4>
                                        <p>{new Date(t.acquiredAt).toLocaleDateString()}</p>
                                        <Tooltip className="tooltip">{t.description}</Tooltip>
                                    </MotionTitleItem>
                                ))}
                            </TitleList>
                            <NavButton position="right" onClick={handleNext} disabled={currentIndex >= titles.length - visibleCount}>{">"}</NavButton>
                        </PreviewWrapper>
                    )}
                </TitleListCard>
            </ContentGrid>

            <SectionHeader>
                <GuideButton onClick={() => setIsGuideOpen(true)}>칭호 가이드</GuideButton>
            </SectionHeader>

            <TitleGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </>
    );
}

/* ================= styled-components ================= */
const SectionHeader = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const GuideButton = styled.button`
    font-size: 13px;
    color: #3B82F6;
    background: transparent;
    border: none;
    cursor: pointer;
    font-weight: 600;
    &:hover { text-decoration: underline; }
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
    @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const CurrentTitleCard = styled.div`
    position: relative;
    background: linear-gradient(145deg, #f8fbff, #eef4ff);
    border: 1.5px solid #3B82F6;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 28px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    img { width: 80px; height: 80px; margin-bottom: 8px; object-fit: contain; }
    h3 { font-size: 18px; font-weight: 700; color: #111827; }
    p { font-size: 13px; color: #6B7280; }
`;

const Badge = styled.div`
    position: absolute;
    top: 14px;
    right: 14px;
    background: #3B82F6;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 8px;
`;

const TitleListCard = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 24px;
    display: flex;
    flex-direction: column;
`;

const TitleListHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    font-weight: 600;
    color: #6B7280;
`;

const PreviewWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TitleList = styled.div`
    display: flex;
    gap: 24px;
    padding: 4px 8px;
    justify-content: center;
`;

const MotionTitleItem = styled(motion.div)<{ isEquipped?: boolean }>`
    position: relative;
    min-width: 90px;
    text-align: center;
    background: ${({ isEquipped }) => (isEquipped ? "#EFF6FF" : "#F9FAFB")};
    border: ${({ isEquipped }) => (isEquipped ? "1.5px solid #3B82F6" : "1px solid #E5E7EB")};
    border-radius: 14px;
    padding: 14px 8px;
    box-shadow: ${({ isEquipped }) =>
            isEquipped ? "0 4px 12px rgba(59,130,246,0.25)" : "0 3px 8px rgba(0,0,0,0.06)"};
    transition: all 0.25s ease;
    &:hover .tooltip { opacity: 1; visibility: visible; transform: translate(-50%, -6px); }
    h4 { font-size: 13px; font-weight: 600; color: #111827; }
    p { font-size: 11px; color: #6B7280; }
`;

const Tooltip = styled.div`
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    background: rgba(17, 24, 39, 0.9);
    color: white;
    font-size: 11px;
    padding: 6px 8px;
    border-radius: 8px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    &::after {
        content: "";
        position: absolute;
        bottom: -5px;
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
    background: #3B82F6;
    color: white;
    font-size: 9px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 6px;
`;

const NavButton = styled.button<{ position: "left" | "right" }>`
    position: absolute;
    top: 50%;
    ${({ position }) => (position === "left" ? "left: 8px;" : "right: 8px;")}
    font-size: 22px;
    font-weight: bold;
    color: #4B5563;
    background: transparent;
    border: none;
    cursor: pointer;
    &:hover:not(:disabled) {
        color: #3B82F6;
        transform: scale(1.2);
    }
    &:disabled { opacity: 0.3; cursor: default; }
`;

const EmptyWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
`;

const Empty = styled.p`
    color: #888;
    font-size: 14px;
`;
