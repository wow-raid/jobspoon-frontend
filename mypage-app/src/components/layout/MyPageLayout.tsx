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

/** 전체 컨테이너 */
const LayoutContainer = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    min-height: calc(100vh - 60px); /* 약간 여유 */
    height: auto;
    overflow-y: visible;
`;

/** 완전 고정 사이드바 */
const FixedAside = styled.aside`
    position: sticky;
    top: 80px; /* 스크롤 시 고정되게 */
    align-self: flex-start;
    width: 240px;
    height: fit-content; /* 사이드바도 콘텐츠에 맞게 */
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px;

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
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
    }

    &:active {
        transform: translateY(0);
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
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: calc(100vh - 80px); /* 뷰포트보다 살짝 여유 */
    overflow-y: auto; /* 내부 스크롤 허용 */
    scroll-behavior: smooth; /* 부드러운 스크롤 */
    padding-bottom: 60px; /* 여유 공간 */

    @media (max-width: 768px) {
        padding: 16px;
        margin-left: 0;
    }
`;