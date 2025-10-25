{/* 마이페이지 전체 레이아웃(좌: 프로필+사이드바 / 우: 메인 컨텐츠) */}

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome } from "react-icons/fa";

import SideBar from "./SideBar";
import ProfileAppearanceCard from "../profile/ProfileAppearanceCard.tsx";
import { fetchMyProfile, ProfileAppearanceResponse } from "../../api/profileAppearanceApi.ts";
import { fetchMyTitles, UserTitleResponse } from "../../api/userTitleApi.ts";

export default function MyPageLayout() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [titles, setTitles] = useState<UserTitleResponse[]>([]);

    /** 최신 프로필/칭호 불러오기 */
    const refreshAll = async () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            console.error("로그인이 필요합니다.");
            return;
        }

        try {
            const [p, t] = await Promise.all([
                fetchMyProfile(),
                fetchMyTitles(),
            ]);
            setProfile(p);
            setTitles(t);
        } catch (error) {
            console.error("❌ 데이터 갱신 실패:", error);
        }
    };

    useEffect(() => {
        refreshAll().catch((err) =>
            console.error("초기 데이터 로드 실패:", err)
        );
    }, []);

    return (
        <LayoutContainer>
            {/* === 좌측 사이드 영역 (프로필 + 메뉴) === */}
            <AsideWrapper>
                <Aside>
                    {/* 홈 버튼 */}
                    <HomeButton onClick={() => navigate("/mypage")}>
                        <HomeIcon>
                            <FaHome />
                        </HomeIcon>
                        <HomeLabel>마이페이지</HomeLabel>
                    </HomeButton>

                    {/* 프로필 카드 */}
                    {profile && (
                        <ProfileAppearanceCard
                            profile={profile}
                            titles={titles}
                        />
                    )}

                    {/* 메뉴 */}
                    <SideBar />
                </Aside>
            </AsideWrapper>

            {/* === 메인 컨텐츠 === */}
            <Main>
                <Outlet context={{ profile, titles, refreshAll }} />
            </Main>
        </LayoutContainer>
    );
}

/* ================== styled-components ================== */

// 전체 레이아웃 컨테이너
const LayoutContainer = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    min-height: 100%;
    gap: 0;
`;

// 좌측 사이드바 wrapper
const AsideWrapper = styled.div`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    width: 240px;

    @media (min-width: 1024px) {
        width: 300px;
    }
`;

// sticky 사이드바
const Aside = styled.aside`
    position: sticky;
    top: 79px; /* 네브바 높이 */
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 16px;

    height: fit-content;
    max-height: calc(100vh - 79px); /* 뷰포트 기준 최대 높이 */
    overflow-y: auto;
    border-right: 1px solid rgb(229, 231, 235);
    background-color: white;
    z-index: 1;
    width: 100%;
    padding: 12px;
`;

// 메인 컨텐츠
const Main = styled.main`
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    max-width: calc(100% - 240px);

    @media (min-width: 1024px) {
        max-width: calc(100% - 300px);
    }

    @media (max-width: 768px) {
        padding: 16px;
    }
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
