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


// import React, { useState } from "react";
// import ProfileAppearanceCard from "./ProfileAppearanceCard";
// import ServiceModal from "./ServiceModal.tsx";
// import {
//     FaUser,
//     FaShoppingCart,
//     FaRegCommentDots,
//     FaCalendarAlt,
//     FaCrown,
//     FaEnvelope,
//     FaCog,
//     FaSignOutAlt,
//     FaChevronDown,
//     FaChevronRight
// } from "react-icons/fa";
// import { MdArticle } from "react-icons/md";
// import "../assets/tailwind.css";
//
// export default function SideBar() {
//     const [isProfileOpen, setIsProfileOpen] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//
//     // 공통 모달 오픈 함수
//     const handleOpenModal = () => setIsModalOpen(true);
//
//     return (
//         <div className="h-full flex flex-col p-[16px] space-y-[24px] shadow-sm">
//
//             {/* 마이페이지 토글 버튼 */}
//             <button
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center gap-[10px] text-[16px] font-[600] text-[rgb(17,24,39)] cursor-pointer">
//                 <span className="w-[28px] h-[28px] flex items-center justify-center bg-[rgb(59,130,246)] text-[white] rounded-[6px] text-[14px]">
//                     {isProfileOpen ? <FaChevronDown /> : <FaChevronRight />}
//                 </span>
//                 <span className="bg-[rgb(249,250,251)] px-[6px] py-[2px] rounded">
//                     마이페이지
//                 </span>
//             </button>
//
//             {/* 프로필 카드 (토글됨) */}
//             <div
//                 className={`overflow-hidden transition-all duration-300 ease-in-out`}
//                 style={{ maxHeight: isProfileOpen ? "1000px" : "0px", opacity: isProfileOpen ? 1 : 0 }}
//             >
//                 <ProfileAppearanceCard />
//             </div>
//
//             {/* 메뉴 리스트 */}
//             <nav className="flex-1">
//                 <ul className="space-y-[8px] text-sm">
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaUser className="text-[rgb(107,114,128)]" />
//                             회원정보 수정
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaCrown className="text-[rgb(107,114,128)]" />
//                             구독 내역
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaShoppingCart className="text-[rgb(107,114,128)]" />
//                             장바구니
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <MdArticle className="text-[rgb(107,114,128)]" />
//                             내가 작성한 글
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaRegCommentDots className="text-[rgb(107,114,128)]" />
//                             내가 작성한 댓글
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaCalendarAlt className="text-[rgb(107,114,128)]" />
//                             내 일정
//                             <span className="ml-auto min-w-[24px] h-[24px] flex items-center justify-center text-[12px] font-medium rounded-full bg-[rgb(37,99,235)] text-[white]">
//                                 4
//                             </span>
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaCrown className="text-[rgb(107,114,128)]" />
//                             멤버십
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaEnvelope className="text-[rgb(107,114,128)]" />
//                             Messages
//                             <span className="ml-auto min-w-[24px] h-[24px] flex items-center justify-center text-[12px] font-medium rounded-full bg-[rgb(37,99,235)] text-[white]">
//                                 24
//                             </span>
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(55,65,81)] rounded-[8px]
//                                        hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaCog className="text-[rgb(107,114,128)]" />
//                             Settings
//                         </button>
//                     </li>
//
//                     <li>
//                         <button
//                             onClick={handleOpenModal}
//                             className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
//                                        text-[14px] text-[rgb(220,38,38)] rounded-[8px]
//                                        hover:bg-[rgb(254,242,242)] hover:text-[rgb(185,28,28)]
//                                        transition-colors duration-200 cursor-pointer">
//                             <FaSignOutAlt className="text-[rgb(220,38,38)]" />
//                             회원탈퇴
//                         </button>
//                     </li>
//                 </ul>
//             </nav>
//
//             {/* 모달은 항상 최하단에서 관리 */}
//             <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//         </div>
//     );
// }