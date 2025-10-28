import React, { useState } from "react";
import { ProfileAppearanceResponse } from "../../api/profileAppearanceApi.ts";
import { UserTitleResponse } from "../../api/userTitleApi.ts";
import styled from "styled-components";
import defaultProfile from "../../assets/default_profile.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { notifyError } from "../../utils/toast";

type Props = {
    profile: ProfileAppearanceResponse;
    titles?: UserTitleResponse[];
};

export default function ProfileAppearanceCard({ profile, titles }: Props) {
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 확대 이미지 모달 상태
    const equippedTitle = titles?.find((t) => t.equipped);

    if (!profile) return <p>불러오는 중...</p>;

    return (
        <>
            <Card>
                {/* ✅ 헤더 */}
                <Header onClick={() => setIsOpen(!isOpen)}>
                    <HeaderTitle>내 프로필</HeaderTitle>
                    <ArrowIcon>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</ArrowIcon>
                </Header>

                {/* ✅ 본문 */}
                {isOpen && (
                    <Content>
                        <ImageWrapper>
                            <ProfileImage
                                src={profile.photoUrl || defaultProfile}
                                alt="profile"
                                onClick={() => setIsModalOpen(true)} // ✅ 클릭 시 모달 오픈
                                onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.src = defaultProfile;
                                    if (!localStorage.getItem("profileImgErrorNotified")) {
                                        notifyError("프로필 이미지를 불러오지 못했습니다. 기본 이미지로 변경됩니다.");
                                        localStorage.setItem("profileImgErrorNotified", "true");
                                    }
                                }}
                            />
                        </ImageWrapper>

                        <InfoBox>
                            <Row>
                                <Label>칭호</Label>
                                <Value>{equippedTitle?.displayName ?? "칭호 없음"}</Value>
                            </Row>
                            <Divider />
                            <Row>
                                <Label>별명</Label>
                                <Value>{profile.nickname}</Value>
                            </Row>
                        </InfoBox>
                    </Content>
                )}
            </Card>

            {/* ✅ 모달 (이미지 확대 보기) */}
            {isModalOpen && (
                <ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <LargeImage src={profile.photoUrl || defaultProfile} alt="profile-large" />
                    </ModalContent>
                </ModalOverlay>
            )}
        </>
    );
}

/* ================== styled-components ================== */

const Card = styled.div`
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
    border: 1px solid #e5e7eb;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    transition: all 0.25s ease;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
`;

const HeaderTitle = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: #111827;
`;

const ArrowIcon = styled.span`
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3b82f6;
    color: white;
    border-radius: 8px;
    font-size: 13px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
`;

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 12px;
    margin-bottom: 8px;
`;

const ProfileImage = styled.img`
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #3B82F6;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15);
    transition:
            transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
            box-shadow 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
    cursor: pointer;
    transform-origin: center center;
    will-change: transform, box-shadow;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
    }
`;


/* ✅ 인스타그램식 확대 모달 */
const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
    background: transparent;
    padding: 0;
`;

const LargeImage = styled.img`
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

const InfoBox = styled.div`
    width: 100%;
    background: #f9fafb;
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Label = styled.span`
    font-weight: 600;
    color: #374151;
    font-size: 14px;
`;

const Value = styled.span`
    color: #1f2937;
    font-size: 14px;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 4px 0;
`;
