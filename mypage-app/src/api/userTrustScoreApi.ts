import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** 최신 신뢰점수 응답 */
export interface TrustScoreResponse {
    attendanceRate: number;     // 출석률 (%)
    attendanceScore: number;    // 출석 점수 (0~40)
    interviewScore: number;     // 모의면접 점수 (0~25)
    problemScore: number;       // 문제풀이 점수 (0~25)
    studyroomScore: number;     // 스터디룸 점수 (0~10)
    totalScore: number;         // 총점 (0~100)
    calculatedAt: string;       // 계산 시각 (ISO datetime)
}

/** 월별 신뢰점수 히스토리 응답 */
export interface TrustScoreHistoryResponse {
    score: number;
    recordedAt: string; // ISO datetime
}


// 최신 신뢰점수 조회
export async function fetchTrustScore(): Promise<TrustScoreResponse> {
    const res = await axios.get<TrustScoreResponse>(
        `${API_BASE_URL}/trust-score`,
        { withCredentials: true }
    );
    return res.data;
}

// 실시간 신뢰점수 계산 (trust_score 테이블 갱신)
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