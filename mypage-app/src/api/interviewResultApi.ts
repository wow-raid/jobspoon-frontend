import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ================== 타입 정의 ==================
export interface EndInterviewResponse {
    message: string;
    interviewResultId: number;
    success: boolean;
}

export interface RequestInterviewSummaryPayload {
    userToken: string;
    interviewId: number;
    jobCategory: number;
    experienceLevel: number;
    projectExperience: number;
    academicBackground: number;
    interviewTechStack: string[];
}

export interface RequestInterviewSummaryResponse {
    message: string;
    summary: string;
    qa_scores: any[]; // 필요하면 세부 타입 정의
    success: boolean;
}

export interface InterviewResultItem {
    question: string;
    answer: string;
    intent: string;
    feedback: string;
}

export interface HexagonScore {
    productivity: number;
    communication: number;
    technical_skills: number;
    documentation_skills: number;
    flexibility: number;
    problem_solving: number;
}

export interface FetchInterviewResultResponse {
    message: string;
    interviewResultList: InterviewResultItem[];
    hexagonScore: HexagonScore;
    success: boolean;
}

// ================== API 함수 ==================

// 면접 종료 (결과 생성)
export const endInterview = async (
    userToken: string,
    interviewId: number
): Promise<EndInterviewResponse> => {
    const res = await api.post("/end-interview", {
        userToken,
        interviewId,
    });
    return res.data;
};

// 요약 + 점수 생성 (FastAPI polling 포함)
export const requestInterviewSummary = async (
    payload: RequestInterviewSummaryPayload
): Promise<RequestInterviewSummaryResponse> => {
    const res = await api.post("/request-interview-summary", payload);
    return res.data;
};

// 면접 결과 조회 (Q/A + hexagon 점수)
export const fetchInterviewResult = async (
    userToken: string
): Promise<FetchInterviewResultResponse> => {
    const res = await api.post("/get-interview-result", { userToken });
    return res.data;
};