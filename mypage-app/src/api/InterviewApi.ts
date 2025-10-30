import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** 인터뷰 결과 상세 조회*/
export const fetchInterviewResult = async (interviewId: number) => {
    const res = await axios.get(
        `${API_BASE_URL}/api/interview/result/${interviewId}`, {
            withCredentials: true,
        });
    return res.data;
}

/** 인터뷰 결과 리스트*/
export const fetchInterviewResultList = async () => {
    const res = await axios.get(
        `${API_BASE_URL}/api/interview/result/list`, {
            withCredentials: true,
        });
    return res.data;
}