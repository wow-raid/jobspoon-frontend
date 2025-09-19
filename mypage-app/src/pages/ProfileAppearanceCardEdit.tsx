{/* 프로필 외형 수정 -> 사용 안 할 예정 */}

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import defaultProfile from "../assets/default_profile.png";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import {
    fetchMyRanks,
    fetchMyTitles,
    equipRank,
    equipTitle,
    ProfileAppearanceResponse,
    HistoryItem,
} from "../api/profileAppearanceApi.ts";
import { updateNickname, NicknameResponse } from "../api/accountProfileApi.ts";

type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    refreshProfile: () => Promise<void>;
};

export default function ProfileAppearanceCardEdit() {
    const { profile, refreshProfile } = useOutletContext<OutletContextType>();

    // 서비스 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 닉네임 수정 상태
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [tempNickname, setTempNickname] = useState("");
    const [error, setError] = useState<string | null>(null);

    // 랭크 상태
    const [ranks, setRanks] = useState<HistoryItem[]>([]);
    const [showRanks, setShowRanks] = useState(false);

    // 칭호 상태
    const [titles, setTitles] = useState<HistoryItem[]>([]);
    const [showTitles, setShowTitles] = useState(false);

    // 랭크, 칭호 이력 가져오기
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) return;
        Promise.all([fetchMyRanks(token), fetchMyTitles(token)])
            .then(([r, t]) => {
                setRanks(r);
                setTitles(t);
            })
            .catch(console.error);
    }, []);

    // 랭크 장착 핸들러
    const handleEquipRank = async (rankId: number) => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            const updated = await equipRank(token, rankId);
            await refreshProfile();
            alert(`✅ ${updated.displayName} 랭크가 장착되었습니다!`);
        } catch (error: any) {
            alert(`❌ ${error.message || "랭크 장착에 실패했습니다."}`);
        }
    };

    // 칭호 장착 핸들러
    const handleEquipTitle = async (titleId: number) => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            const updated = await equipTitle(token, titleId);
            await refreshProfile();
            alert(`✅ ${updated.displayName} 칭호가 장착되었습니다!`);
        } catch (error: any) {
            alert(`❌ ${error.message || "칭호 장착에 실패했습니다."}`);
        }
    };

    /** 닉네임 수정 시작 */
    const handleStartEdit = () => {
        if (profile) {
            setTempNickname(profile.nickname); // ✅ customNickname → nickname
            setIsEditingNickname(true);
        }
    };

    /** 닉네임 저장 */
    const handleSaveNickname = async () => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            setError("로그인이 필요합니다.");
            return;
        }

        try {
            const updated: NicknameResponse = await updateNickname(
                token,
                tempNickname
            );
            await refreshProfile();
            setIsEditingNickname(false);
            setError(null);
        } catch (err: any) {
            setError(err.message || "닉네임 수정 실패");
        }
    };

    /** 닉네임 수정 취소 */
    const handleCancelEdit = () => {
        setTempNickname("");
        setIsEditingNickname(false);
        setError(null);
    };

    /** 모달 열기 */
    const openModal = () => {
        setIsModalOpen(true);
    };

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <Wrapper>
            {/* 기본정보 */}
            <Section>
                <SectionTitle>프로필 정보</SectionTitle>
                <InfoCard>
                    <TopRow>
                        <PhotoWrapper>
                            <Photo
                                src={profile.photoUrl || defaultProfile}
                                alt="프로필"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = defaultProfile;
                                }}
                            />
                        </PhotoWrapper>

                        <InfoText>
                            <NicknameRow>
                                {isEditingNickname ? (
                                    <NicknameInput
                                        type="text"
                                        value={tempNickname}
                                        onChange={(e) => setTempNickname(e.target.value)}
                                        placeholder="닉네임을 입력해주세요"
                                    />
                                ) : (
                                    <Nickname>{profile.nickname}</Nickname>
                                )}
                            </NicknameRow>
                            {error && <ErrorText>{error}</ErrorText>}

                            <Email>{profile.email}</Email>
                        </InfoText>

                        <ButtonGroup>
                            {isEditingNickname ? (
                                <Row>
                                    <SmallButton onClick={handleSaveNickname}>확인</SmallButton>
                                    <SmallButton onClick={handleCancelEdit}>취소</SmallButton>
                                </Row>
                            ) : (
                                <SmallButton onClick={handleStartEdit}>별명 수정</SmallButton>
                            )}
                            <SmallButton onClick={openModal}>사진 변경</SmallButton>
                        </ButtonGroup>
                    </TopRow>
                </InfoCard>
            </Section>

            {/* 이력 관리 */}
            <Section>
                <SectionTitle>이력 관리</SectionTitle>

                {/* 랭크 */}
                <Card>
                    <HistoryHeader>
                        <h3>등급 전체 이력</h3>
                        <ToggleButton onClick={() => setShowRanks(!showRanks)}>
                            {showRanks ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>

                    {profile.rank && (
                        <EquippedBox>
                            <span>{profile.rank.displayName}</span>
                            <span>장착 중</span>
                        </EquippedBox>
                    )}

                    {showRanks && (
                        ranks.length > 0 ? (
                            <ul>
                                {ranks.map((rank) => (
                                    <HistoryItemBox
                                        key={rank.id}
                                        active={profile.rank?.id === rank.id}
                                    >
                                        <span>
                                            {rank.displayName} (
                                            {new Date(rank.acquiredAt).toLocaleDateString()})
                                        </span>
                                        {profile?.rank?.id === rank.id ? (
                                            <EquipButton disabled>장착 중</EquipButton>
                                        ) : (
                                            <EquipButton onClick={() => handleEquipRank(rank.id)}>
                                                장착
                                            </EquipButton>
                                        )}
                                    </HistoryItemBox>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                                아직 획득한 등급이 없습니다.
                            </p>
                        )
                    )}
                </Card>

                {/* 칭호 */}
                <Card>
                    <HistoryHeader>
                        <h3>칭호 전체 이력</h3>
                        <ToggleButton onClick={() => setShowTitles(!showTitles)}>
                            {showTitles ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>

                    {profile.title && (
                        <EquippedBox>
                            <span>{profile.title.displayName}</span>
                            <span>장착 중</span>
                        </EquippedBox>
                    )}

                    {showTitles && (
                        titles.length > 0 ? (
                            <ul>
                                {titles.map((title) => (
                                    <HistoryItemBox
                                        key={title.id}
                                        active={profile.title?.id === title.id}
                                    >
                                        <span>
                                            {title.displayName} (
                                            {new Date(title.acquiredAt).toLocaleDateString()})
                                        </span>
                                        {profile?.title?.id === title.id ? (
                                            <EquipButton disabled>장착 중</EquipButton>
                                        ) : (
                                            <EquipButton onClick={() => handleEquipTitle(title.id)}>
                                                장착
                                            </EquipButton>
                                        )}
                                    </HistoryItemBox>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                                아직 획득한 칭호가 없습니다.
                            </p>
                        )
                    )}
                </Card>
            </Section>

            {/* 모달 */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
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

const InfoCard = styled.div`
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const TopRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 16px;
`;

const PhotoWrapper = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #e5e7eb;
    overflow: hidden;
`;

const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const InfoText = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const NicknameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Nickname = styled.div`
    font-size: 22px;
    font-weight: 700;
    color: #111827;
`;

const Email = styled.div`
    font-size: 14px;
    color: #6b7280;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
`;

const Row = styled.div`
    display: flex;
    gap: 6px;
    width: 100px;
`;

const SmallButton = styled.button`
    width: 100px;
    text-align: center;
    padding: 6px 0;
    font-size: 13px;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    color: #374151;

    &:hover {
        background: #f3f4f6;
    }

    ${Row} & {
        flex: 1;
        width: auto;
    }
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

const NicknameInput = styled.input`
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    border: none;
    border-bottom: 2px solid #3b82f6;
    padding: 4px 0;
    outline: none;
    width: 100%;

    &::placeholder {
        color: #9ca3af;
        font-weight: 500;
    }

    &:focus {
        border-color: #2563eb;
    }
`;

const ErrorText = styled.div`
    font-size: 13px;
    color: #dc2626;
    margin-top: 4px;
`;

const EquipButton = styled.button`
    margin-left: 8px;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 6px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    cursor: pointer;
    &:hover {
        background: #e5e7eb;
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

const EquippedBox = styled.div`
    border: 2px solid rgb(59, 130, 246);
    background: rgb(239, 246, 255);
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    span {
        font-weight: 600;
        font-size: 14px;
        color: rgb(29, 78, 216);
    }
`;

const HistoryItemBox = styled.li<{ active?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid ${({ active }) => (active ? "rgb(59,130,246)" : "rgb(229,231,235)")};
    background: ${({ active }) => (active ? "rgb(239,246,255)" : "white")};
    border-radius: 8px;
    padding: 8px 12px;
    margin-top: 6px;

    span {
        font-size: 14px;
        color: ${({ active }) => (active ? "rgb(29,78,216)" : "rgb(31,41,55)")};
        font-weight: ${({ active }) => (active ? 600 : 400)};
    }
`;
