import { useState, useEffect } from 'react';

interface UserProfile {
    id: number;
    nickname: string;
    email: string;
    role: 'LEADER' | 'MEMBER';
}

export const useAuth = () => {
    // ✅ [수정] isLoggedIn을 직접적인 상태로 관리
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // ✅ [수정] 닉네임 상태 추가
    const [nickname, setNickname] = useState<string | null>(null);

    // ✅ [수정] 앱이 로드될 때 localStorage를 확인하는 로직 변경
    useEffect(() => {
        const loggedInFlag = localStorage.getItem("isLoggedIn");
        const userNickname = localStorage.getItem("nickname");

        if (loggedInFlag) {
            setIsLoggedIn(true);
            setNickname(userNickname);
        }
    }, []);

    // ✅ [수정] 더 이상 userId, userRole 등은 이 훅에서 직접 관리할 필요가 없음
    return { isLoggedIn, nickname };
};