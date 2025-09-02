import React from "react";

export default function ProfileAppearanceCardEdit() {
    return (
        <div className="p-6 bg-white rounded-[12px] shadow">
            <section className="p-[24px] space-y-[24px]">
                {/* 제목 */}
                <h2 className="text-[18px] font-[700] text-[rgb(17,24,39)]">프로필 수정</h2>

                {/* 닉네임 수정 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                        닉네임
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="새 닉네임을 입력하세요"
                    />
                </div>

                {/* 프로필 사진 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                        프로필 사진
                    </label>
                    <div className="flex items-center gap-6">
                        <img
                            src="/default_profile.png"
                            alt="미리보기"
                            className="w-24 h-24 rounded-full object-cover border border-gray-300"
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg
                       hover:bg-blue-600 transition-colors duration-200"
                        >
                            사진 업로드
                        </button>
                    </div>
                </div>

                {/* 버튼 그룹 */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg
                     hover:bg-gray-300 transition-colors duration-200"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg
                     hover:bg-blue-600 transition-colors duration-200"
                    >
                        저장하기
                    </button>
                </div>
            </section>
        </div>
    )
}