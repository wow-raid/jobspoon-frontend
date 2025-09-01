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
        <div className="h-full flex flex-col p-4 space-y-6 bg-white border-r shadow-sm">
            {/* 프로필 카드 */}
            <ProfileAppearanceCard />

            {/* 메뉴 리스트 */}
            <nav className="flex-1">
                <ul className="space-y-1 text-sm">
                    {/* 공통 스타일: group + hover 효과 */}
                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaUser className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">회원정보 수정</span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaCrown className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">구독 내역</span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaShoppingCart className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">장바구니</span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <MdArticle className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">내가 작성한 글</span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaRegCommentDots className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">내가 작성한 댓글</span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaCalendarAlt className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">내 일정</span>
                        {/* 뱃지 */}
                        <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            3
                        </span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaCrown className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">멤버십</span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaEnvelope className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">Messages</span>
                        <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            24
                        </span>
                    </li>

                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                        <FaCog className="text-gray-600 group-hover:text-blue-600" />
                        <span className="group-hover:text-blue-600">Settings</span>
                    </li>

                    {/* 회원탈퇴: 빨간색 강조 */}
                    <li className="group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 cursor-pointer hover:bg-red-50">
                        <FaSignOutAlt className="text-red-500 group-hover:text-red-600" />
                        <span className="text-red-500 group-hover:text-red-600">
                            회원탈퇴
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
