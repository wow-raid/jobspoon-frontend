import axios from "axios";

/** 백엔드 베이스 URL (window 주입 → Node env → 기본값) */
function detectApiBase(): string {
    // 1) 호스트 페이지에서 전역 주입 (권장)
    const fromWindow = (globalThis as any)?.__API_BASE__;
    if (typeof fromWindow === "string" && fromWindow) return fromWindow;

    // 2) Node 환경 변수 (웹팩이 process를 안 넣어줄 수 있으니 안전 가드)
    const env: any =
        typeof process !== "undefined" && (process as any)?.env ? (process as any).env : undefined;
    const fromEnv =
        (env?.VITE_API_BASE_URL as string | undefined) ??
        (env?.REACT_APP_API_BASE_URL as string | undefined);
    if (fromEnv) return fromEnv;

    // 3) 최종 기본값
    return "http://localhost:8080";
}

export const API_BASE = detectApiBase();

/** 로컬/세션 스토리지에서 userToken 추출 */
export function getUserToken() {
    const keys = ["userToken", "accessToken"];
    for (const k of keys) {
        const v = localStorage.getItem(k) || sessionStorage.getItem(k);
        if (v) {
            console.debug(`[auth] using token from ${k}:`, v);
            return v;
        }
    }
    return null;
}

/** Authorization 헤더 */
export function authHeader() {
    const t = getUserToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
}

/** 공통 axios 인스턴스 */
const http = axios.create({ baseURL: API_BASE });

export default http;
