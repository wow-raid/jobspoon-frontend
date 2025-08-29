import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // 마지막 '/' 제거!

export interface ProfileAppearanceResponse {
    photoUrl: string | null;
    nickname: string;
    rank?: { code: string; displayName: string };
    title?: { code: string; displayName: string };
}

export async function fetchMyProfile(token: string) {
    const res = await axios.get(`${API_BASE_URL}/profile-appearance/my`, {
        headers: { Authorization: token },
    });
    return res.data;
}