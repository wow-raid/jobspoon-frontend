{/* 회원정보 수정 메뉴 탭 */}

import React, { useState } from "react";
import styled from "styled-components";
import { FaPhone, FaEnvelope, FaLock } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import defaultProfile from "../assets/default_profile.png";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import { ProfileAppearanceResponse } from "../api/profileAppearanceApi.ts";

type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    refreshProfile: () => Promise<void>;
};

export default function AccountProfileEdit() {
    const { profile } = useOutletContext<OutletContextType>();

    // 서비스 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 프로필 공개 여부 상태
    const [isProfilePublic, setIsProfilePublic] = useState(true);

    // TODO: AccountProfile API 나오면 교체
    const [accountInfo] = useState({
        phone: "",
    });

    // TODO: AccountProfile API 나오면 교체
    const [consent, setConsent] = useState({
        phone: true,
        email: false,
    });

    /** 모달 열기 */
    const openModal = () => {
        setIsModalOpen(true);
    };

    // 토글 핸들러
    const handleToggleProfilePublic = () => {
        setIsProfilePublic((prev) => !prev);
        setIsModalOpen(true); // 안내 모달도 같이 열림
        // TODO: 나중에 API 연동
    };

    // 정보수신 동의 토글 핸들러
    const handleToggleConsent = (key: "phone" | "email") => {
        setConsent((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        setIsModalOpen(true);
        // TODO: 나중에 API 연동
    };

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <Wrapper>
            {/* 기본정보 */}
            <Section>
                <SectionTitle>회원정보</SectionTitle>
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
                            <Nickname>{profile.customNickname}</Nickname>
                            <Email>{profile.email}</Email>
                        </InfoText>
                    </TopRow>

                    <Divider />

                    <BottomRow>
                        <InfoItem>
                            <FaPhone style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>{accountInfo.phone || "본인확인 번호 없음"}</span>
                            <ActionLink onClick={openModal}>
                                {accountInfo.phone ? "수정" : "등록"}
                            </ActionLink>
                        </InfoItem>
                        <InfoItem>
                            <FaEnvelope style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>{profile.email}</span>
                            <ActionLink onClick={openModal}>수정</ActionLink>
                        </InfoItem>
                        <InfoItem>
                            <FaLock style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>비밀번호</span>
                            <ActionLink onClick={openModal}>변경</ActionLink>
                        </InfoItem>
                    </BottomRow>
                </InfoCard>
            </Section>

            {/* 프로필 공개 여부 */}
            <Section>
                <SectionTitle>프로필 공개 설정</SectionTitle>
                <ConsentCard>
                    <ConsentRow>
                        <Left>
                            <span>스터디 모임 프로필 공개</span>
                        </Left>
                        <ToggleSwitch
                            checked={isProfilePublic}
                            onClick={handleToggleProfilePublic}>
                            <span>{isProfilePublic ? "ON" : "OFF"}</span>
                        </ToggleSwitch>
                    </ConsentRow>

                    {/* 하위 공개 옵션 */}
                    {isProfilePublic && (
                        <>
                            <Divider />
                            <ConsentRow className="sub-consent">
                                <Left sub>
                                    <span>휴대전화 공개</span>
                                </Left>
                                <ToggleSwitch
                                    checked={consent.phone}
                                    onClick={() => handleToggleConsent("phone")}>
                                    <span>{consent.phone ? "ON" : "OFF"}</span>
                                </ToggleSwitch>
                            </ConsentRow>

                            <Divider />

                            <ConsentRow className="sub-consent">
                                <Left sub>
                                    <span>이메일 공개</span>
                                </Left>
                                <ToggleSwitch
                                    checked={consent.email}
                                    onClick={() => handleToggleConsent("email")}>
                                    <span>{consent.email ? "ON" : "OFF"}</span>
                                </ToggleSwitch>
                            </ConsentRow>
                        </>
                    )}
                </ConsentCard>
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
                            onClick={() => handleToggleConsent("phone")}>
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
                            onClick={() => handleToggleConsent("email")}>
                            <span>{consent.email ? "ON" : "OFF"}</span>
                        </ToggleSwitch>
                    </ConsentRow>
                </ConsentCard>
            </Section>

            {/* 보안 관리 */}
            <Section>
                <SectionTitle>보안 관리</SectionTitle>
                <Card>
                    <h3>로그인 기록</h3>
                    <p>
                        해당 기능은 현재 준비 중입니다.
                        <br />
                        곧 만나보실 수 있어요 😊
                    </p>
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

const Nickname = styled.div`
    font-size: 22px;
    font-weight: 700;
    color: #111827;
`;

const Email = styled.div`
    font-size: 14px;
    color: #6b7280;
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

    p {
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

    &.sub-consent {
        margin-left: 12px;   /* ✅ padding-left → margin-left */
    }
`;

const Left = styled.div<{ sub?: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;

    /* 상위는 아이콘 표시, 하위는 아이콘 제거 */
    svg {
        color: #9ca3af;
        ${({ sub }) => sub && "display: none;"}
    }

    span {
        font-size: 14px;
        font-weight: 500;
        position: relative;
        color: #374151;

        ${({ sub }) =>
                sub &&
                `
            &::before {
              content: "•";
              margin-right: 6px;
              display: inline-block;
            }
        `}
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

