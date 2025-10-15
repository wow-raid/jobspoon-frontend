import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** ---------------------- 타입 정의 ---------------------- **/

export interface UserScheduleRequest {
    title: string;
    description?: string;
    startTime: string | null;
    endTime: string | null;
    location?: string;
    allDay: boolean;
    color?: string;
}

export interface UserScheduleResponse {
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    allDay: boolean;
    color?: string;
}

/** ---------------------- API 함수 ---------------------- **/

// 일정 등록
export async function createUserSchedule(data: UserScheduleRequest): Promise<UserScheduleResponse> {
    const res = await axios.post(`${API_BASE_URL}/user-schedule/create`, data, {
        withCredentials: true,
    });
    return res.data;
}

// 전체 조회
export async function fetchUserSchedules(): Promise<UserScheduleResponse[]> {
    const res = await axios.get(`${API_BASE_URL}/user-schedule/list`, {
        withCredentials: true,
    });
    return res.data;
}

// 상세 조회
export async function fetchUserScheduleDetail(id: number): Promise<UserScheduleResponse> {
    const res = await axios.get(`${API_BASE_URL}/user-schedule/get/${id}`, {
        withCredentials: true,
    });
    return res.data;
}

// 일정 수정
export async function updateUserSchedule(
    id: number,
    data: Partial<UserScheduleRequest>
): Promise<UserScheduleResponse> {
    const res = await axios.put(`${API_BASE_URL}/user-schedule/update/${id}`, data, {
        withCredentials: true,
    });
    return res.data;
}

// 일정 삭제
export async function deleteUserSchedule(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/user-schedule/delete/${id}`, {
        withCredentials: true,
    });
}