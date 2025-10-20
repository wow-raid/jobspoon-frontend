{/* 회원정보 수정 메뉴 탭 */}

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaEnvelope, FaLock, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import defaultProfile from "../assets/default_profile.png";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import TitleGuideModal from "../components/modals/TitleGuideModal.tsx";
import TrustScoreCriteria from "../components/history/TrustScoreCriteria.tsx";
import { ProfileAppearanceResponse, uploadProfilePhoto } from "../api/profileAppearanceApi.ts";
import { updateNickname } from "../api/accountProfileApi.ts";
// import {
//     fetchUserLevelHistory,
//     UserLevelResponse,
//     UserLevelHistoryResponse
// } from "../api/userLevelApi"; // 레벨 관련
import {
    equipTitle,
    unequipTitle,
    UserTitleResponse
} from "../api/userTitleApi"; // 칭호 관련
import {
    fetchTrustScore,
    TrustScoreResponse
} from "../api/userTrustScoreApi"; // 신뢰점수 관련
import {
    calcAttendanceScore,
    calcInterviewScore,
    calcProblemScore,
    calcPostScore,
    calcStudyroomScore,
    calcCommentScore,
    calcTotalScore
} from "../utils/trustScoreUtils";

type OutletContextType = {
    profile: ProfileAppearanceResponse | null;
    // userLevel: UserLevelResponse | null;
    titles: UserTitleResponse[];
    refreshAll: () => Promise<void>;
};

type Status = "loading" | "empty" | "loaded";

