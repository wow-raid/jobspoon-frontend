import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export type TechStackDto = {
    key: string;
    displayName: string;
};

export type UserTechStackResponse = {
    hasInterview: boolean;
    job: string | null;
    techStacks: TechStackDto[] | null;
    message: string | null;
};

/** 나의 기술 스택 정보 조회*/
export const fetchMyTechStack = async (): Promise<UserTechStackResponse> => {
    const res = await axios.get(`${API_BASE_URL}/api/interview/my-techstack`, {
        withCredentials: true,
    });
    return res.data;
}