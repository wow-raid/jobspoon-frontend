import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** ---------------------- 타입 정의 ---------------------- **/

/** 레벨 조회 응답 */
export interface UserLevelResponse {
    level: number;
    exp: number;
    totalExp: number;
    updatedAt: string; // ISO datetime (LocalDateTime → string)
}

/** 레벨 업 이력 응답 */
export interface UserLevelHistoryResponse {
    level: number;
    achievedAt: string; // ISO datetime
}

/** 경험치 추가 요청 */
export interface AddExpRequest {
    amount: number;
}

/** ---------------------- API 함수 ---------------------- **/

// 사용자 레벨 조회
export async function fetchUserLevel(): Promise<UserLevelResponse> {
    const res = await axios.get<UserLevelResponse>(
        `${API_BASE_URL}/user-level`,
        { withCredentials: true }
    );
    return res.data;
}

// 유저 레벨 업 이력 조회
export async function fetchUserLevelHistory(): Promise<UserLevelHistoryResponse[]> {
    const res = await axios.get<UserLevelHistoryResponse[]>(
        `${API_BASE_URL}/user-level/history`,
        { withCredentials: true }
    );
    return res.data;
}

// 경험치 추가
export async function addExperience(request: AddExpRequest): Promise<UserLevelResponse> {
    const res = await axios.post<UserLevelResponse>(
        `${API_BASE_URL}/user-level/experience`,
        request,
        { withCredentials: true }
    );
    return res.data;
}
