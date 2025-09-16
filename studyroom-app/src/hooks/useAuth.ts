import { useState, useEffect } from 'react';

interface UserProfile {
    id: number;
    nickname: string;
    email: string;
    role: 'LEADER' | 'MEMBER';
}

export const useAuth = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [userNickname, setUserNickname] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<'LEADER' | 'MEMBER' | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const userProfileString = localStorage.getItem("userProfile");
        if (userProfileString) {
            try {
                const userProfile: UserProfile = JSON.parse(userProfileString);
                setUserId(userProfile.id);
                setUserNickname(userProfile.nickname);
                setUserRole(userProfile.role);
                setCurrentUserId(userProfile.id);
            } catch (error) {
                console.error("사용자 프로필 정보를 파싱하는데 실패했습니다:", error);
                setCurrentUserId(null);
            }
        }
    }, []);

    const isLoggedIn = userId !== null;

    return { userId, userNickname, userRole, currentUserId, isLoggedIn };
};