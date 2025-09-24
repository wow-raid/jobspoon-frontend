{/* 마이페이지 전체 레이아웃(좌, 우만 담당) */}

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import ProfileAppearanceCard from "../profile/ProfileAppearanceCard.tsx";
import styled from "styled-components";
import { FaHome } from "react-icons/fa";
import { fetchMyProfile, ProfileAppearanceResponse } from "../../api/profileAppearanceApi.ts";

export default function MyPageLayout() {

    const navigate = useNavigate();

    {/* 토글 */}
    const [isProfileOpen, setIsProfileOpen] = useState(true);

    {/* 프로필 외형 */}
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);

    //최신 프로필 불러오기
    const refreshProfile = async () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            console.error("로그인이 필요합니다.");
            return;
        }
        try {
            const data = await fetchMyProfile(); // ✅ token 제거
            setProfile(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        refreshProfile();
    }, []);

    return (
        <LayoutContainer>
            {/* 좌측 사이드 영역 (프로필 + 메뉴) */}
            <Aside>

                {/* ✅ 홈 버튼 */}
                <HomeButton onClick={() => navigate("/mypage")}>
                    <HomeIcon>
                        <FaHome />
                    </HomeIcon>
                    <HomeLabel>마이페이지</HomeLabel>
                </HomeButton>

                {/* 프로필 카드 */}
                {profile && <ProfileAppearanceCard profile={profile} />}

                {/* 메뉴 */}
                <SideBar />
            </Aside>

            {/* 메인 컨텐츠 */}
            <Main>
                <Outlet context={{ profile, refreshProfile }} />
            </Main>
        </LayoutContainer>
    );
}

/* ================== styled-components ================== */

// 레이아웃 전체 컨테이너
const LayoutContainer = styled.div`
    display: flex;
    min-height: 100vh;
    width: 100%;
`;

const Aside = styled.aside`
    width: 240px; /* 여기서만 사이드바 폭 조정 */
    border-right: 1px solid rgb(229, 231, 235);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px;

    @media (min-width: 1024px) {
        width:300px; /* 큰 화면에서는 조금 넓게 */
    }
`;

// 메인 컨텐츠
const Main = styled.main`
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

/* === 홈 버튼 === */
const HomeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: rgb(17, 24, 39);
  cursor: pointer;
  border: none;
  background: transparent;
  outline: none;
`;

const HomeIcon = styled.span`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(59, 130, 246);
  color: white;
  border-radius: 6px;
  font-size: 14px;
`;

const HomeLabel = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
`;

const ProfileWrapper = styled.div<{ isOpen: boolean }>`
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    max-height: ${({ isOpen }) => (isOpen ? "1000px" : "0px")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

/* 헤더는 투명 */
const ProfileHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: rgb(17, 24, 39);
    padding: 6px 0;   /* 여백만 주고 배경 제거 */
    margin-bottom: 6px;
    cursor: pointer;
`;

/* 화살표 아이콘만 파란색 배경 */
const ArrowIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(59, 130, 246);  /* 파란색 */
  color: white;
  border-radius: 6px;
  font-size: 14px;
`;