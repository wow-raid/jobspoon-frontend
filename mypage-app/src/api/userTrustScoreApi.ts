import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** ---------------------- 타입 정의 ---------------------- **/

/** 최신 신뢰점수 응답 */
export interface TrustScoreResponse {
    accountId: number;
    attendanceRate: number;
    monthlyInterviews: number;
    monthlyProblems: number;
    monthlyPosts: number;
    monthlyStudyrooms: number;
    monthlyComments: number;
    totalScore: number;
    calculatedAt: string; // ISO datetime
}

/** 월별 신뢰점수 히스토리 응답 */
export interface TrustScoreHistoryResponse {
    score: number;
    recordedAt: string; // ISO datetime
}

/** ---------------------- API 함수 ---------------------- **/

// 최신 신뢰점수 조회
export async function fetchTrustScore(): Promise<TrustScoreResponse> {
    const res = await axios.get<TrustScoreResponse>(
        `${API_BASE_URL}/trust-score`,
        { withCredentials: true }
    );
    return res.data;
}

// 최신 신뢰점수 갱신 (DB 저장)
export async function calculateTrustScore(): Promise<TrustScoreResponse> {
    const res = await axios.post<TrustScoreResponse>(
        `${API_BASE_URL}/trust-score/calculate`,
        {},
        { withCredentials: true }
    );
    return res.data;
}

// 월별 신뢰점수 히스토리 조회
export async function fetchTrustScoreHistory(): Promise<TrustScoreHistoryResponse[]> {
    const res = await axios.get<TrustScoreHistoryResponse[]>(
        `${API_BASE_URL}/trust-score/history`,
        { withCredentials: true }
    );
    return res.data;
}