import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
    FaUser,
    FaCalendarAlt,
    FaFolderOpen,
    FaCrown,
    FaSignOutAlt,
    FaExclamationTriangle,
    FaQuestionCircle
} from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import ServiceModal from "../modals/ServiceModal.tsx";

export default function SideBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Wrapper>
            <NavSection>
                <MenuList>
                    <StyledNavLink to="account/edit">
                        <FaUser className="icon" />
                        회원정보
                    </StyledNavLink>

                    <StyledNavLink to="interview/history">
                        <FaFolderOpen className="icon" />
                        면접기록
                    </StyledNavLink>

                    <StyledNavLink to="schedule">
                        <FaCalendarAlt className="icon" />
                        일정관리
                    </StyledNavLink>

                    <StyledNavLink to="my-reports">
                        <FaExclamationTriangle className="icon" />
                        신고내역
                    </StyledNavLink>

                    <StyledNavLink to="membership">
                        <FaCrown className="icon" />
                        멤버십
                    </StyledNavLink>

                    <StyledNavLink to="my-posts">
                        <MdArticle className="icon" />
                        작성한 글
                    </StyledNavLink>
                </MenuList>
            </NavSection>

            <BottomSection>
                <StyledNavLink to="inquiry">
                    <FaQuestionCircle className="icon" />
                    문의하기
                </StyledNavLink>

                <StyledNavLink to="withdrawal">
                    <FaSignOutAlt className="icon" />
                    회원탈퇴
                </StyledNavLink>
            </BottomSection>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Wrapper>
    );
}

/* ================== Styled ================== */

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 16px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
`;

const NavSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const MenuList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
`;

const BottomSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: 1px solid #f1f5f9;
    padding-top: 10px;
`;

const StyledNavLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;

    .icon {
        font-size: 16px;
        color: #9ca3af;
        transition: color 0.2s;
    }

    &.active {
        background: #eff6ff;
        color: #2563eb;

        .icon {
            color: #2563eb;
        }
    }

    &:hover {
        background: #f3f8ff;
        color: #2563eb;
        transform: translateX(2px);

        .icon {
            color: #2563eb;
        }
    }
`;
