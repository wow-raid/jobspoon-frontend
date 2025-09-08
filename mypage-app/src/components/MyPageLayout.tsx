import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import ProfileAppearanceCard from "./ProfileAppearanceCard";
import styled from "styled-components";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { fetchMyProfile, ProfileAppearanceResponse } from "../api/profileAppearanceApi.ts";


export default function MyPageLayout() {

    {/* 토글 */}
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    {/* 프로필 외형 */}
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);

    //최신 프로필 불러오기
    const refreshProfile = async () => {
        const token = localStorage.getItem("userToken");
        if(!token) {
            console.error("로그인 토큰 없음");
            return;
        }
        try{
            const data = await fetchMyProfile(token);
            setProfile(data);
        }catch(error){
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
                {/* 토글 버튼 */}
                <ToggleButton onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <ToggleIcon>
                        {isProfileOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </ToggleIcon>
                    <ToggleLabel>마이페이지</ToggleLabel>
                </ToggleButton>

                {/* 프로필 카드 (토글됨) */}
                {isProfileOpen && profile && (
                    <ProfileWrapper isOpen={isProfileOpen}>
                        <ProfileAppearanceCard profile={profile} />
                    </ProfileWrapper>
                )}

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

/* === 토글 관련 === */
const ToggleButton = styled.button`
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

const ToggleIcon = styled.span`
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

const ToggleLabel = styled.span`
  background: rgb(249, 250, 251);
  padding: 2px 6px;
  border-radius: 4px;
`;

const ProfileWrapper = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  max-height: ${({ isOpen }) => (isOpen ? "1000px" : "0px")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;