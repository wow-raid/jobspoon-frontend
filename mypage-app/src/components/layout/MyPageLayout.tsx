{/* 마이페이지 전체 레이아웃(좌: 프로필+사이드바 / 우: 메인 컨텐츠) */}

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
            await new Promise((r) => setTimeout(r, 2000)); // ✅ 테스트용 지연
            const [p, t] = await Promise.all([fetchMyProfile(), fetchMyTitles()]);
            setProfile(p);
            setTitles(t);
        } catch (error) {
            console.error("❌ 데이터 갱신 실패:", error);
            notifyError("프로필 정보를 불러오지 못했습니다."); // ✅ 추가
        }
    };

    useEffect(() => {
        // ✅ 로딩 시작
        setIsLoading(true);
        refreshAll()
            .catch((err) => console.error("초기 데이터 로드 실패:", err))
            .finally(() => setIsLoading(false)); // ✅ 로딩 종료
    }, []);
    return (
        <>
            {/* ✅ 전역 Footer z-index 적용 */}
            <GlobalFooterStyle />

            <LayoutContainer>
                {/* 좌측 고정 사이드바 */}
                <FixedAside>
                    <HomeButton onClick={() => navigate("/mypage")}>
                        <HomeIcon>
                            <FaHome />
                        </HomeIcon>
                        <HomeLabel>마이페이지</HomeLabel>
                    </HomeButton>

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

/* ================== styled-components ================== */

/** ✅ Footer가 사이드바 위로 올라오게 하는 전역 스타일 */
const GlobalFooterStyle = createGlobalStyle`
    footer {
        position: relative;
        z-index: 20; /* 사이드바보다 위 */
    }
`;

/** 전체 컨테이너 */
const LayoutContainer = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    position: relative;
    padding-bottom: 400px; /* Footer 높이(약 392px)에 맞춰 조정 */
`;

/** ✅ 완전 고정 사이드바 */
const FixedAside = styled.aside`
    position: fixed;
    top: 79px; /* 네브바 높이 아래 */
    left: calc(10%); /* 80% 중앙 정렬 기준의 왼쪽 */
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

/** ✅ 메인 콘텐츠 영역 */
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

/** 홈 버튼 */
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
