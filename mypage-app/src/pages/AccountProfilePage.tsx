import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import defaultProfile from "../assets/default_profile.png";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import TitleGuideModal from "../components/modals/TitleGuideModal.tsx";
import TrustScoreCriteriaModal from "../components/modals/TrustScoreCriteriaModal.tsx";
import { ProfileAppearanceResponse, uploadProfilePhoto } from "../api/profileAppearanceApi.ts";
import { updateNickname } from "../api/accountProfileApi.ts";
import TrustScoreHistoryGraph from "../components/history/TrustScoreHistoryGraph.tsx";
import { equipTitle, unequipTitle, UserTitleResponse } from "../api/userTitleApi.ts";
import { fetchTrustScore, TrustScoreResponse } from "../api/userTrustScoreApi.ts";
import {
    calcAttendanceScore,
    calcInterviewScore,
    calcProblemScore,
    calcPostScore,
    calcStudyroomScore,
    calcCommentScore,
} from "../utils/trustScoreUtils";
import { notifySuccess, notifyError, notifyInfo } from "../utils/toast";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

/* ================================
   Types
================================ */
type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    titles: UserTitleResponse[];
    refreshAll: () => Promise<void>;
};

type Status = "loading" | "empty" | "loaded";

/* ================================
   Component
================================ */
export default function AccountProfilePage() {
    const { profile, titles, refreshAll } = useOutletContext<OutletContextType>();

    const [trustScore, setTrustScore] = useState<TrustScoreResponse | null>(null);
    const [trustStatus, setTrustStatus] = useState<Status>("loading");
    const [isTrustCriteriaOpen, setIsTrustCriteriaOpen] = useState(false);
    const [isTitleGuideOpen, setIsTitleGuideOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [animatedId, setAnimatedId] = useState<number | null>(null);

    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [tempNickname, setTempNickname] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ---------------- 신뢰점수 불러오기 ---------------- */
    useEffect(() => {
        const loadTrust = async () => {
            try {
                const trust = await fetchTrustScore();
                setTrustScore(trust || null);
                setTrustStatus(trust ? "loaded" : "empty");
            } catch (err) {
                console.error(err);
                setTrustStatus("empty");
            }
        };
        loadTrust();
    }, []);

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

                // 🎆 Confetti 효과
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#007AFF", "#34C759", "#FF9500", "#FF2D55", "#5E5CE6"]
                });

                setAnimatedId(titleId);
                setTimeout(() => setAnimatedId(null), 800);
            }
        } catch (error: any) {
            notifyError(error.message || "칭호 장착/해제 실패 ❌");
        }
    };

    if (!profile) return <p>불러오는 중...</p>;

    return (
        <Wrapper>
            {/* ================= 회원정보 ================= */}
            <Section>
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
            </Section>

            {/* ================= 활동 이력 ================= */}
            <Section>
                <SectionTitle>활동 이력</SectionTitle>

                {/* 활동 점수 요약 */}
                <BaseCard>
                    <CardHeader>
                        <h3>활동 점수 요약</h3>
                    </CardHeader>

                    {trustStatus === "loading" ? (
                        <Empty>불러오는 중...</Empty>
                    ) : trustStatus === "empty" ? (
                        <Empty>신뢰점수가 없습니다.</Empty>
                    ) : (
                        <>
                            <TrustGrid>
                                <TrustItemCard>
                                    <TrustLabel>출석률</TrustLabel>
                                    <ProgressBar percent={(calcAttendanceScore(trustScore!.attendanceRate) / 25) * 100} />
                                    <TrustCount>
                                        {calcAttendanceScore(trustScore!.attendanceRate).toFixed(1)} / 25점
                                    </TrustCount>
                                </TrustItemCard>
                                <TrustItemCard>
                                    <TrustLabel>모의면접</TrustLabel>
                                    <ProgressBar percent={(calcInterviewScore(trustScore!.monthlyInterviews) / 20) * 100} />
                                    <TrustCount>{calcInterviewScore(trustScore!.monthlyInterviews)} / 20점</TrustCount>
                                </TrustItemCard>
                                <TrustItemCard>
                                    <TrustLabel>문제풀이</TrustLabel>
                                    <ProgressBar percent={(calcProblemScore(trustScore!.monthlyProblems) / 20) * 100} />
                                    <TrustCount>{calcProblemScore(trustScore!.monthlyProblems)} / 20점</TrustCount>
                                </TrustItemCard>
                                <TrustItemCard>
                                    <TrustLabel>글 작성</TrustLabel>
                                    <ProgressBar percent={(calcPostScore(trustScore!.monthlyPosts) / 15) * 100} />
                                    <TrustCount>{calcPostScore(trustScore!.monthlyPosts)} / 15점</TrustCount>
                                </TrustItemCard>
                                <TrustItemCard>
                                    <TrustLabel>스터디룸</TrustLabel>
                                    <ProgressBar percent={(calcStudyroomScore(trustScore!.monthlyStudyrooms) / 10) * 100} />
                                    <TrustCount>{calcStudyroomScore(trustScore!.monthlyStudyrooms)} / 10점</TrustCount>
                                </TrustItemCard>
                                <TrustItemCard>
                                    <TrustLabel>댓글</TrustLabel>
                                    <ProgressBar percent={(calcCommentScore(trustScore!.monthlyComments) / 15) * 100} />
                                    <TrustCount>{calcCommentScore(trustScore!.monthlyComments)} / 15점</TrustCount>
                                </TrustItemCard>
                            </TrustGrid>
                            <TrustTotal>
                                총점 <strong>{trustScore?.totalScore?.toFixed(1) ?? "0.0"}</strong> / 100점
                            </TrustTotal>

                            <FooterRight>
                                <ToggleButton onClick={() => setIsTrustCriteriaOpen(true)}>
                                    산정 기준
                                </ToggleButton>
                            </FooterRight>
                        </>
                    )}
                </BaseCard>

                {/* 활동 점수 변화 추이 */}
                <BaseCard>
                    <CardHeader>
                        <HeaderLeft>
                            <h3>활동 점수 변화 추이</h3>
                        </HeaderLeft>
                    </CardHeader>

                    <GraphSummary>
                        <h4>
                            이번 달 활동 점수: <strong>{trustScore?.totalScore?.toFixed(1) ?? "0.0"}점</strong>
                        </h4>
                        <ChangeTag up>▲ 2.0 상승</ChangeTag>
                    </GraphSummary>

                    <GraphNotice>
                        현재 그래프는 <strong>지난달까지의 기록</strong>이며,{" "}
                        <strong>이번 달 점수</strong>는 실시간으로 반영 중입니다.
                    </GraphNotice>

                    <GraphWrapper>
                        <TrustScoreHistoryGraph />
                    </GraphWrapper>
                </BaseCard>

                {/* ================= 칭호 이력 ================= */}
                <BaseCard>
                    <CardHeader>
                        <HeaderLeft>
                            <h3>획득한 칭호</h3>
                        </HeaderLeft>
                    </CardHeader>

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
                                    <BadgeDate>획득일 {new Date(title.acquiredAt).toLocaleDateString()}</BadgeDate>
                                    <BadgeButton equipped={title.equipped}>{title.equipped ? "해제" : "장착"}</BadgeButton>
                                </BadgeCard>
                            ))}
                        </TitleGrid>
                    )}

                    <FooterRight>
                        <ToggleButton onClick={() => setIsTitleGuideOpen(true)}>
                            칭호 가이드
                        </ToggleButton>
                    </FooterRight>
                </BaseCard>
            </Section>

            {/* 모달 */}
            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <TitleGuideModal isOpen={isTitleGuideOpen} onClose={() => setIsTitleGuideOpen(false)} />
            <TrustScoreCriteriaModal isOpen={isTrustCriteriaOpen} onClose={() => setIsTrustCriteriaOpen(false)} />

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

