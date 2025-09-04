import React, { useState } from "react";
import ProfileAppearanceCard from "./ProfileAppearanceCard";
import ServiceModal from "./ServiceModal.tsx";
import {
    FaUser,
    FaShoppingCart,
    FaRegCommentDots,
    FaCalendarAlt,
    FaCrown,
    FaEnvelope,
    FaCog,
    FaSignOutAlt,
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import styled from "styled-components";

export default function SideBar() {
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 공통 모달 오픈 함수
    const handleOpenModal = () => setIsModalOpen(true);

    return (
        <Container>
            {/* 마이페이지 토글 버튼 */}
            <ToggleButton onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <ToggleIcon>
                    {isProfileOpen ? <FaChevronDown /> : <FaChevronRight />}
                </ToggleIcon>
                <ToggleLabel>마이페이지</ToggleLabel>
            </ToggleButton>

            {/* 프로필 카드 (토글됨) */}
            <ProfileWrapper isOpen={isProfileOpen}>
                <ProfileAppearanceCard />
            </ProfileWrapper>

            {/* 메뉴 리스트 */}
            <Nav>
                <ul>
                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaUser className="icon" />
                            회원정보 수정
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaCrown className="icon" />
                            구독 내역
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaShoppingCart className="icon" />
                            장바구니
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <MdArticle className="icon" />
                            내가 작성한 글
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaRegCommentDots className="icon" />
                            내가 작성한 댓글
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaCalendarAlt className="icon" />
                            내 일정
                            <Badge>4</Badge>
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaCrown className="icon" />
                            멤버십
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaEnvelope className="icon" />
                            Messages
                            <Badge>24</Badge>
                        </NavButton>
                    </li>

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaCog className="icon" />
                            Settings
                        </NavButton>
                    </li>

                    <li>
                        <DangerButton onClick={handleOpenModal}>
                            <FaSignOutAlt className="icon" />
                            회원탈퇴
                        </DangerButton>
                    </li>
                </ul>
            </Nav>

            {/* 모달은 항상 최하단에서 관리 */}
            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Container>
    );
}

/* ================== styled-components ================== */

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ToggleButton = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    color: rgb(17, 24, 39);
    cursor: pointer;
    border: none;              /* 기본 테두리 제거 */
    background: transparent;   /* 기본 배경 제거 */
    outline: none;             /* 포커스 시 파란 테두리 제거 (원하면 유지해도 됨) */
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

const Nav = styled.nav`
  flex: 1;
  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
  }
`;

const NavButton = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    font-size: 14px;
    color: rgb(55, 65, 81);
    border: none;              /* 기본 회색 테두리 제거 */
    background: transparent;   /* 기본 회색 배경 제거 */
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    .icon {
        color: rgb(107, 114, 128);
    }

    &:hover {
        background: rgb(239, 246, 255);
        color: rgb(37, 99, 235);

        .icon {
            color: rgb(37, 99, 235);
        }
    }
`;

const DangerButton = styled(NavButton)`
  color: rgb(220, 38, 38);

  .icon {
    color: rgb(220, 38, 38);
  }

  &:hover {
    background: rgb(254, 242, 242);
    color: rgb(185, 28, 28);

    .icon {
      color: rgb(185, 28, 28);
    }
  }
`;

const Badge = styled.span`
  margin-left: auto;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  border-radius: 9999px;
  background: rgb(37, 99, 235);
  color: white;
`;