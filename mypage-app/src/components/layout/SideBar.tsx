import React, { useState } from "react";
import ServiceModal from "../modals/ServiceModal.tsx";
import {
    FaUser,
    FaRegCommentDots,
    FaCalendarAlt,
    FaCrown,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import styled from "styled-components";

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

                    {/* 구분선 */}
                    <Divider />

                    <li>
                        <NavButton onClick={handleOpenModal}>
                            <FaCog className="icon" />
                            설정
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

            {/* 모달 */}
            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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