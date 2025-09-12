import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

import defaultProfile from "../assets/default_profile.png";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import {
    updateNickname,
    fetchMyRanks,
    CustomNicknameResponse,
    ProfileAppearanceResponse,
    HistoryItem, equipRank,
} from "../api/profileAppearanceApi.ts";

type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    refreshProfile: () => Promise<void>;
};

export default function AccountProfileEdit() {
    const { profile, refreshProfile } = useOutletContext<OutletContextType>();

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    // modalType 타입 확장
    const [modalType, setModalType] = useState<"phone" | "email" | "photo" | null>(null);

    // 닉네임 수정 상태
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [tempNickname, setTempNickname] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [ranks, setRanks] = useState<HistoryItem[]>([]);
    const [showRanks, setShowRanks] = useState(false);

    // TODO: AccountProfile API 나오면 교체
    const [accountInfo] = useState({
        phone: "",
        email: "TestUser01@kakao.com",
    });

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if(!token){
            return;
        }
        fetchMyRanks(token)
            .then(setRanks)
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

            // 성공 메시지
            alert(`✅ ${updated.displayName} 랭크가 장착되었습니다!`);
        } catch (error: any) {
            // 실패 메시지
            alert(`❌ ${error.message || "랭크 장착에 실패했습니다."}`);
        }
    };

    // TODO: AccountProfile API 나오면 교체
    const [consent] = useState({
        phone: true,
        email: false,
    });

    /** 닉네임 수정 시작 */
    const handleStartEdit = () => {
        if (profile) {
            setTempNickname(profile.customNickname);
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
            const updated: CustomNicknameResponse = await updateNickname(
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

    /** 모달 열기 */
    const openModal = (type: "phone" | "email" | "photo") => {
        setModalType(type);
        setIsModalOpen(true);
    };

    type HistoryMock = {
        login: string;
        grades: { name: string; date: string; active?: boolean }[];
        titles: { name: string; date: string; active?: boolean }[];
    };

    const [history] = useState<HistoryMock>({
        login: "2025.09.04 PC (웹)",
        grades: [
            { name: "브론즈", date: "2025-08-01" },
            { name: "실버", date: "2025-08-10", active: true },
        ],
        titles: [
            { name: "얼리버드", date: "2025-08-22" },
            { name: "나야, 나", date: "2025-08-15", active: true },
        ],
    });

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <Wrapper>
            {/* 기본정보 */}
            <Section>
                <SectionTitle>기본정보</SectionTitle>
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
                                    <Nickname>{profile.customNickname}</Nickname>
                                )}
                            </NicknameRow>
                            {error && <ErrorText>{error}</ErrorText>}

                            <Email>{profile.email}</Email>
                        </InfoText>

                        <ButtonGroup>
                            {isEditingNickname ? (
                                <SmallButton onClick={handleSaveNickname}>확인</SmallButton>
                            ) : (
                                <SmallButton onClick={handleStartEdit}>별명 수정</SmallButton>
                            )}
                            <SmallButton onClick={() => openModal("photo")}>사진 변경</SmallButton>
                        </ButtonGroup>
                    </TopRow>

                    <Divider />

                    <BottomRow>
                        <InfoItem>
                            <FaPhone style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>{accountInfo.phone || "본인확인 번호 없음"}</span>
                            <ActionLink onClick={() => openModal("phone")}>
                                {accountInfo.phone ? "수정" : "등록"}
                            </ActionLink>
                        </InfoItem>
                        <InfoItem>
                            <FaEnvelope style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>{accountInfo.email}</span>
                            <ActionLink onClick={() => openModal("email")}>수정</ActionLink>
                        </InfoItem>
                    </BottomRow>
                </InfoCard>
            </Section>

            {/* 프로모션 정보수신 동의 */}
            <Section>
                <SectionTitle>프로모션 정보수신 동의</SectionTitle>
                <ConsentCard>
                    <ConsentRow>
                        <Left>
                            <FaPhone />
                            <span>휴대전화</span>
                        </Left>
                        <ToggleSwitch
                            checked={consent.phone}
                            onClick={() => openModal("phone")}
                        >
                            <span>{consent.phone ? "ON" : "OFF"}</span>
                        </ToggleSwitch>
                    </ConsentRow>

                    <Divider />

                    <ConsentRow>
                        <Left>
                            <FaEnvelope />
                            <span>이메일</span>
                        </Left>
                        <ToggleSwitch
                            checked={consent.email}
                            onClick={() => openModal("email")}
                        >
                            <span>{consent.email ? "ON" : "OFF"}</span>
                        </ToggleSwitch>
                    </ConsentRow>
                </ConsentCard>
            </Section>

            {/* 이력 관리 */}
            <Section>
                <SectionTitle>이력 관리</SectionTitle>
                <Card>
                    <h3>로그인 기록</h3>
                    <p>{history.login}</p>
                </Card>

                <Card>
                    <HistoryHeader>
                        <h3>등급 전체 이력</h3>
                        <ToggleButton onClick={() => setShowRanks(!showRanks)}>
                            {showRanks ? "숨기기" : "보기"}
                        </ToggleButton>
                    </HistoryHeader>

                    {/* 현재 장착된 랭크 */}
                    {profile.rank && (
                        <EquippedBox>
                            <span>{profile.rank.displayName}</span>
                            <span>장착 중</span>
                        </EquippedBox>
                    )}

                    {/* 토글된 경우에만 리스트 표시 */}
                    {showRanks && (
                        <ul>
                            {ranks.map((rank) => (
                                <HistoryItemBox key={rank.id} active={profile.rank?.id === rank.id}>
                                    <span>
                                        {rank.displayName} ({new Date(rank.acquiredAt).toLocaleDateString()})
                                    </span>
                                    {profile?.rank?.id === rank.id ? (
                                        <EquipButton disabled>장착 중</EquipButton>
                                    ) : (
                                        <EquipButton onClick={() => handleEquipRank(rank.id)}>장착</EquipButton>
                                    )}
                                </HistoryItemBox>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3>칭호 전체 이력</h3>
                    <ul>
                        {history.titles.map((t, i) => (
                            <li key={i}>
                                {t.name} ({t.date}) {t.active && <Badge active>사용중</Badge>}
                            </li>
                        ))}
                    </ul>
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
    padding: 28px 32px;  /* 여유 있는 패딩 */
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
    font-size: 22px;   /* 기존 20 → 22 */
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

const SmallButton = styled.button`
    width: 100px;   /* ✅ 고정 너비 */
    text-align: center;

    padding: 6px 0;   /* 좌우 padding 대신 위아래만 */
    font-size: 13px;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    color: #374151;

    &:hover {
        background: #f3f4f6;
    }
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 0;
`;

const BottomRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #374151;

    span {
        flex: 1;
        margin-left: 8px;
        color: #6b7280;
    }
`;

const ActionLink = styled.button`
    font-size: 13px;
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
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

const ConsentCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ConsentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #9ca3af;
  }

  span {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }
`;

const ToggleSwitch = styled.button<{ checked: boolean }>`
  width: 50px;
  height: 26px;
  border-radius: 20px;
  background: ${({ checked }) => (checked ? "#0ea5e9" : "#d1d5db")};
  border: none;
  cursor: pointer;
  position: relative;

  span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    font-weight: 600;
    color: white;
    left: ${({ checked }) => (checked ? "8px" : "auto")};
    right: ${({ checked }) => (checked ? "auto" : "8px")};
  }
`;

const Badge = styled.span<{ active?: boolean }>`
    display: inline-block;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    margin-left: 6px;

    background: ${({ active }) => (active ? "rgb(59,130,246)" : "transparent")};
    color: ${({ active }) => (active ? "#fff" : "rgb(107, 114, 128)")};
    border: ${({ active }) => (active ? "none" : "1px solid #d1d5db")};
`;

const NicknameInput = styled.input`
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    border: none;
    border-bottom: 2px solid #3b82f6;  /* 밑줄 강조 */
    padding: 4px 0;
    outline: none;
    width: 100%;

    &::placeholder {
        color: #9ca3af;
        font-weight: 500;
    }

    &:focus {
        border-color: #2563eb; /* 포커스 시 진한 파랑 */
    }
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #dc2626; /* Tailwind red-600 */
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