/* ================== styled-components ================== */
export const Wrapper = styled.div`
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
    gap: 32px; /* 핵심: 카드들 사이 여백 */
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  //color: #1e3a8a;
    color: #111827;
    margin-bottom: 20px;
`;

/* ---------- 회원정보 ---------- */

export const InfoCard = styled.div`
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 32px 36px;
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
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(59, 130, 246, 0.15);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: scale(1.05);
    }
`;

export const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
`;

export const Spinner = styled.div`
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

export const NicknameArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    h3 {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
    }
`;

export const NicknameInput = styled.input.attrs({
    spellCheck: false,
})`
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    border: none;
    outline: none;
    background: transparent;
    padding: 4px 0;
    min-width: 150px;
    border-bottom: 2px solid rgba(0,0,0,0.08);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;

    &:focus {
        border-color: transparent;
        box-shadow: 0 3px 0 0 rgba(59, 130, 246, 0.5);
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
    color: #6b7280;
    background: #ffffff;
    cursor: pointer;
    transition: 0.25s ease;
    &:hover {
        border-color: #3b82f6;
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.05);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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
    font-size: 15px;
    color: #6b7280;
    span {
        color: #111827;
        font-weight: 500;
    }
`;

/* ---------- 모달 (프로필 확대) ---------- */
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.25s ease;
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

export const ModalContent = styled.div`
    background: transparent;
    padding: 0;
`;

export const LargeImage = styled.img`
    width: 400px;
    height: 400px;
    object-fit: cover;
    border-radius: 12px;
    border: 3px solid white;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    animation: zoomIn 0.25s ease;
    @keyframes zoomIn {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    @media (max-width: 768px) {
        width: 80vw;
        height: 80vw;
    }
`;

/* ---------- 활동 이력 ---------- */
export const BaseCard = styled.div`
    background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
    border: 1px solid #e0e7ff;
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.08);
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
        font-size: 18px;
        font-weight: 700;
        //color: #1e3a8a;
        color: #111827;
        display: flex;
        align-items: center;
        gap: 6px;
    }
