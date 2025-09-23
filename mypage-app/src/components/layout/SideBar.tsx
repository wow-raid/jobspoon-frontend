{/* 마이페이지 사이드바 레이아웃 */}

import React, { useState } from "react";
import ServiceModal from "../modals/ServiceModal.tsx";
import {
    FaUser,
    FaCalendarAlt,
    FaFolderOpen,
    FaCrown,
    FaSignOutAlt,
    FaChartLine
} from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

export default function SideBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 공통 모달 오픈 함수
    const handleOpenModal = () => setIsModalOpen(true);

    return (
        <Container>
            {/* 메뉴 리스트 */}
            <Nav>
                <ul>
                    <li>
                        <StyledNavLink to="account/edit">
                            <FaUser className="icon" />
                            회원정보 수정
                        </StyledNavLink>
                    </li>

                    <li>
                        <StyledNavLink to="user/history">
                            <FaChartLine className="icon" />
                            이력 관리
                            {/* 하위에 신뢰점수, 랭크, 칭호 이력 나오도록 페이지 구성 */}
                        </StyledNavLink>
                    </li>

                    <li>
                        <StyledNavLink to="membership">
                            <FaCrown className="icon" />
                            멤버십
                            {/* 하위에 내 구독 내역 나오도록 페이지 구성 */}
                        </StyledNavLink>
                    </li>

                    <li>
                        <StyledNavLink to="interview/history">
                            <FaFolderOpen className="icon" />
                            면접 기록 보관함
                        </StyledNavLink>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <MdArticle className="icon" />
                            작성한 글
                            {/* 하위에 모임, 댓글, 리뷰 내역 나오도록 페이지 구성 */}
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaCalendarAlt className="icon" />
                            일정
                            <Badge>4</Badge>
                        </NavButton>
                    </li>

                    {/* 구분선 */}
                    <Divider />

                    <li>
                        <StyledNavLink to="withdrawal">
                            <FaSignOutAlt className="icon" />
                            회원탈퇴
                        </StyledNavLink>
                    </li>
                </ul>
            </Nav>

            {/* 모달 */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} />
        </Container>
    );
}

/* ================== styled-components ================== */

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 16px;
    box-sizing: border-box; /* 폭 계산 시 패딩 포함 */
    width: 100%; /* 사이드바 크기 자동 따라감 */
`;

const Nav = styled.nav`
    flex: 1;
    ul {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 0;
        padding: 0;
        list-style: none;  /* 불릿 제거 */
    }
`;
const NavButton = styled.button<{ active?: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    color: ${({ active }) => 
            (active ? "rgb(37, 99, 235)" : "rgb(55, 65, 81)")};
    background: ${({ active }) => 
            (active ? "rgb(239, 246, 255)" : "transparent")};

    .icon {
        color: ${({ active }) => 
                (active ? "rgb(37, 99, 235)" : "rgb(107, 114, 128)")};
    }

    &:hover {
        background: rgb(239, 246, 255);
        color: rgb(37, 99, 235);

        .icon {
            color: rgb(37, 99, 235);
        }
    }
`;

const Badge = styled.span`
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  border-radius: 9999px;
  background: rgb(219, 234, 254);
  color: rgb(37, 99, 235);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgb(229, 231, 235);
  margin: 12px 0;
`;

/* NavLink 전용 스타일 */
const StyledNavLink = styled(NavLink)`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;

    color: rgb(55, 65, 81);
    background: transparent;

    .icon {
        color: rgb(107, 114, 128);
    }

    /* 활성화 상태 */
    &.active {
        background: rgb(239, 246, 255);   /* hover와 같은 파란 배경 */
        color: rgb(37, 99, 235);

        .icon {
            color: rgb(37, 99, 235);
        }
    }

    &:hover {
        background: rgb(239, 246, 255);
        color: rgb(37, 99, 235);

        .icon {
            color: rgb(37, 99, 235);
        }
    }
`;