import React from "react";
import ProfileAppearanceCard from "./ProfileAppearanceCard";
import {
    FaUser,
    FaShoppingCart,
    FaRegCommentDots,
    FaCalendarAlt,
    FaCrown,
    FaEnvelope,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import '../assets/tailwind.css'

export default function SideBar() {
    return (
        <div className="h-full flex flex-col p-[16px] space-y-[24px] bg-white border-r shadow-sm">
            {/* 프로필 카드 */}
            <ProfileAppearanceCard />

            {/* 메뉴 리스트 */}
            <nav className="flex-1">
                <ul className="space-y-[8px] text-sm">
                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                                hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                                transition-colors duration-200 cursor-pointer">
                            <FaUser className="text-[rgb(107,114,128)]" />
                            회원정보 수정
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                                hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                                transition-colors duration-200 cursor-pointer">
                            <FaCrown className="text-[rgb(107,114,128)]" />
                            구독 내역
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                                hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                                transition-colors duration-200 cursor-pointer">
                            <FaShoppingCart className="text-[rgb(107,114,128)]" />
                            장바구니
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                                hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                                transition-colors duration-200 cursor-pointer">
                            <MdArticle className="text-[rgb(107,114,128)]" />
                            내가 작성한 글
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                                hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                                transition-colors duration-200 cursor-pointer">
                            <FaRegCommentDots className="text-[rgb(107,114,128)]" />
                            내가 작성한 댓글
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                     text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                     hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                     transition-colors duration-200 cursor-pointer">
                            <FaCalendarAlt className="text-[rgb(107,114,128)]" />
                            내 일정
                            <span
                                className="ml-auto min-w-[24px] h-[24px] flex items-center justify-center text-[12px] font-medium rounded-full bg-[rgb(37,99,235)] text-[white]">
                                4
                            </span>
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                                hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                                transition-colors duration-200 cursor-pointer">
                            <FaCrown className="text-[rgb(107,114,128)]" />
                            멤버십
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                     text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                     hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                     transition-colors duration-200 cursor-pointer">
                            <FaEnvelope className="text-[rgb(107,114,128)]" />
                            Messages
                            <span
                                className="ml-auto min-w-[24px] h-[24px] flex items-center justify-center text-[12px] font-medium rounded-full bg-[rgb(37,99,235)] text-[white]">
                                24
                            </span>
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(55,65,81)] rounded-[8px]
                                hover:bg-[rgb(239,246,255)] hover:text-[rgb(37,99,235)]
                                transition-colors duration-200 cursor-pointer">
                            <FaCog className="text-[rgb(107,114,128)]" />
                            Settings
                        </button>
                    </li>

                    <li>
                        <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px]
                                text-[14px] text-[rgb(220,38,38)] rounded-[8px]
                                hover:bg-[rgb(254,242,242)] hover:text-[rgb(185,28,28)]
                                transition-colors duration-200 cursor-pointer">
                            <FaSignOutAlt className="text-[rgb(220,38,38)]" />
                            회원탈퇴
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
