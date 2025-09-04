import React, { useEffect, useState } from "react";
import {
    fetchMyProfile,
    fetchMyRanks,
    fetchMyTitles,
    updateNickname,
    HistoryItem,
    ProfileAppearanceResponse,
} from "../api/profileAppearanceApi.ts";
import ServiceModal from "./ServiceModal.tsx";
import styled from "styled-components";

export default function ProfileAppearanceCardEdit() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [ranks, setRanks] = useState<HistoryItem[]>([]);
    const [titles, setTitles] = useState<HistoryItem[]>([]);
    const [showRanks, setShowRanks] = useState(false);
    const [showTitles, setShowTitles] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nicknameInput, setNicknameInput] = useState("");

    // 닉네임 수정 핸들러
    const handleNicknameUpdate = async () => {
        const token = "test-token2";

        if(!nicknameInput.trim()){
            alert("닉네임을 입력하세요!");
            return;
        }

        try {
            const updated = await updateNickname(token, nicknameInput);
            setProfile((prev) =>
                prev ? {...prev, customNickname: updated.customNickname} : prev
            );
            alert("닉네임이 변경되었습니다!");
            setNicknameInput(""); // 입력창 초기화
        } catch (error: any) {
            alert(error.message); // 서버 정책 위반 메시지 그대로 표시
        }
    };

    useEffect(() => {
        const token = "test-token2";
        fetchMyProfile(token).then(setProfile).catch(console.error);
        fetchMyRanks(token).then(setRanks).catch(console.error);
        fetchMyTitles(token).then(setTitles).catch(console.error);
    }, []);

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <Card>
            {/* 제목 */}
            <Title>프로필 외형 수정</Title>

            {/* 상단 프로필 영역 */}
            <ProfileSection>
                <PhotoWrapper>
                    {profile.photoUrl ? (
                        <Photo src={profile.photoUrl} alt="프로필" />
                    ) : (
                        <NoPhoto>사진</NoPhoto>
                    )}
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
                        onChange={(e) => setNicknameInput(e.target.value)} // ✅ 수정
                    />
                    <SaveButton onClick={handleNicknameUpdate}>수정</SaveButton> {/* ✅ onClick 추가 */}
                </NicknameForm>
            </NicknameSection>

            <HistoryGrid>
                {/* 랭크 카드 */}
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
                                    <EquipButton>장착</EquipButton>
                                </HistoryItemBox>
                            ))}
                        </HistoryList>
                    )}
                </HistoryCard>

                {/* 칭호 카드 */}
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
                                    <EquipButton>장착</EquipButton>
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
  border-radius: 8px;
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
  border-radius: 8px;
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
`;

const EquipButton = styled.button`
  font-size: 12px;
  padding: 4px 8px;
  background: rgb(243, 244, 246);
  border-radius: 4px;
  &:hover {
    background: rgb(229, 231, 235);
  }
`;