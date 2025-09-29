import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** ---------------------- 타입 정의 ---------------------- **/

export interface UserTitleResponse {
    id: number;
    code: string;
    displayName: string;
    description: string;
    isEquipped: boolean;
    acquiredAt: string; // ISO datetime
}

/** ---------------------- API 함수 ---------------------- **/

// 내가 보유한 칭호 목록 조회
export async function fetchMyTitles(): Promise<UserTitleResponse[]> {
    const res = await axios.get<UserTitleResponse[]>(
        `${API_BASE_URL}/user-titles`,
        { withCredentials: true }
    );
    return res.data;
}

// 특정 칭호 장착
export async function equipTitle(titleId: number): Promise<UserTitleResponse> {
    const res = await axios.put<UserTitleResponse>(
        `${API_BASE_URL}/user-titles/${titleId}/equip`,
        {},
        { withCredentials: true }
    );
    return res.data;
}

// 특정 칭호 해제
export async function unequipTitle(): Promise<void> {
    await axios.put(
        `${API_BASE_URL}/user-titles/unequip`,
        {},
        { withCredentials: true }
    );
}
