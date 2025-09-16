import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// ================== 타입 정의 ==================
export interface InterviewItem {
    id: number;
    topic: string;
    yearsOfExperience: number;
    created_at: string;
}

export interface InterviewListResponse {
    interviewList: InterviewItem[];
    totalItems: number;
    success: boolean;
}

export interface CreateInterviewPayload {
    userToken: string;
    jobCategory: number;
    experienceLevel: number;
    projectExperience: number;
    academicBackground: number;
    interviewTechStack: string[];
    companyName: string;
}

export interface CreateInterviewResponse {
    message: string;
    interviewId: number;
    questionId: number;
    question: string;
    success: boolean;
}

export interface RemoveInterviewResponse {
    success: boolean;
    message?: string;
    error?: string;
}

// ================== API 함수 ==================

// 면접 목록 조회
export const fetchInterviewList = async (
    userToken: string,
    page = 1,
    perPage = 10
) => {
    const res = await api.post("/interview/list", {
        userToken,
        page,
        perPage,
    });
    return res.data;
};

// 면접 생성
export const createInterview = async (payload: CreateInterviewPayload) => {
    const res = await api.post("/interview/create", payload);
    return res.data;
};

// 면접 삭제
export const removeInterview = async (
    userToken: string,
    interviewId: number
) => {
    const res = await api.post("/interview/remove", {
        userToken,
        id: interviewId,
    });
    return res.data;
};
