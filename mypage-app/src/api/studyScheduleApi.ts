import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface UserStudySchedule {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    studyRoomId: number;
    studyRoomTitle: string;
}

/* 내가 스터디 일정 모두 조회 */
export async function fetchUserStudySchedules(): Promise<UserStudySchedule[]> {
    const res = await axios.get<UserStudySchedule[]>(
        `${API_BASE_URL}/api/my-study/schedules`,
        { withCredentials: true }
    );
    return res.data;
}