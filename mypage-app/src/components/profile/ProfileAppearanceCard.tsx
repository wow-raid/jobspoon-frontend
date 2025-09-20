{/* 프로필 카드 */}

import React, { useState } from "react";
import { ProfileAppearanceResponse } from "../../api/profileAppearanceApi.ts";
import styled from "styled-components";
import defaultProfile from "../../assets/default_profile.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ProfileAppearanceCard({profile}: {profile: ProfileAppearanceResponse}) {
    const [isOpen, setIsOpen] = useState(true);

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <Card>
            {/* 헤더 */}
            <Header onClick={() => setIsOpen(!isOpen)}>
                <span>내 프로필</span>
                <ArrowIcon>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </ArrowIcon>
            </Header>

            {/* 본문 (토글됨) */}
            {isOpen && (
                <Content>
                    <ImageWrapper>
                        <ProfileImage
                            src={profile.photoUrl || defaultProfile}
                            alt="profile"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = defaultProfile;
                            }}
                        />
                    </ImageWrapper>

                    <InfoTable>
                        <tbody>
                        <tr>
                            <LabelCell>레벨</LabelCell> {/* 등급 → 레벨 */}
                            <Separator>|</Separator>
                            <ValueCell>
                                {profile.userLevel
                                    ? `Lv.${profile.userLevel.level} (Exp ${profile.userLevel.exp}/${profile.userLevel.totalExp})`
                                    : "레벨 정보 없음"}
                            </ValueCell>
                        </tr>
                        <tr>
                            <LabelCell>칭호</LabelCell>
                            <Separator>|</Separator>
                            <ValueCell>{profile.title?.displayName ?? "칭호 없음"}</ValueCell>
                        </tr>
                        <tr>
                            <LabelCell>별명</LabelCell>
                            <Separator>|</Separator>
                            <ValueCell>{profile.nickname}</ValueCell> {/* ✅ customNickname → nickname */}
                        </tr>
                        {/*<tr>*/}
                        {/*    <LabelCell>계정</LabelCell>*/}
                        {/*    <Separator>|</Separator>*/}
                        {/*    <ValueCell>{profile.email}</ValueCell>*/}
                        {/*</tr>*/}
                        </tbody>
                    </InfoTable>
                </Content>
            )}
        </Card>
    );
}

/* ================== styled-components ================== */

const Card = styled.div`
    border: 1px solid rgb(229, 231, 235);
    border-radius: 12px;
    padding: 12px;
    background: rgb(249, 250, 251);
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: rgb(17, 24, 39);
    cursor: pointer;
`;

const ArrowIcon = styled.span`
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(59, 130, 246);
    color: white;
    border-radius: 6px;
    font-size: 14px;
`;

const Content = styled.div`
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    padding-bottom: 24px;   /* 하단 공간 확보 */
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
    word-break: break-all;
    white-space: normal;
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
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:hover {
        background: rgb(37, 99, 235);
    }
`;