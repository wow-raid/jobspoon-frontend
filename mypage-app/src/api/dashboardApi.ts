import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export interface AttendanceRateResponse {
    attendanceRate: number;
    attended: number;
    totalDays: number;
}

export interface InterviewCompletionResponse {
    interviewTotalCount: number;
    interviewMonthlyCount: number;
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