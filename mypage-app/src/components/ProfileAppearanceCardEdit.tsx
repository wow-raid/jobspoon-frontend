import React, { useEffect, useState } from "react";
import {
    fetchMyProfile,
    fetchMyRanks,
    fetchMyTitles,
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
                    <NicknameInput type="text" placeholder="닉네임 입력" />
                    <SaveButton>수정</SaveButton>
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




// import React, { useEffect, useState } from "react";
// import {
//     fetchMyProfile,
//     fetchMyRanks,
//     fetchMyTitles,
//     updateProfilePhoto,
//     HistoryItem,
//     ProfileAppearanceResponse
// } from "../api/profileAppearanceApi.ts";
// import ServiceModal from "./ServiceModal.tsx";
// import '../assets/tailwind.css'
//
// export default function ProfileAppearanceCardEdit() {
//
//     const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
//     const [ranks, setRanks] = useState<HistoryItem[]>([]);
//     const [titles, setTitles] = useState<HistoryItem[]>([]);
//
//     {/* 토글 */}
//     const [showRanks, setShowRanks] = useState(false);
//     const [showTitles, setShowTitles] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//
//     useEffect(() => {
//         const token = "test-token2";
//         fetchMyProfile(token).then(setProfile).catch(console.error);
//         fetchMyRanks(token).then(setRanks).catch(console.error);
//         fetchMyTitles(token).then(setTitles).catch(console.error);
//     }, []);
//
//     if (!profile) {
//         return <p>불러오는 중...</p>;
//     }
//
//     // const handlePhotoChange = async () => {
//     //     const token = "test-token2";
//     //     const newUrl = prompt("새 프로필 url을 입력하세요:");
//     //
//     //     if(!newUrl) return;
//     //
//     //     try{
//     //         const updated = await updateProfilePhoto(token, newUrl);
//     //         setProfile(updated); // 상태 갱신
//     //         alert("프로필 사진이 변경되었습니다!");
//     //     } catch(error) {
//     //         console.log(error);
//     //         alert("프로필 사진 변경 실패");
//     //     }
//     // };
//
//     return (
//         <section className="p-[24px] rounded-[12px] space-y-[20px] bg-white shadow">
//             {/* 제목 */}
//             <h2 className="text-[18px] font-[700] text-[rgb(17,24,39)]">
//                 프로필 외형 수정
//             </h2>
//
//             {/* 상단 프로필 영역 */}
//             <div className="flex items-start space-x-[32px]">
//                 {/* 프로필 사진 */}
//                 <div className="flex flex-col items-center space-y-[12px]">
//                     <div className="w-[112px] h-[112px] rounded-full bg-[rgb(229,231,235)] flex items-center justify-center shadow-inner">
//                         {profile.photoUrl ? (
//                             <img src={profile.photoUrl} alt="프로필" className="w-full h-full object-cover" />
//                         ) : (
//                             <span className="text-[rgb(107,114,128)] text-[14px]">
//                                 사진
//                             </span>
//                         )}
//                     </div>
//                     <button onClick={() => setIsModalOpen(true)}
//                         className="px-[16px] py-[4px] bg-[rgb(59,130,246)] text-[white] text-[14px] rounded-[8px] hover:bg-[rgb(37,99,235)]">
//                         사진 변경
//                     </button>
//                 </div>
//             </div>
//
//             {/* 닉네임 수정 -> api 연결 완료 */}
//             <div className="flex-1 space-y-[8px]">
//                 <label className="block text-[14px] text-[rgb(75,85,99)]">
//                     현재: {profile?.customNickname ?? "불러오는 중..."}
//                 </label>
//                     <div className="flex space-x-[8px]">
//                         <input type="text" placeholder="닉네임 입력"
//                             className="flex-1 border rounded-[8px] px-[12px] py-[8px] text-[14px] focus:ring focus:ring-[rgb(147,197,253)]"/>
//                         <button className="px-[16px] py-[8px] bg-[rgb(34,197,94)] text-[white] text-[14px] rounded-[8px] hover:bg-[rgb(22,163,74)]">
//                             수정
//                         </button>
//                     </div>
//             </div>
//
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
//                 {/* 랭크 카드 */}
//                 <div className="p-[16px] bg-[rgb(249,250,251)] rounded-[8px] shadow-sm space-y-[12px]">
//                     <div className="flex justify-between items-center">
//                         <h3 className="font-[600] text-[rgb(31,41,55)]">
//                             등급 전체 이력
//                         </h3>
//                         <button onClick={() => setShowRanks(!showRanks)}
//                             className="text-[14px] text-[rgb(59,130,246)] hover:underline">
//                             {showRanks ? "숨기기" : "보기"}
//                         </button>
//                     </div>
//
//                     {/* 현재 장착 중 -> api 연결 완료 */}
//                     <div className="border-[2px] border-[rgb(59,130,246)] bg-[rgb(239,246,255)] rounded-[8px] px-[12px] py-[8px] flex justify-between">
//                         <span className="font-[500] text-[rgb(29,78,216)]">
//                             {profile.rank?.displayName}
//                         </span>
//                         <span className="text-[12px] font-[600] text-[rgb(29,78,216)]">
//                             장착 중
//                         </span>
//                     </div>
//
//                     {/* 전체 이력 (토글 열렸을 때만) -> api 연결 완료 */}
//                     {showRanks && (
//                         <ul className="space-y-[8px]">
//                             {ranks.map((rank) => (
//                                 <li key={rank.code}
//                                     className="flex justify-between items-center border rounded-[8px] px-[12px] py-[8px]">
//                                     <span>
//                                         {rank.displayName} (
//                                         {new Date(rank.acquiredAt).toLocaleDateString()})
//                                     </span>
//                                     <button className="text-[12px] px-[8px] py-[4px] bg-[rgb(243,244,246)] rounded-[4px] hover:bg-[rgb(229,231,235)]">
//                                         장착
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//
//                 </div>
//
//                 {/* 칭호 카드 */}
//                 <div className="p-[16px] bg-[rgb(249,250,251)] rounded-[8px] shadow-sm space-y-[12px]">
//                     <div className="flex justify-between items-center">
//                         <h3 className="font-[600] text-[rgb(31,41,55)]">
//                             칭호 전체 이력
//                         </h3>
//                         <button onClick={() => setShowTitles(!showTitles)}
//                                 className="text-[14px] text-[rgb(59,130,246)] hover:underline">
//                             {showTitles ? "숨기기" : "보기"}
//                         </button>
//                     </div>
//
//                     {/* 현재 장착 중 -> api 연결 완료 */}
//                     <div className="border-[2px] border-[rgb(59,130,246)] bg-[rgb(239,246,255)] rounded-[8px] px-[12px] py-[8px] flex justify-between">
//                         <span className="font-[500] text-[rgb(29,78,216)]">
//                             {profile.title?.displayName}
//                         </span>
//                         <span className="text-[12px] font-[600] text-[rgb(29,78,216)]">
//                             장착 중
//                         </span>
//                     </div>
//
//                     {/* 전체 이력 -> api 연결 완료 */}
//                     {showTitles && (
//                         <ul className="space-y-[8px]">
//                             {titles.map((title) => (
//                                 <li key={title.code}
//                                     className="flex justify-between items-center border rounded-[8px] px-[12px] py-[8px]">
//                                     <span>
//                                         {title.displayName} (
//                                         {new Date(title.acquiredAt).toLocaleDateString()})
//                                     </span>
//                                     <button className="text-[12px] px-[8px] py-[4px] bg-[rgb(243,244,246)] rounded-[4px] hover:bg-[rgb(229,231,235)]">
//                                         장착
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             </div>
//
//             {/* 모달 추가 */}
//             <ServiceModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}/>
//         </section>
//     );
// }