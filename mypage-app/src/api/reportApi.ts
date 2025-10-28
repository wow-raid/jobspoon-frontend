import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* ----------------------------- Enum 타입 정의 ----------------------------- */
export type ReportStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";
export type ReportCategory =
    | "SPAM"
    | "HARASSMENT"
    | "INAPPROPRIATE_CONTENT"
    | "OFF_TOPIC"
    | "ETC";
export type ReportType = "STUDY_ROOM" | "BOARD_POST";

/* ----------------------------- Response DTO ----------------------------- */
export interface CreateReportResponse {
    id: number;
    reporterNickname: string;
    reportedUserNickname: string;
    reportType: ReportType;
    sourceId: number;
    category: ReportCategory;
    description: string;
    status: ReportStatus;
    createdAt: string;
}

/* 내가 신고한 내역 조회 */
export async function fetchMyReports(): Promise<CreateReportResponse[]> {
    const res = await axios.get(
        `${API_BASE_URL}/api/study-rooms/reports/my`,
        { withCredentials: true }
    );
    return res.data;
}