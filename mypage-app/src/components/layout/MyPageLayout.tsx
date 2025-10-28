/* ====================== 마이페이지 전체 레이아웃 (좌: 프로필+사이드바 / 우: 메인 컨텐츠) ====================== */

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { FaHome } from "react-icons/fa";

import SideBar from "./SideBar";
import ProfileAppearanceCard from "../profile/ProfileAppearanceCard.tsx";
import { fetchMyProfile, ProfileAppearanceResponse } from "../../api/profileAppearanceApi.ts";
import { fetchMyTitles, UserTitleResponse } from "../../api/userTitleApi.ts";
import { notifyError } from "../../utils/toast";
import Spinner from "../common/Spinner.tsx";

export default function MyPageLayout() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [titles, setTitles] = useState<UserTitleResponse[]>([]);

    /** 최신 프로필/칭호 불러오기 */
    const refreshAll = async () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            notifyError("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        try {
            const [p, t] = await Promise.all([fetchMyProfile(), fetchMyTitles()]);
            setProfile(p);
            setTitles(t);
        } catch (error) {
            console.error("❌ 데이터 갱신 실패:", error);
            notifyError("프로필 정보를 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        refreshAll()
            .catch((err) => console.error("초기 데이터 로드 실패:", err))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <>
            {/* 전역 Footer z-index 적용 */}
            <GlobalFooterStyle />

            <LayoutContainer>
                {/* 좌측 고정 사이드바 */}
                <FixedAside>
                    {/* 마이페이지 헤더 블록 추가 */}
                    <HomeHeader onClick={() => navigate("/mypage")}>
                        <HomeHeaderIcon>
                            <FaHome />
                        </HomeHeaderIcon>
                        <HomeHeaderLabel>마이페이지</HomeHeaderLabel>
                    </HomeHeader>

                    {/* 기존 프로필 카드 그대로 유지 */}
                    {profile && (
                        <ProfileAppearanceCard profile={profile} titles={titles} />
                    )}

                    <SideBar />
                </FixedAside>

                {/* 메인 영역 */}
                <Main>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Outlet context={{ profile, titles, refreshAll }} />
                    )}
                </Main>
            </LayoutContainer>
        </>
    );
}

/* ====================== styled-components ====================== */

/** Footer가 사이드바 위로 올라오게 하는 전역 스타일 */
const GlobalFooterStyle = createGlobalStyle`
    footer {
        position: relative;
        z-index: 20;
    }
`;

/** 전체 컨테이너 */
const LayoutContainer = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    //position: relative;
    //padding-bottom: 400px; /* Footer 높이(약 392px)에 맞춰 조정 */
`;

/** 완전 고정 사이드바 */
const FixedAside = styled.aside`
    position: fixed;
    top: 79px; /* 네브바 높이 아래 */
    left: calc(10%);
    width: 240px;
    height: calc(100vh - 79px);
    overflow-y: auto;
    border-right: 1px solid rgb(229, 231, 235);
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px;
    z-index: 10;

    @media (min-width: 1024px) {
        width: 300px;
    }
`;

/** 마이페이지 헤더 블록 */
const HomeHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 3px 10px rgba(59, 130, 246, 0.25);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 14px rgba(59, 130, 246, 0.3);
    }

    &:active {
        transform: scale(0.98);
    }
`;

/** 아이콘 */
const HomeHeaderIcon = styled.span`
    background: rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
`;

/** 라벨 */
const HomeHeaderLabel = styled.span`
    font-weight: 600;
    font-size: 15px;
    letter-spacing: -0.3px;
`;

/** 메인 콘텐츠 영역 */
const Main = styled.main`
    flex: 1;
    padding: 24px;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (min-width: 1024px) {
        margin-left: 320px;
    }

    @media (max-width: 768px) {
        padding: 16px;
        margin-left: 0;
    }
`;
