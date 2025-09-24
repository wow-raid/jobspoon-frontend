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
    quizTotalCount: number;    // 누적 완료 수
    quizMonthlyCount: number;  // 이번 달 완료 수
}

/** 글쓰기 활동 통계 */
export interface WritingCountResponse {
    postCount: number;
    studyroomCount: number;
    commentCount: number;
    totalCount: number;
}

// 출석률 조회
export async function getAttendanceRate() { // token 파라미터 제거
    const res = await axios.get<AttendanceRateResponse>(
        `${API_BASE_URL}/user-dashboard/attendance/rate`,
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 퀴즈 완료 현황 조회
export async function getQuizCompletion() { // token 파라미터 제거
    const res = await axios.get<QuizCompletionResponse>(
        `${API_BASE_URL}/user-dashboard/quiz/completion`,
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 글쓰기 활동 통계 조회
export async function getWritingCount() { // token 파라미터 제거
    const res = await axios.get<WritingCountResponse>(
        `${API_BASE_URL}/user-dashboard/writing/count`,
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}