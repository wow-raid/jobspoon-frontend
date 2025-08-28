import React from "react";
import ProfileAppearanceCard from "./ProfileAppearanceCard";

export default function SideBar() {
    return (
        <div className="h-full space-y-6 p-4">
            {/* 프로필 카드 */}
            <ProfileAppearanceCard />

            {/* 나의 계정 정보 */}
            <div className="bg-white border p-3 rounded">
                <p className="font-semibold mb-2">&lt;나의 계정 정보&gt;</p>
                <div className="flex flex-col space-y-2">
                    <button className="px-3 py-2 bg-black text-white rounded">
                        회원정보 수정
                    </button>
                    <button className="px-3 py-2 bg-black text-white rounded">
                        회원탈퇴
                    </button>
                </div>
            </div>

            {/* 나의 주문 정보 */}
            <div className="bg-white border p-3 rounded">
                <p className="font-semibold mb-2">&lt;나의 주문 정보&gt;</p>
                <div className="flex flex-col space-y-2">
                    <button className="px-3 py-2 bg-black text-white rounded">
                        장바구니
                    </button>
                    <button className="px-3 py-2 bg-black text-white rounded">
                        구독 내역
                    </button>
                </div>
            </div>

            {/* 나의 게시글 정보 */}
            <div className="bg-white border p-3 rounded">
                <p className="font-semibold mb-2">&lt;나의 게시글 정보&gt;</p>
                <div className="flex flex-col space-y-2">
                    <button className="px-3 py-2 bg-black text-white rounded">
                        내가 작성한 글
                    </button>
                    <button className="px-3 py-2 bg-black text-white rounded">
                        내가 작성한 모임글
                    </button>
                    <button className="px-3 py-2 bg-black text-white rounded">
                        내가 작성한 댓글
                    </button>
                </div>
            </div>

            {/* 나의 일정 정보 */}
            <div className="bg-white border p-3 rounded">
                <p className="font-semibold mb-2">&lt;나의 일정 정보&gt;</p>
                <div className="flex flex-col space-y-2">
                    <button className="px-3 py-2 bg-black text-white rounded">
                        내 일정
                    </button>
                    <button className="px-3 py-2 bg-black text-white rounded">
                        내 모임 일정
                    </button>
                </div>
            </div>
        </div>
    );
}
