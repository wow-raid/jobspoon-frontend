import React, { useEffect, useState } from "react";
import { fetchMyProfile, ProfileAppearanceResponse } from "../api/profileAppearanceApi.ts";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function ProfileAppearanceCard() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = "test-token2";
        fetchMyProfile(token)
            .then(setProfile)
            .catch(console.error);
    }, []);

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <Card>
            {/* 프로필 이미지 */}
            <ImageWrapper>
                <ProfileImage
                    src={profile.photoUrl || "/default_profile.png"}
                    alt="profile"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default_profile.png";
                    }}
                />
            </ImageWrapper>

            {/* 기본 정보 */}
            <InfoTable>
                <tbody>
                <tr>
                    <LabelCell>등급</LabelCell>
                    <Separator>|</Separator>
                    <ValueCell>{profile.rank?.displayName ?? "등급 없음"}</ValueCell>
                </tr>
                <tr>
                    <LabelCell>별명</LabelCell>
                    <Separator>|</Separator>
                    <ValueCell>{profile.customNickname}</ValueCell>
                </tr>
                <tr>
                    <LabelCell>계정</LabelCell>
                    <Separator>|</Separator>
                    <ValueCell>TestUser01</ValueCell>
                </tr>
                </tbody>
            </InfoTable>

            {/* 수정 버튼 */}
            <ButtonWrapper>
                <EditButton onClick={() => navigate("/mypage/profile/edit")}>
                    <FaEdit />
                    수정하기
                </EditButton>
            </ButtonWrapper>
        </Card>
    );
}

/* ================== styled-components ================== */

const Card = styled.div`
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 24px;
  text-align: center;
  background: rgb(249, 250, 251);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgb(229, 231, 235);
`;

const InfoTable = styled.table`
  margin: 0 auto;
  font-size: 14px;
  line-height: 28px;
  border-collapse: separate;
  border-spacing: 8px 0;
`;

const LabelCell = styled.td`
  text-align: right;
  font-weight: 600;
  color: rgb(55, 65, 81);
  white-space: nowrap;
`;

const Separator = styled.td`
  text-align: center;
  color: rgb(209, 213, 219);
`;

const ValueCell = styled.td`
  text-align: left;
  color: rgb(31, 41, 55);
  white-space: nowrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgb(59, 130, 246);
  color: white;
  font-size: 13px;
  border-radius: 6px;
  transition: background 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background: rgb(37, 99, 235);
  }
`;




// import React, { useEffect, useState } from "react";
// import { fetchMyProfile, ProfileAppearanceResponse } from "../api/profileAppearanceApi.ts";
// import '../assets/tailwind.css'
// import { FaEdit } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
//
// export default function ProfileAppearanceCard() {
//     const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
//     const navigate = useNavigate();
//
//     // TODO: 👉 로그인 연동 전까지는 임시 하드코딩
//     useEffect(() => {
//         const token = "test-token2";
//         fetchMyProfile(token)
//             .then(setProfile)
//             .catch(console.error);
//     }, []);
//
//     // TODO: 👉 실제 로그인 붙었을 때 사용할 버전 (주석으로 보관)
//     // useEffect(() => {
//     //     const token = localStorage.getItem("userToken") || "";
//     //     fetchMyProfile(token)
//     //         .then(setProfile)
//     //         .catch(console.error);
//     // }, []);
//
//     // 아직 API 로드 전이면 로딩 표시
//     if (!profile) {
//         return <p>불러오는 중...</p>;
//     }
//
//     return (
//         <div className="rounded-[12px] shadow p-[24px] text-center space-y-[16px] bg-[rgb(249,250,251)]">
//             {/* 프로필 이미지 */}
//             <div className="flex justify-center mb-[20px]">
//                 <img
//                     src={profile.photoUrl || "/default_profile.png"}
//                     alt="profile"
//                     className="w-[140px] h-[140px] rounded-full object-cover border border-[rgb(229,231,235)]"
//                     onError={(e) => {
//                         (e.target as HTMLImageElement).src = "/default_profile.png";
//                     }}
//                 />
//             </div>
//
//             {/* 기본 정보 */}
//             <div>
//                 <table className="mx-auto text-[14px] leading-[28px] border-separate border-spacing-x-[8px] border-collapse border-[0]">
//                     <tbody>
//                     <tr>
//                         <td className="text-right font-semibold text-[rgb(55,65,81)] whitespace-nowrap">등급</td>
//                         <td className="text-center text-[rgb(209,213,219)]">|</td>
//                         <td className="text-left text-[rgb(31,41,55)] whitespace-nowrap">
//                             {profile.rank?.displayName ?? "등급 없음"}
//                         </td>
//                     </tr>
//                     <tr>
//                         <td className="text-right font-semibold text-[rgb(55,65,81)] whitespace-nowrap">별명</td>
//                         <td className="text-center text-[rgb(209,213,219)]">|</td>
//                         <td className="text-left text-[rgb(31,41,55)] whitespace-nowrap">
//                             {profile.customNickname}
//                         </td>
//                     </tr>
//                     <tr>
//                         <td className="text-right font-semibold text-[rgb(55,65,81)] whitespace-nowrap">계정</td>
//                         <td className="text-center text-[rgb(209,213,219)]">|</td>
//                         <td className="text-left text-[rgb(31,41,55)] whitespace-nowrap">
//                             TestUser01
//                         </td>
//                     </tr>
//                     </tbody>
//                 </table>
//             </div>
//
//             {/* 수정 버튼 */}
//             <div className="flex justify-end mt-[24px]">
//                 <button
//                     className="flex items-center gap-[6px] px-[16px] py-[8px]
//                                bg-[rgb(59,130,246)] text-[white] text-[13px] rounded-[6px]
//                                hover:bg-[rgb(37,99,235)] cursor-pointer
//                                transition-colors duration-200"
//                     onClick={() => navigate("/mypage/profile/edit")}>
//                     <FaEdit />
//                     수정하기
//                 </button>
//             </div>
//         </div>
//     );
// }