export default function AccountProfilePage() {
    // const { profile, userLevel, titles, refreshAll } = useOutletContext<OutletContextType>();
    const { profile, titles, refreshAll } = useOutletContext<OutletContextType>();

    // 상태 관리
    const [trustScore, setTrustScore] = useState<TrustScoreResponse | null>(null);
    // const [levelHistory, setLevelHistory] = useState<UserLevelHistoryResponse[]>([]);
    const [trustStatus, setTrustStatus] = useState<Status>("loading");
    // const [levelStatus, setLevelStatus] = useState<Status>("loading");

    const [showTrustCriteria, setShowTrustCriteria] = useState(false);
    const [isTitleGuideOpen, setIsTitleGuideOpen] = useState(false);
    // const [isLevelOpen, setIsLevelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 닉네임 수정 상태
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [tempNickname, setTempNickname] = useState("");

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

    // 초기 데이터 로드
    useEffect(() => {
        const loadTrustAndHistory = async () => {
            try {
                // const [trust, history] = await Promise.all([
                //     fetchTrustScore(),
                //     fetchUserLevelHistory(),
                // ]);
                // setTrustScore(trust || null);
                // setLevelHistory(history || []);
                // setTrustStatus(trust ? "loaded" : "empty");
                // setLevelStatus(history ? "loaded" : "empty");

                const trust = await fetchTrustScore();

                setTrustScore(trust || null);
                setTrustStatus(trust ? "loaded" : "empty");

            } catch (err) {
                console.error(err);
                setTrustStatus("empty");
                // setLevelStatus("empty");
            }
        };
        loadTrustAndHistory();
    }, []);

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
            await refreshAll();
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
            await refreshAll();
            setPhotoError(null);
            setPhotoSuccess("사진 업로드 성공");
        } catch (err: any) {
            setPhotoError(err.message || "사진 업로드 실패");
            setPhotoSuccess(null);
        } finally {
            setIsUploading(false);
        }
    };

    /** 칭호 장착/해제 */
    const handleEquip = async (titleId: number) => {
        try {
            const target = titles.find((t) => t.id === titleId);
            if (target?.equipped) {
                await unequipTitle();
                await refreshAll();
                alert("칭호가 해제되었습니다.");
            } else {
                const updated = await equipTitle(titleId);
                await refreshAll();
                alert(`${updated.displayName} 칭호가 장착되었습니다.`);
            }
        } catch (error: any) {
            alert(error.message || "칭호 장착/해제 실패");
        }
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
                                    <Nickname>{profile.nickname}</Nickname>
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

                            {/*<Email>{profile.email}</Email>*/}
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
                            <span>{profile.email}</span>
                        </InfoItem>
                        <InfoItem>
                            <FaLock style={{ color: "#6b7280", marginRight: "8px" }} />
                            <span>정보 2</span>
                        </InfoItem>
                    </BottomRow>
                </InfoCard>
            </Section>

            {/* 활동 이력 */}
            <Section>
                <SectionTitle>활동 이력</SectionTitle>

                {/* 신뢰점수 */}
                <Card>
                    <HistoryHeader>
                        <HeaderLeft>
                            <Icon>🛡️</Icon>
                            <h3>활동 점수</h3>
                        </HeaderLeft>
                        <ToggleButton onClick={() => setShowTrustCriteria(!showTrustCriteria)}>
                            {showTrustCriteria ? "숨기기" : "산정 기준"}
                        </ToggleButton>
                    </HistoryHeader>
                    {trustStatus === "loading" ? (
                        <Empty>불러오는 중...</Empty>
                    ) : trustStatus === "empty" ? (
                        <Empty>신뢰점수가 없습니다.</Empty>
                    ) : (
                        <>
                            <TrustContent>
                                <TrustGrid>
                                    {/* 출석률 */}
                                    <TrustItem>
                                        <span>출석률</span>
                                        <ProgressBar
                                            percent={(calcAttendanceScore(trustScore!.attendanceRate) / 25) * 100}
                                        />
                                        <Count>
                                            {calcAttendanceScore(trustScore!.attendanceRate).toFixed(1)} / 25점
                                        </Count>
                                    </TrustItem>

                                    {/* 모의면접 */}
                                    <TrustItem>
                                        <span>모의면접</span>
                                        <ProgressBar
                                            percent={(calcInterviewScore(trustScore!.monthlyInterviews) / 20) * 100}
                                        />
                                        <Count>
                                            {calcInterviewScore(trustScore!.monthlyInterviews)} / 20점
                                        </Count>
                                    </TrustItem>

                                    {/* 문제풀이 */}
                                    <TrustItem>
                                        <span>문제풀이</span>
                                        <ProgressBar
                                            percent={(calcProblemScore(trustScore!.monthlyProblems) / 20) * 100}
                                        />
                                        <Count>
                                            {calcProblemScore(trustScore!.monthlyProblems)} / 20점
                                        </Count>
                                    </TrustItem>

                                    {/* 글 작성 */}
                                    <TrustItem>
                                        <span>글 작성</span>
                                        <ProgressBar
                                            percent={(calcPostScore(trustScore!.monthlyPosts) / 15) * 100}
                                        />
                                        <Count>
                                            {calcPostScore(trustScore!.monthlyPosts)} / 15점
                                        </Count>
                                    </TrustItem>

                                    {/* 스터디룸 */}
                                    <TrustItem>
                                        <span>스터디룸</span>
                                        <ProgressBar
                                            percent={(calcStudyroomScore(trustScore!.monthlyStudyrooms) / 10) * 100}
                                        />
                                        <Count>
                                            {calcStudyroomScore(trustScore!.monthlyStudyrooms)} / 10점
                                        </Count>
                                    </TrustItem>

                                    {/* 댓글 */}
                                    <TrustItem>
                                        <span>댓글</span>
                                        <ProgressBar
                                            percent={(calcCommentScore(trustScore!.monthlyComments) / 15) * 100}
                                        />
                                        <Count>
                                            {calcCommentScore(trustScore!.monthlyComments)} / 15점
                                        </Count>
                                    </TrustItem>
                                </TrustGrid>
                                <Divider />
                                <TotalScore>
                                    총점: {calcTotalScore(trustScore!).toFixed(1)} / 100점
                                </TotalScore>
                            </TrustContent>
                        </>
                    )}
                    {showTrustCriteria && <TrustScoreCriteria />}
                </Card>

                {/* 레벨 */}
                {/*<Card>*/}
                {/*    <HistoryHeader>*/}
                {/*        <HeaderLeft>*/}
                {/*            <Icon>🏅</Icon>*/}
                {/*            <h3>레벨</h3>*/}
                {/*        </HeaderLeft>*/}
                {/*        <ToggleButton onClick={() => setIsLevelOpen(!isLevelOpen)}>*/}
                {/*            {isLevelOpen ? (*/}
                {/*                <>*/}
                {/*                    <FaChevronUp size={10} /> 닫기*/}
                {/*                </>*/}
                {/*            ) : (*/}
                {/*                <>*/}
                {/*                    <FaChevronDown size={10} /> 히스토리*/}
                {/*                </>*/}
                {/*            )}*/}
                {/*        </ToggleButton>*/}
                {/*    </HistoryHeader>*/}

                {/*    {levelStatus === "loading" ? (*/}
                {/*        <Empty>불러오는 중...</Empty>*/}
                {/*    ) : !userLevel ? (*/}
                {/*        <Empty>레벨 정보가 없습니다.</Empty>*/}
                {/*    ) : (*/}
                {/*        <LevelBox>*/}
                {/*            <p>*/}
                {/*                현재 Lv.{userLevel.level} (Exp {userLevel.exp}/{userLevel.totalExp})*/}
                {/*            </p>*/}
                {/*            <ProgressBar percent={(userLevel.exp / userLevel.totalExp) * 100} />*/}
                {/*        </LevelBox>*/}
                {/*    )}*/}

                {/*    {isLevelOpen && (*/}
                {/*        <Timeline>*/}
                {/*            {levelHistory.length === 0 ? (*/}
                {/*                <Empty>레벨 업 기록이 없습니다.</Empty>*/}
                {/*            ) : (*/}
                {/*                levelHistory.map((item) => (*/}
                {/*                    <TimelineItem key={item.achievedAt}>*/}
                {/*                        <TimelineDate>*/}
                {/*                            {new Date(item.achievedAt).toLocaleDateString()}*/}
                {/*                        </TimelineDate>*/}
                {/*                        <TimelineEvent>Lv.{item.level} 달성</TimelineEvent>*/}
                {/*                    </TimelineItem>*/}
                {/*                ))*/}
                {/*            )}*/}
                {/*        </Timeline>*/}
                {/*    )}*/}
                {/*</Card>*/}

                {/* 칭호 */}
                <Card>
                    <HistoryHeader>
                        <HeaderLeft>
                            <Icon>🎖️</Icon>
                            <h3>칭호 이력</h3>
                        </HeaderLeft>
                        <ToggleButton onClick={() => setIsTitleGuideOpen(true)}>
                            칭호 가이드
                        </ToggleButton>
                    </HistoryHeader>

                    {titles.length === 0 ? (
                        <Empty>획득한 칭호가 없습니다.</Empty>
                    ) : (
                        <TitleGrid>
                            {titles.map((title) => (
                                <TitleCard key={title.id} equipped={title.equipped}>
                                    <TitleName>{title.displayName}</TitleName>
                                    <AcquiredDate>
                                        {new Date(title.acquiredAt).toLocaleDateString()}
                                    </AcquiredDate>
                                    <Description>{title.description}</Description>
                                    <ActionButton onClick={() => handleEquip(title.id)}>
                                        {title.equipped ? "해제" : "장착"}
                                    </ActionButton>
                                </TitleCard>
                            ))}
                        </TitleGrid>
                    )}
                </Card>
            </Section>

            {/* 모달 */}
            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <TitleGuideModal
                isOpen={isTitleGuideOpen}
                onClose={() => setIsTitleGuideOpen(false)}
            />

            {/*
            ===============================
            ❌ 나머지 섹션 전부 주석 처리
            ===============================
            */}

            {/*
            프로필 공개 여부
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

            프로모션 정보수신 동의
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

            보안 관리
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

            모달
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            */}
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

/* ---------- 회원정보 ---------- */
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
  align-items: center;
  gap: 16px;
`;

const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
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

const MessageBase = styled.div<{ fadeOut: boolean; type: "error" | "success" }>`
  font-size: 12px;
  text-align: center;
  color: ${({ type }) => (type === "error" ? "#dc2626" : "#16a34a")};
  opacity: ${({ fadeOut }) => (fadeOut ? 0 : 1)};
  transition: opacity 1.5s ease;
`;

const NicknameMessage = styled.div<{ fadeOut: boolean; type: "error" | "success" }>`
  font-size: 13px;
  margin-top: 4px;
  text-align: left;
  color: ${({ type }) => (type === "error" ? "#dc2626" : "#16a34a")};
  opacity: ${({ fadeOut }) => (fadeOut ? 0 : 1)};
  transition: opacity 1.5s ease;
`;

/* ---------- 활동 이력 (신뢰점수/레벨/칭호) ---------- */

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

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.span`
  font-size: 18px;
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

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const TrustItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${({ percent }) => percent}%;
    background: linear-gradient(90deg, #3b82f6, #10b981);
    transition: width 0.3s ease;
  }
`;

const Count = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgb(31, 41, 55);
`;

const TrustContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TotalScore = styled.div`
  margin-top: 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(37, 99, 235, 0.08);
  font-size: 15px;
  font-weight: 700;
  color: #2563eb;
  align-self: flex-start;
`;

const LevelBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    font-size: 14px;
    color: #374151;
  }
`;

const Timeline = styled.ul`
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
`;

const TimelineItem = styled.li`
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 24px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    box-shadow: -3px 3px 0 rgba(156, 163, 175, 0.4);
  }
`;

const TimelineDate = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
  margin-right: 8px;
`;

const TimelineEvent = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
`;

const TitleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

const TitleCard = styled.div<{ equipped: boolean }>`
  border: 1px solid ${({ equipped }) => (equipped ? "#3b82f6" : "rgb(229,231,235)")};
  border-radius: 8px;
  padding: 12px;
  background: ${({ equipped }) => (equipped ? "rgba(59,130,246,0.05)" : "white")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
`;

const TitleName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(31, 41, 55);
`;

const AcquiredDate = styled.span`
  font-size: 12px;
  color: rgb(107, 114, 128);
`;

const Description = styled.p`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin: 8px 0;
  flex-grow: 1;
`;

const ActionButton = styled.button`
  margin-top: auto;
  align-self: center;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #eff6ff;
  }
`;

const Empty = styled.p`
  font-size: 14px;
  color: #888;
`;

const DividerThin = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
`;
