import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 프로필 조회 응답
export interface ProfileAppearanceResponse {
    photoUrl: string | null;
    customNickname: string;
    rank?: { id?: number; code: string; displayName: string };
    title?: { id?: number; code: string; displayName: string };
    email?: string;
}

// 공통 Rank/Title 이력 타입
export interface HistoryItem{
    id: number;
    code: string;
    displayName: string;
    acquiredAt: string; // ISO datetime
}

// 내 프로필 조회
export async function fetchMyProfile(token: string) {
    const res = await axios.get<ProfileAppearanceResponse>(
        `${API_BASE_URL}/profile-appearance/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 프로필 사진 교체
export async function updateProfilePhoto(token: string, photoUrl: string) {
    const res = await axios.put<ProfileAppearanceResponse>(
        `${API_BASE_URL}/profile-appearance/photo`,
        { photoUrl },
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 닉네임 변경
export async function updateNickname(token: string, customNickname: string) {
    try{
        const res = await axios.put<ProfileAppearanceResponse>(
            `${API_BASE_URL}/profile-appearance/nickname`,
            { customNickname },
            { headers: { Authorization: token } }
        );
        return res.data;
    }catch(error: any){
        // 백엔드에서 IllegalArgumentException 메시지를 그대로 뽑아서 throw
        if(error.response?.data) {
            throw new Error(error.response.data.message || error.response.data);
        }
        throw new Error("닉네임 수정 실패");
    }
}

// 보유 랭크 조회
export async function fetchMyRanks(token: string): Promise<HistoryItem[]> {
    const res = await axios.get<HistoryItem[]>(
        `${API_BASE_URL}/profile-appearance/rank/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 랭크 장착
export async function equipRank(token: string, rankId: number): Promise<HistoryItem> {
    const res = await axios.put<HistoryItem>(
        `${API_BASE_URL}/profile-appearance/rank/${rankId}/equip`,
        {},
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 보유 칭호 조회
export async function fetchMyTitles(token: string): Promise<HistoryItem[]> {
    const res = await axios.get<HistoryItem[]>(
        `${API_BASE_URL}/profile-appearance/title/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 칭호 장착
export async function equipTitle(token: string, titleId: number): Promise<HistoryItem> {
    const res = await axios.put<HistoryItem>(
        `${API_BASE_URL}/profile-appearance/title/${titleId}/equip`,
        {},
        { headers: { Authorization: token } }
    );
    return res.data;
}