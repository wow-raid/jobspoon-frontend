import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export type InterviewSummary = {
    interviewId: number;
    interviewType: string;
    createdAt: string;
    sender: string;
    finished: boolean;
};

/** 인터뷰 결과 상세 조회 */
export const fetchInterviewResult = async (interviewId: number) => {
    const res = await axios.get(
        `${API_BASE_URL}/api/interview/result/${interviewId}`,
        { withCredentials: true }
    );
    return res.data;
};

/** 인터뷰 결과 리스트 */
export async function fetchInterviewResultList(): Promise<InterviewSummary[]> {
    const res = await axios.get(
        `${API_BASE_URL}/api/interview/result/list`,
        { withCredentials: true }
    );

    // 백엔드 응답이 { interviewResultList: [...] } 형태일 때
    return res.data.interviewResultList ?? [];
}