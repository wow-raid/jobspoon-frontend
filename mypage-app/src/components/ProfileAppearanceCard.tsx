import React, { useEffect, useState } from "react";
import { fetchMyProfile, ProfileAppearanceResponse } from "../api/profileAppearanceApi.ts";
import '../assets/tailwind.css'

export default function ProfileAppearanceCard() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);

    // TODO: 👉 로그인 연동 전까지는 임시 하드코딩
    useEffect(() => {
        const token = "test-token2";
        fetchMyProfile(token)
            .then(setProfile)
            .catch(console.error);
    }, []);

    // TODO: 👉 실제 로그인 붙었을 때 사용할 버전 (주석으로 보관)
    // useEffect(() => {
    //     const token = localStorage.getItem("userToken") || "";
    //     fetchMyProfile(token)
    //         .then(setProfile)
    //         .catch(console.error);
    // }, []);

    // 아직 API 로드 전이면 로딩 표시
    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <div className="p-6 bg-white border rounded shadow text-center space-y-4">
            {/* 프로필 이미지 */}
            <div className=" max-w-md flex justify-center">
                <img
                    src={profile.photoUrl || "/default_profile.png"}
                    alt="profile"
                    className="w-full max-w-[150px] rounded-full object-cover border mx-auto"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default_profile.png";
                    }}
                />
            </div>

            {/* 기본 정보 */}
            <p className="font-bold">{profile.customNickname}</p>
            <p className="text-sm text-gray-700">
                등급: {profile.rank?.displayName ?? "등급 없음"}
            </p>
            <p className="text-sm text-gray-700">
                칭호: {profile.title?.displayName ?? "칭호 없음"}
            </p>

            {/* 수정 버튼 */}
            <button className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                수정하기
            </button>
        </div>
    );
}
