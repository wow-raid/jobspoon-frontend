import React, { useState, useEffect } from "react";
import styled from "styled-components";
import defaultProfile from "../../assets/default_profile.png";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import ServiceModal from "../modals/ServiceModal.tsx";

export default function AccountProfileEdit() {
    // 더미 상태 (추후 API 연동 예정)
    const [profile, setProfile] = useState({
        photoUrl: "",
        nickname: "개발뉴비 김햄찌",
        email: "TestUser01@kakao.com",
        phone: "",
        verified: false,
        rank: "Gold",
        accountId: "TestUser01",
    });

    const [consent, setConsent] = useState({
        phone: true,
        email: false,
    });

    const [history, setHistory] = useState({
        login: "2025.09.04 PC (웹)",
        grades: [
            { name: "브론즈", date: "2025-08-01" },
            { name: "실버", date: "2025-08-10", active: true },
        ],
        titles: [
            { name: "얼리버드", date: "2025-08-22" },
            { name: "나야, 나", date: "2025-08-15", active: true },
            { name: "프론트엔드", date: "2025-08-22" },
            { name: "백엔드", date: "2025-08-22" },
            { name: "국가대표", date: "2025-08-22" },
        ],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"phone" | "email" | null>(null);

    const openModal = (type: "phone" | "email") => {
        setModalType(type);
        setIsModalOpen(true);
    }

    useEffect(() => {
        // TODO: fetchAccountProfile();
    }, []);

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
                                <Nickname>{profile.nickname}</Nickname>
                            </NicknameRow>
                            <Email>{profile.email}</Email>
                        </InfoText>
                        <ButtonGroup>
                            <SmallButton onClick={() => setIsModalOpen(true)}>
                                별명 수정
                            </SmallButton>
                            <SmallButton onClick={() => setIsModalOpen(true)}>
                                사진 변경
                            </SmallButton>
                        </ButtonGroup>
                    </TopRow>

                    <Divider />

                    <BottomRow>
                        <InfoItem>
                            <FaPhone style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>{profile.phone || "본인확인 번호 없음"}</span>
                            <ActionLink onClick={() => openModal("phone")}>
                                {profile.phone ? "수정" : "등록"}
                            </ActionLink>
                        </InfoItem>
                        <InfoItem>
                            <FaEnvelope style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>{profile.email}</span>
                            <ActionLink onClick={() => openModal("email")}>
                                수정
                            </ActionLink>
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
                            onClick={() => openModal("phone")}>
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
                            onClick={() => openModal("email")}>
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
                    <h3>등급 전체 이력</h3>
                    <ul>
                        {history.grades.map((g, i) => (
                            <li key={i}>
                                {g.name} ({g.date}){" "}
                                {g.active && <Badge active>사용중</Badge>}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card>
                    <h3>칭호 전체 이력</h3>
                    <ul>
                        {history.titles.map((t, i) => (
                            <li key={i}>
                                {t.name} ({t.date}){" "}
                                {t.active && <Badge active>사용중</Badge>}
                            </li>
                        ))}
                    </ul>
                </Card>
            </Section>

            {/* ✅ 모달 */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}>
            </ServiceModal>
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
    padding: 6px 14px;   /* 기존보다 넉넉하게 */
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
