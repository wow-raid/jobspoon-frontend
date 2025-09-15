{/* 프로필 외형 수정 */}

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    fetchMyRanks,
    fetchMyTitles,
    updateNickname,
    equipRank,
    equipTitle,
    HistoryItem,
    ProfileAppearanceResponse,
} from "../api/profileAppearanceApi.ts";
import ServiceModal from "../components/modals/ServiceModal.tsx"
import styled from "styled-components";
import defaultProfile from "../assets/default_profile.png";

type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    refreshProfile: () => Promise<void>;
}

export default function ProfileAppearanceCardEdit() {
    const {profile, refreshProfile} = useOutletContext<OutletContextType>();

    const [ranks, setRanks] = useState<HistoryItem[]>([]);
    const [titles, setTitles] = useState<HistoryItem[]>([]);
    const [showRanks, setShowRanks] = useState(false);
    const [showTitles, setShowTitles] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nicknameInput, setNicknameInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 이력 데이터 불러오기
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            return;
        }
        fetchMyRanks(token)
            .then(setRanks)
            .catch(console.error);
        fetchMyTitles(token)
            .then(setTitles)
            .catch(console.error);
    }, []);

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    // 닉네임 수정 핸들러
    const handleNicknameUpdate = async () => {
        const token = localStorage.getItem("userToken");
        if(!token){
            return;
        }
        if(!nicknameInput.trim()){
            setErrorMessage("닉네임을 입력하세요!");
            return;
        }
        try{
            await updateNickname(token, nicknameInput);
            await refreshProfile();
            setNicknameInput("");
            setErrorMessage("");
        }catch(error: any){
            setErrorMessage(error.message);
        }
    };

    // 랭크 장착 핸들러
    const handleEquipRank = async (rankId: number) => {
        const token = localStorage.getItem("userToken");
        if(!token){
            return;
        }
        try {
            const updated = await equipRank(token, rankId);
            await refreshProfile();
            alert(`${updated.displayName} 랭크가 장착되었습니다!`);
        }catch(error: any){
            alert(error.message || "랭크 장착에 실패했습니다.");
        }
    };

    // 칭호 장착 핸들러
    const handleEquipTitle = async (titleId: number) => {
        const token = localStorage.getItem("userToken");
        if(!token){
            return;
        }
        try{
            const updated = await equipTitle(token, titleId);
            await refreshProfile();
            alert(`${updated.displayName} 칭호가 장착되었습니다!`);
        }catch(error: any){
            alert(errorMessage || "칭호 장착에 실패했습니다.");
        }
    };

    return (
        <Card>
            <Title>프로필 외형 수정</Title>

            {/* 프로필 영역 */}
            <ProfileSection>
                <PhotoWrapper>
                    <Photo
                        src={profile.photoUrl || defaultProfile}
                        alt="프로필"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultProfile; // 이미지 깨질 경우에도 fallback
                        }}
                    />
                </PhotoWrapper>
                <PhotoButton onClick={() => setIsModalOpen(true)}>사진 변경</PhotoButton>
            </ProfileSection>

            {/* 닉네임 수정 */}
            <NicknameSection>
                <label>현재: {profile?.customNickname ?? "불러오는 중..."}</label>
                <NicknameForm>
                    <NicknameInput
                        type="text"
                        placeholder="닉네임 입력"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                    />
                    <SaveButton onClick={handleNicknameUpdate}>수정</SaveButton>
                </NicknameForm>
                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </NicknameSection>

            {/* 이력 카드 */}
            <HistoryGrid>
                {/* 등급 */}
                <HistoryCard>
                    <HistoryHeader>
                        <h3>등급 전체 이력</h3>
                        <ToggleButton onClick={() => setShowRanks(!showRanks)}>
                            {showRanks ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>

                    <Equipped>
                        <span>{profile.rank?.displayName}</span>
                        <span>장착 중</span>
                    </Equipped>

                    {showRanks && (
                        <HistoryList>
                            {ranks.map((rank) => (
                                <HistoryItemBox key={rank.code}>
                                    <span>
                                        {rank.displayName} (
                                        {new Date(rank.acquiredAt).toLocaleDateString()})
                                    </span>
                                    <EquipButton
                                        disabled={profile.rank?.id === rank.id}
                                        onClick={() => handleEquipRank(rank.id)}
                                    >
                                        {profile.rank?.id === rank.id ? "장착 중" : "장착"}
                                    </EquipButton>
                                </HistoryItemBox>
                            ))}
                        </HistoryList>
                    )}
                </HistoryCard>

                {/* 칭호 */}
                <HistoryCard>
                    <HistoryHeader>
                        <h3>칭호 전체 이력</h3>
                        <ToggleButton onClick={() => setShowTitles(!showTitles)}>
                            {showTitles ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>

                    <Equipped>
                        <span>{profile.title?.displayName}</span>
                        <span>장착 중</span>
                    </Equipped>

                    {showTitles && (
                        <HistoryList>
                            {titles.map((title) => (
                                <HistoryItemBox key={title.code}>
                                    <span>
                                        {title.displayName} (
                                        {new Date(title.acquiredAt).toLocaleDateString()})
                                    </span>
                                    <EquipButton
                                        disabled={profile.title?.id === title.id}
                                        onClick={() => handleEquipTitle(title.id)}
                                    >
                                        {profile.title?.id === title.id ? "장착 중" : "장착"}
                                    </EquipButton>
                                </HistoryItemBox>
                            ))}
                        </HistoryList>
                    )}
                </HistoryCard>
            </HistoryGrid>

            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Card>
    );
}

