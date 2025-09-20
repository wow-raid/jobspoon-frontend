import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** 출석률 */
export interface AttendanceRateResponse {
    attendanceRate: number;
    attended: number;
    totalDays: number;
}

/** 퀴즈 완료 현황 */
export interface QuizCompletionResponse {
    totalCount: number;    // 누적 완료 수
    monthlyCount: number;  // 이번 달 완료 수
}

/** 글쓰기 활동 통계 */
export interface WritingCountResponse {
    posts: number;
    studyrooms: number;
    comments: number;
    total: number;
}

// 출석률 조회
export async function getAttendanceRate(token: string) {
    const res = await axios.get<AttendanceRateResponse>(
        `${API_BASE_URL}/user-dashboard/attendance/rate`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 퀴즈 완료 현황 조회
export async function getQuizCompletion(token: string) {
    const res = await axios.get<QuizCompletionResponse>(
        `${API_BASE_URL}/user-dashboard/quiz/completion`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 글쓰기 활동 통계 조회
export async function getWritingCount(token: string) {
    const res = await axios.get<WritingCountResponse>(
        `${API_BASE_URL}/user-dashboard/writing/count`,
        { headers: { Authorization: token } }
    );
    return res.data;
}