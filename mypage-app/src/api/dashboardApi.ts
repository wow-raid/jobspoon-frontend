import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface AttendanceRateResponse {
    attendanceRate: number;
    attended: number;
    totalDays: number;
}

export interface InterviewCompletionResponse {
    interviewTotalCount: number;
    interviewMonthlyCount: number;
}

export interface QuizCompletionResponse {
    quizTotalCount: number;
    quizMonthlyCount: number;
}

// 출석률(get)
export const getAttendanceRate = async (token: string) => {
    const res = await axios.get(`${API_BASE_URL}/user-dashboard/attendance/rate`, {
        headers: { Authorization: token }, // 매개변수 그대로 사용
    });
    return res.data;
};

// 인터뷰 완료 현황(get)
export const getInterviewCompletion = async (token: string) => {
    const res = await axios.get(`${API_BASE_URL}/user-dashboard/interview/completion`, {
        headers: { Authorization: token },
    });
    return res.data;
};

// 퀴즈 완료 현황(get)
export const getQuizCompletion = async (token: string) => {
    const res = await axios.get(`${API_BASE_URL}/user-dashboard/quiz/completion`, {
        headers: { Authorization: token },
    });
    return res.data;
}