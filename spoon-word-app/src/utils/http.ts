import axios from "axios";

/** 백엔드 베이스 URL (환경변수 우선, 없으면 로컬) */
export const API_BASE =
    (import.meta as any)?.env?.VITE_API_BASE_URL ?? "http://localhost:8080";

/** 로컬/세션 스토리지에서 userToken 추출 */
export function getUserToken(): string | null {
    return (
        localStorage.getItem("userToken") ||
        sessionStorage.getItem("userToken") ||
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken")
    );
}

/** Authorization 헤더 */
export function authHeader() {
    const t = getUserToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
}

/** 공통 axios 인스턴스 */
const http = axios.create({
    baseURL: API_BASE,
});

export default http;