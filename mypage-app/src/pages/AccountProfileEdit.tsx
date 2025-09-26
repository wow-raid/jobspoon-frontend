{/* 회원정보 수정 메뉴 탭 */}

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import defaultProfile from "../assets/default_profile.png";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import { ProfileAppearanceResponse, uploadProfilePhoto } from "../api/profileAppearanceApi.ts";
import { updateNickname } from "../api/accountProfileApi.ts";

type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    refreshProfile: () => Promise<void>;
};

export default function AccountProfileEdit() {
    const { profile, refreshProfile } = useOutletContext<OutletContextType>();

    // 서비스 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 닉네임 수정 상태
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [tempNickname, setTempNickname] = useState("");

    // 프로필 공개 여부 상태
    const [isProfilePublic, setIsProfilePublic] = useState(true);

    // 정보수신 동의 TODO: AccountProfile API 나오면 교체
    const [consent, setConsent] = useState({
        phone: true,
        email: false,
    });

    // 사진 업로드 관련
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // 닉네임 관련 에러
    const [nicknameError, setNicknameError] = useState<string | null>(null);
    const [nicknameSuccess, setNicknameSuccess] = useState<string | null>(null);

    // 사진 업로드 관련 에러
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);
    const [fadeOut, setFadeOut] = useState(false);

    /** 메시지 자동 사라짐 처리 */
    useEffect(() => {
        if (nicknameError || nicknameSuccess) {
            setFadeOut(false);
            const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
            const removeTimer = setTimeout(() => {
                setNicknameError(null);
                setNicknameSuccess(null);
                setFadeOut(false);
            }, 4000);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [nicknameError, nicknameSuccess]);

    useEffect(() => {
        if (photoError || photoSuccess) {
            setFadeOut(false); // 처음에는 보이게
            const fadeTimer = setTimeout(() => setFadeOut(true), 2500); // 2.5초 후 fade 시작
            const removeTimer = setTimeout(() => {
                setPhotoError(null);
                setPhotoSuccess(null);
                setFadeOut(false);
            }, 4000); // 4초 후 state 제거

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [photoError, photoSuccess]);

    /** 닉네임 수정 시작 */
    const handleStartEdit = () => {
        if (profile) {
            setTempNickname(profile.nickname); //
            setIsEditingNickname(true);
        }
    };

    /** 닉네임 저장 */
    const handleSaveNickname = async () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn"); // ✅ 로그인 여부만 확인
        if (!isLoggedIn) {
            setNicknameError("로그인이 필요합니다.");
            return;
        }

        try {
            await updateNickname(tempNickname); // ✅ token 인자 제거
            await refreshProfile();
            setIsEditingNickname(false);
            setNicknameError(null);
            setNicknameSuccess("닉네임이 성공적으로 변경되었습니다.");
        } catch (err: any) {
            setNicknameError(err.message || "닉네임 수정 실패");
            setNicknameSuccess(null);
        }
    };

    /** 닉네임 수정 취소 */
    const handleCancelEdit = () => {
        setTempNickname("");
        setIsEditingNickname(false);
        setNicknameError(null);
    };

    /** 사진 변경 버튼 클릭 */
    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    /** 파일 선택 후 업로드 */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isLoggedIn = localStorage.getItem("isLoggedIn"); // ✅ 로그인 여부만 확인
        if (!isLoggedIn) {
            setPhotoError("로그인이 필요합니다.");
            return;
        }

        try {
            setIsUploading(true);
            await uploadProfilePhoto(file); // ✅ token 인자 제거
            await refreshProfile();
            setPhotoError(null);
            setPhotoSuccess("사진 업로드 성공");
        } catch (err: any) {
            setPhotoError(err.message || "사진 업로드 실패");
            setPhotoSuccess(null);
        } finally {
            setIsUploading(false);
        }
    };

    // 토글 핸들러
    const handleToggleProfilePublic = () => {
        setIsProfilePublic((prev) => !prev);
        setIsModalOpen(true); // 안내 모달 열기
    };

    // 정보수신 동의 토글 핸들러
    const handleToggleConsent = (key: "phone" | "email") => {
        setConsent((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        setIsModalOpen(true);
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
                        <PhotoSection>
                            <PhotoWrapper>
                                {isUploading ? (
                                    <Spinner />
                                ) : (
                                    <Photo
                                        src={profile.photoUrl || defaultProfile}
                                        alt="프로필"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = defaultProfile;
                                        }}
                                    />
                                )}
                            </PhotoWrapper>

                            {photoError && (
                                <MessageBase fadeOut={fadeOut} type="error">
                                    {photoError}
                                </MessageBase>
                            )}
                            {photoSuccess && (
                                <MessageBase fadeOut={fadeOut} type="success">
                                    {photoSuccess}
                                </MessageBase>
                            )}
                        </PhotoSection>

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
                                    <Nickname>{profile.nickname}</Nickname> // ✅ customNickname → nickname
                                )}
                            </NicknameRow>
                            {nicknameError && (
                                <NicknameMessage fadeOut={fadeOut} type="error">
                                    {nicknameError}
                                </NicknameMessage>
                            )}
                            {nicknameSuccess && (
                                <NicknameMessage fadeOut={fadeOut} type="success">
                                    {nicknameSuccess}
                                </NicknameMessage>
                            )}

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
                            <SmallButton onClick={handleFileClick} disabled={isUploading}>
                                {isUploading ? "업로드 중..." : "사진 변경"}
                            </SmallButton>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </ButtonGroup>
                    </TopRow>

                    <Divider />

                    <BottomRow>
                        <InfoItem>
                            <FaEnvelope style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>정보 1</span>
                        </InfoItem>
                        <InfoItem>
                            <FaLock style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>정보 2</span>
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

                    {isProfilePublic && (
                        <>
                            <Divider />
                            <ConsentRow className="sub-consent">
                                <Left sub>
                                    <span>정보 1</span>
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
                                    <span>정보 2</span>
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
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const Spinner = styled.div`
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
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

const NicknameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
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

const PhotoSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
`;

const MessageBase = styled.div<{ fadeOut: boolean; type: "error" | "success" }>`
  font-size: 12px;
  text-align: center;
  color: ${({ type }) => (type === "error" ? "#dc2626" : "#16a34a")};
  opacity: ${({ fadeOut }) => (fadeOut ? 0 : 1)};
  transition: opacity 1.5s ease; // fade-out
`;

const NicknameMessage = styled.div<{ fadeOut: boolean; type: "error" | "success" }>`
  font-size: 13px;
  margin-top: 4px;
  text-align: left;  // 왼쪽 정렬
  color: ${({ type }) => (type === "error" ? "#dc2626" : "#16a34a")};
  opacity: ${({ fadeOut }) => (fadeOut ? 0 : 1)};
  transition: opacity 1.5s ease;
`;