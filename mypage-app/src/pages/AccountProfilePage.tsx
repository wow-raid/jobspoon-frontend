import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import defaultProfile from "../assets/default_profile.png";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import TitleGuideModal from "../components/modals/TitleGuideModal.tsx";
import { ProfileAppearanceResponse, uploadProfilePhoto } from "../api/profileAppearanceApi.ts";
import { updateNickname } from "../api/accountProfileApi.ts";
import { equipTitle, unequipTitle, UserTitleResponse } from "../api/userTitleApi.ts";
import { notifySuccess, notifyError, notifyInfo } from "../utils/toast";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

/* ---------- Types ---------- */
type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    titles: UserTitleResponse[];
    refreshAll: () => Promise<void>;
};

/* ---------- Component ---------- */
export default function AccountProfilePage() {
    const { profile, titles, refreshAll } = useOutletContext<OutletContextType>();

    const [isTitleGuideOpen, setIsTitleGuideOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [tempNickname, setTempNickname] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ---------------- 닉네임 수정 ---------------- */
    const handleStartEdit = () => {
        if (profile) {
            setTempNickname(profile.nickname);
            setIsEditingNickname(true);
        }
    };

    const handleSaveNickname = async () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            notifyInfo("로그인이 필요합니다 🔒");
            return;
        }
        try {
            await updateNickname(tempNickname);
            await refreshAll();
            setIsEditingNickname(false);
            notifySuccess("닉네임이 성공적으로 변경되었습니다 ✨");
        } catch (err: any) {
            notifyError(err.message || "닉네임 수정 실패 ❌");
        }
    };

    const handleCancelEdit = () => {
        setTempNickname("");
        setIsEditingNickname(false);
    };

    /* ---------------- 사진 업로드 ---------------- */
    const handleFileClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            notifyInfo("로그인이 필요합니다 🔒");
            return;
        }

        try {
            setIsUploading(true);
            await uploadProfilePhoto(file);
            await refreshAll();
            notifySuccess("프로필 사진이 변경되었습니다 📸");
        } catch (err: any) {
            notifyError(err.message || "사진 업로드 실패 ❌");
        } finally {
            setIsUploading(false);
        }
    };

    /* ---------------- 칭호 장착/해제 ---------------- */
    const handleEquip = async (titleId: number) => {
        try {
            const target = titles.find((t) => t.id === titleId);

            if (target?.equipped) {
                await unequipTitle();
                await refreshAll();
                notifyInfo("칭호가 해제되었습니다 💤");
            } else {
                const updated = await equipTitle(titleId);
                await refreshAll();
                notifySuccess(`「${updated.displayName}」 칭호가 장착되었습니다 🎉`);

                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#007AFF", "#34C759", "#FF9500", "#FF2D55", "#5E5CE6"],
                });
            }
        } catch (error: any) {
            notifyError(error.message || "칭호 장착/해제 실패 ❌");
        }
    };

    if (!profile) return <p>불러오는 중...</p>;

    return (
        <Wrapper>
            {/* ================= 회원정보 ================= */}
            <ProfileSection>
                <SectionTitle>회원정보</SectionTitle>
                <InfoCard>
                    <ProfileRow>
                        <ProfileLeft>
                            <PhotoWrapper>
                                {isUploading ? (
                                    <Spinner />
                                ) : (
                                    <Photo
                                        src={profile.photoUrl || defaultProfile}
                                        alt="프로필"
                                        onError={(e) => ((e.target as HTMLImageElement).src = defaultProfile)}
                                        onClick={() => setIsImageModalOpen(true)}
                                    />
                                )}
                            </PhotoWrapper>

                            <NicknameArea>
                                {isEditingNickname ? (
                                    <NicknameInput
                                        value={tempNickname}
                                        onChange={(e) => setTempNickname(e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    <h3>{profile.nickname}</h3>
                                )}
                            </NicknameArea>
                        </ProfileLeft>

                        <ButtonGroup>
                            {isEditingNickname ? (
                                <div style={{ display: "flex", gap: "6px" }}>
                                    <SoftButton onClick={handleSaveNickname}>확인</SoftButton>
                                    <SoftButton onClick={handleCancelEdit}>취소</SoftButton>
                                </div>
                            ) : (
                                <SoftButton onClick={handleStartEdit}>별명 수정</SoftButton>
                            )}
                            <SoftButton onClick={handleFileClick} disabled={isUploading}>
                                {isUploading ? "업로드 중..." : "사진 변경"}
                            </SoftButton>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </ButtonGroup>
                    </ProfileRow>

                    <InfoList>
                        <InfoItem>
                            <FaEnvelope />
                            <span>{profile.email}</span>
                        </InfoItem>
                        <InfoItem>
                            <FaLock />
                            <span>가입일: -</span>
                        </InfoItem>
                    </InfoList>
                </InfoCard>
            </ProfileSection>

            {/* ================= 칭호 이력 ================= */}
            <Section>
                <SectionTitle>획득한 칭호</SectionTitle>
                <BaseCard>
                    {titles.length === 0 ? (
                        <Empty>획득한 칭호가 없습니다.</Empty>
                    ) : (
                        <TitleGrid>
                            {titles.map((title) => (
                                <BadgeCard
                                    key={title.id}
                                    equipped={title.equipped}
                                    onClick={() => handleEquip(title.id)}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {title.equipped && <EquippedRibbon>착용 중</EquippedRibbon>}
                                    <BadgeIcon equipped={title.equipped}>🏅</BadgeIcon>
                                    <BadgeName equipped={title.equipped}>{title.displayName}</BadgeName>
                                    <BadgeDesc>{title.description}</BadgeDesc>
                                    <BadgeDate>
                                        획득일 {new Date(title.acquiredAt).toLocaleDateString()}
                                    </BadgeDate>
                                    <BadgeButton equipped={title.equipped}>
                                        {title.equipped ? "해제" : "장착"}
                                    </BadgeButton>
                                </BadgeCard>
                            ))}
                        </TitleGrid>
                    )}
                </BaseCard>

                <FooterRight>
                    <ToggleButton onClick={() => setIsTitleGuideOpen(true)}>칭호 가이드</ToggleButton>
                </FooterRight>
            </Section>

            {/* 모달 */}
            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <TitleGuideModal isOpen={isTitleGuideOpen} onClose={() => setIsTitleGuideOpen(false)} />

            {isImageModalOpen && (
                <ModalOverlay onClick={() => setIsImageModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <LargeImage src={profile.photoUrl || defaultProfile} alt="profile-large" />
                    </ModalContent>
                </ModalOverlay>
            )}
        </Wrapper>
    );
}

/* ================================   Styled Components   ================================ */
const fadeUp = keyframes`
  from { opacity: 0; margin-top: 16px; }
  to { opacity: 1; margin-top: 0; }
`;

export const Wrapper = styled.div`
    animation: ${fadeUp} 0.6s ease both;
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const Section = styled.section`
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const ProfileSection = styled.section`
    background: linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%);
    border: 1px solid rgba(76, 196, 168, 0.35);
    border-radius: 16px;
    padding: 32px 36px;
    box-shadow: 0 4px 12px rgba(76, 196, 168, 0.22);
    display: flex;
    flex-direction: column;
    gap: 28px;
    animation: ${fadeUp} 0.6s ease both;
`;

export const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 20px;
`;

/* ---------- 회원정보 ---------- */
export const InfoCard = styled.div`
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 32px 36px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const ProfileRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
`;

export const ProfileLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const PhotoWrapper = styled.div`
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 2px solid #3b82f6;
    background: linear-gradient(145deg, #f8fbff, #eef4ff);
    box-shadow: 0 3px 10px rgba(59, 130, 246, 0.15);
    overflow: hidden;
    cursor: pointer;
`;

export const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    transition: transform 0.3s ease;
    &:hover { transform: scale(1.05); }
`;

export const Spinner = styled.div`
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
    @keyframes spin { to { transform: rotate(360deg); } }
`;

export const NicknameArea = styled.div`
    display: flex;
    flex-direction: column;
    h3 { font-size: 20px; font-weight: 700; color: #111827; }
`;

export const NicknameInput = styled.input`
    font-size: 18px;
    font-weight: 500;
    color: #1c1c1e;
    background: transparent;
    border: none;
    border-bottom: 1.5px solid #d2d2d7;
    padding: 6px 4px;
    outline: none;
    width: 160px;
    transition: border-color 0.2s ease;

    &:hover {
        border-bottom-color: #a1a1aa;
    }

    &:focus {
        border-bottom-color: #007aff;
    }

    &::placeholder {
        color: #a1a1a6;
        font-weight: 400;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
`;

export const SoftButton = styled.button`
    font-size: 13px;
    padding: 6px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    color: #6b7280;
    cursor: pointer;
    transition: 0.25s;
    &:hover {
        border-color: #3b82f6;
        color: #3b82f6;
        background: rgba(59,130,246,0.05);
    }
`;

export const InfoList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
`;

export const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #6b7280;
    span {
        color: #111827;
        font-weight: 400;
    }
`;

/* ---------- 모달 ---------- */
export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

export const ModalContent = styled.div`background: transparent;`;
export const LargeImage = styled.img`
    width: 400px;
    height: 400px;
    object-fit: cover;
    border-radius: 12px;
    border: 3px solid #fff;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
`;

/* ---------- 칭호 ---------- */
export const BaseCard = styled.div`
    border: 1px solid #E5E7EB; /* 🔹 아주 옅은 회색 테두리 */
    border-radius: 14px;
    padding: 24px 28px;
    background: #fff; /* 🔹 배경은 유지 (필요 시 제거 가능) */
`;

export const Empty = styled.p`
    font-size: 14px;
    color: #888;
    text-align: center;
`;

export const TitleGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
`;

export const BadgeCard = styled(motion.div)<{ equipped: boolean }>`
    position: relative;
    border: 1.5px solid ${({ equipped }) =>
            equipped ? "#4CC4A8" : "rgba(229,231,235,1)"};
    background: ${({ equipped }) =>
            equipped
                    ? "linear-gradient(180deg, rgba(76,196,168,0.08) 0%, rgba(59,130,246,0.05) 100%)"
                    : "#fff"};
    border-radius: 14px;
    padding: 18px 12px 48px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 14px rgba(76, 196, 168, 0.25);
    }
`;

export const EquippedRibbon = styled.span`
    position: absolute;
    top: 10px;
    right: -22px;
    background: linear-gradient(90deg, #43d0b2, #25a58b);
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 24px;
    transform: rotate(45deg);
    box-shadow: 0 2px 5px rgba(76, 196, 168, 0.25);
`;

export const BadgeIcon = styled.div<{ equipped: boolean }>`
    font-size: 28px;
    margin-bottom: 8px;
    filter: ${({ equipped }) =>
            equipped ? "drop-shadow(0 0 6px rgba(76,196,168,0.5))" : "none"};
`;

export const BadgeName = styled.div<{ equipped: boolean }>`
    font-size: 15px;
    font-weight: 700;
    color: ${({ equipped }) => (equipped ? "#0E766E" : "#111827")};
`;

export const BadgeDesc = styled.p`
    font-size: 12.5px;
    color: #6b7280;
    margin: 6px 0 8px;
`;

export const BadgeDate = styled.span`
    font-size: 11.5px;
    color: #9ca3af;
`;

export const BadgeButton = styled.button<{ equipped: boolean }>`
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    background: ${({ equipped }) => (equipped ? "rgba(76,196,168,0.15)" : "#fff")};
    border: 1px solid ${({ equipped }) => (equipped ? "#4CC4A8" : "#E5E7EB")};
    color: ${({ equipped }) => (equipped ? "#0E766E" : "#374151")};
    transition: 0.2s ease;
    cursor: pointer;

    &:hover {
        filter: brightness(1.05);
        transform: translate(-50%, -1px);
    }
`;

export const FooterRight = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
`;

export const ToggleButton = styled.button`
    font-size: 13px;
    color: #3AB49A;
    border: none;
    background: none;
    cursor: pointer;
    &:hover { text-decoration: underline; }
`;
