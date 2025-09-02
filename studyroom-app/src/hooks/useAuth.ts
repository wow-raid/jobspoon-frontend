import { useState, useEffect } from 'react';

interface UserProfile {
    id: number;
    nickname: string;
    email: string;
}

export const useAuth = () => {
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        // vue-account-app이 저장한 사용자 프로필 정보를 localStorage에서 가져옵니다.
        const userProfileString = localStorage.getItem("userProfile");

        if (userProfileString) {
            try {
                const userProfile: UserProfile = JSON.parse(userProfileString);
                setCurrentUserId(userProfile.id); // 저장된 프로필에서 ID를 추출
            } catch (error) {
                console.error("사용자 프로필 정보를 파싱하는데 실패했습니다:", error);
                setCurrentUserId(null);
            }
        }
    }, []);

    return { currentUserId };
};