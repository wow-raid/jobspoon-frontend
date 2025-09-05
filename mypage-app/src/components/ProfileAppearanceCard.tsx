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
            <ImageWrapper>
            {/* 프로필 이미지 */}
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
                    <LabelCell>칭호</LabelCell>
                    <Separator>|</Separator>
                    <ValueCell>{profile.title?.displayName ?? "칭호 없음"}</ValueCell>
                </tr>
                <tr>
                    <LabelCell>별명</LabelCell>
                    <Separator>|</Separator>
                    <ValueCell>{profile.customNickname}</ValueCell>
                </tr>
                <tr>
                    <LabelCell>계정</LabelCell>
                    <Separator>|</Separator>
                    <ValueCell>{profile.email}</ValueCell>
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
    border: 1px solid rgb(229, 231, 235); /* 회색 얇은 테두리 */
    border-radius: 12px;
    box-shadow: none;
    padding: 16px; /* 패딩 조금 줄임 */
    text-align: center;
    background: rgb(249, 250, 251);
    display: flex;
    flex-direction: column;
    gap: 16px;

    width: 100%;          /* ✅ 사이드바 폭에 맞게 */
    max-width: 100%;      /* ✅ 강제 제한 제거 */
    min-width: auto;      /* ✅ 최소 보장 제거 */
    word-break: break-all; /* 긴 이메일 줄바꿈 */
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;


const ProfileImage = styled.img`
    width: 160px;
    height: 160px;
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
    word-break: break-all;   /* 긴 단어 강제 줄바꿈 */
    white-space: normal;     /* nowrap 제거 → 줄바꿈 허용 */
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
    font-size: 13px;
    color: white;
    background: rgb(59, 130, 246);
    border: none;          /* 기본 검정 테두리 제거 */
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:hover {
        background: rgb(37, 99, 235);
    }
`;