`;

export const ToggleButton = styled.button`
    font-size: 13px;
    color: #3b82f6;
    border: none;
    background: none;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

/* 2행 3열 */
const TrustGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px 20px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;


export const TrustItemCard = styled.div`
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: 0.25s ease;
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15);
    }
`;

export const TrustLabel = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
`;

export const ProgressBar = styled.div<{ percent: number }>`
    width: 100%;
    height: 12px;
    background: #f3f4f6;
    border-radius: 6px;
    margin-top: 6px;
    position: relative;
    overflow: hidden;
    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: ${({ percent }) => percent}%;
        background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
        border-radius: 6px;
        transition: width 0.3s ease;
    }
`;

export const TrustCount = styled.div`
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-top: 4px;
`;

export const TrustTotal = styled.div`
    text-align: center;
    margin-top: 8px;
    font-size: 17px;
    font-weight: 700;
    color: #2563eb;
    background: rgba(59, 130, 246, 0.08);
    border-radius: 10px;
    padding: 10px 0;
    strong {
        font-size: 18px;
        color: #1d4ed8;
    }
`;

export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const GraphSummary = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-top: 2px;
    h4 {
        font-weight: 600;
    }
    strong {
        color: #2563eb;
        font-size: 16px;
    }
`;

export const ChangeTag = styled.span<{ up?: boolean }>`
    font-size: 13px;
    font-weight: 700;
    color: ${({ up }) => (up ? "#059669" : "#dc2626")};
    background: ${({ up }) => (up ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)")};
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: -0.3px;
`;

export const GraphNotice = styled.p`
    font-size: 12.5px;
    color: #6b7280;
    margin-top: 4px;
    margin-bottom: 8px;
    strong {
        color: #2563eb;
    }
`;

export const GraphWrapper = styled.div`
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    padding: 10px 16px;
    transition: 0.3s ease;
    &:hover {
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
        transform: translateY(-1px);
    }
`;

export const Empty = styled.p`
    font-size: 14px;
    color: #888;
    text-align: center;
    margin: 12px 0;
`;

/* ---------- 칭호 ---------- */
export const TitleGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
`;

export const BadgeCard = styled(motion.div)<{ equipped: boolean }>`
    position: relative;
    border: 1.5px solid ${({ equipped }) => (equipped ? "#3B82F6" : "#E5E7EB")};
    background: ${({ equipped }) =>
            equipped
                    ? "linear-gradient(180deg, rgba(59,130,246,0.08), rgba(147,197,253,0.15))"
                    : "white"};
    border-radius: 14px;
    box-shadow: ${({ equipped }) =>
            equipped ? "0 0 12px rgba(59,130,246,0.3)" : "0 2px 8px rgba(0,0,0,0.04)"};
    padding: 18px 12px 16px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
    }
`;

export const BadgeIcon = styled.div<{ equipped: boolean }>`
    font-size: 28px;
    margin-bottom: 8px;
    filter: ${({ equipped }) =>
            equipped ? "drop-shadow(0 0 6px rgba(59,130,246,0.5))" : "none"};
`;

export const BadgeName = styled.div<{ equipped: boolean }>`
    font-size: 15px;
    font-weight: 700;
    color: ${({ equipped }) => (equipped ? "#1D4ED8" : "#111827")};
`;

export const BadgeDesc = styled.p`
    font-size: 12.5px;
    color: #6b7280;
    margin: 6px 0 8px;
    line-height: 1.3;
`;

export const BadgeDate = styled.span`
    font-size: 11.5px;
    color: #9ca3af;
`;

export const BadgeButton = styled.button<{ equipped: boolean }>`
    margin-top: 10px;
    padding: 5px 12px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    background: ${({ equipped }) =>
            equipped ? "rgba(59,130,246,0.15)" : "#ffffff"};
    border: 1px solid ${({ equipped }) => (equipped ? "#3B82F6" : "#E5E7EB")};
    color: ${({ equipped }) => (equipped ? "#1D4ED8" : "#374151")};
    cursor: pointer;
    transition: 0.25s ease;
    &:hover {
        background: ${({ equipped }) =>
                equipped ? "rgba(59,130,246,0.25)" : "#F3F4F6"};
    }
`;

export const EquippedRibbon = styled.span`
    position: absolute;
    top: 10px;
    right: -25px;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 26px;
    transform: rotate(45deg);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    pointer-events: none;
`;

const FooterRight = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
`;
