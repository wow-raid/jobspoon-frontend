import React, { useState } from "react";

interface ProfileAppearance {
    photoUrl: string | null;
    customNickname: string;
    rankName: string;
    titleName: string;
}

export default function ProfileAppearanceCard() {
    // 👉 임시 mock 데이터 (추후 API 연동 예정)
    const [profile, setProfile] = useState({
        photoUrl: "", // "/images/default.png"
        customNickname: "테스트유저",
        rankName: "Gold",
        titleName: "열정 개발자",
    });

    const [isEditing, setIsEditing] = useState(false);

    // 파일 업로드 핸들러 (임시 로컬 미리보기용)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setProfile({ ...profile, photoUrl: url });
    };

    return (
        <div className="p-6 bg-white border rounded shadow text-center space-y-4">
            {/* 프로필 이미지 */}
            <div className="flex justify-center">
                <img
                    src={profile.photoUrl || "/default-profile.png"}
                    alt="profile"
                    className="w-full max-w-[200px] aspect-square rounded-full object-cover border mx-auto"
                />
            </div>

            {/* 기본 정보 */}
            <p className="font-bold">{profile.customNickname}</p>
            <p className="text-sm text-gray-700">등급: {profile.rankName}</p>
            <p className="text-sm text-gray-700">칭호: {profile.titleName}</p>

            {/* 수정 버튼 */}
            <button className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                수정하기
            </button>
        </div>
    );
}