/* ================== styled-components ================== */

const Card = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const ProfileSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const PhotoWrapper = styled.div`
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: rgb(229, 231, 235);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
    overflow: hidden;
`;

const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NoPhoto = styled.span`
    font-size: 14px;
    color: rgb(107, 114, 128);
`;

const PhotoButton = styled.button`
    padding: 4px 16px;
    background: rgb(59, 130, 246);
    color: white;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background: rgb(37, 99, 235);
    }
`;

const NicknameSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
        font-size: 14px;
        color: rgb(75, 85, 99);
    }
`;

const NicknameForm = styled.div`
    display: flex;
    gap: 8px;
`;

const NicknameInput = styled.input`
    flex: 1;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgb(147, 197, 253);
    }
`;

const SaveButton = styled.button`
    padding: 8px 16px;
    background: rgb(34, 197, 94);
    color: white;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background: rgb(22, 163, 74);
    }
`;

const HistoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const HistoryCard = styled.div`
    padding: 16px;
    background: rgb(249, 250, 251);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 {
        font-weight: 600;
        color: rgb(31, 41, 55);
    }
`;

const HistoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ToggleButton = styled.button`
    font-size: 14px;
    color: rgb(59, 130, 246);
    border: none;
    background: transparent;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const Equipped = styled.div`
    border: 2px solid rgb(59, 130, 246);
    background: rgb(239, 246, 255);
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;

    span {
        font-weight: 500;
        font-size: 14px;
        color: rgb(29, 78, 216);
    }

    span:last-child {
        font-size: 12px;
        font-weight: 600;
    }
`;

const HistoryList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const HistoryItemBox = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgb(229, 231, 235);
    border-radius: 8px;
    padding: 8px 12px;

    span {
        font-size: 14px;
        color: rgb(31, 41, 55); /* ✅ 진한 글씨색 */
    }
`;

const EquipButton = styled.button`
    font-size: 12px;
    padding: 4px 8px;
    background: rgb(243, 244, 246);
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background: rgb(229, 231, 235);
    }

    &:disabled {
        background: transparent;
        color: rgb(37, 99, 235);
        font-weight: 600;
        cursor: default;
    }
`;

const ErrorText = styled.p`
    font-size: 13px;
    color: rgb(220, 38, 38);
    margin-top: 4px;
`;
