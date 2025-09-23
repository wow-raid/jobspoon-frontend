import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 닉네임 변경 요청 DTO
export interface NicknameRequest {
    nickname: string;
}

// 닉네임 변경 응답 DTO
export interface NicknameResponse {
    nickname: string;
}

// 닉네임 변경
export async function updateNickname(token: string, nickname: string) {
    try {
        const res = await axios.put<NicknameResponse>(
            `${API_BASE_URL}/account-profile/update-nickname`,
            { nickname }, // 요청 DTO에 맞게 키 이름 맞춤
            { headers: { Authorization: token } }
        );
        return res.data;
    } catch (error: any) {
        // 백엔드에서 에러 메시지를 내려줄 경우 추출
        if (error.response?.data) {
            throw new Error(error.response.data.message || error.response.data);
        }
        throw new Error("닉네임 수정 실패");
    }
}
