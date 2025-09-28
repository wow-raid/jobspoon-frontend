// src/utils/http.ts
import axios from "axios";

/** 백엔드 베이스 URL (window 주입 → Node env → 기본값) */
function detectApiBase(): string {
    // 1) 호스트 페이지에서 전역 주입 (권장)
    const fromWindow = (globalThis as any)?.__API_BASE__;
    if (typeof fromWindow === "string" && fromWindow) return fromWindow;

    // 2) Node 환경 변수
    const env: any =
        typeof process !== "undefined" && (process as any)?.env ? (process as any).env : undefined;
    const fromEnv =
        (env?.VITE_API_BASE_URL as string | undefined) ??
        (env?.REACT_APP_API_BASE_URL as string | undefined);
    if (fromEnv) return fromEnv;

    // 3) 최종 기본값
    return "http://localhost:8080/api";
}

export const API_BASE = detectApiBase();

/** 새 정책: 토큰을 더 이상 쓰지 않음. 레거시 호환을 위해 빈 객체만 반환 */
export function authHeader() {
    return {};
}

/** 공통: params에서 빈 문자열/undefined/null 제거 */
function pruneParams(obj?: Record<string, any>) {
    if (!obj) return obj;
    const out: Record<string, any> = {};
    Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "string" && v.trim() === "") return; // 빈 문자열 제거
        out[k] = v;
    });
    return out;
}

/** 공통 axios 인스턴스 (쿠키 기반) */
const http = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // 쿠키 자동 포함
    // timeout: 30000,       // 필요 시 활성화
});

/** 요청 인터셉터 */
http.interceptors.request.use((config) => {
    // 쿠키 기반으로 전환: 혹시 남아있을 Authorization 헤더 제거
    if (config.headers && "Authorization" in config.headers) {
        delete (config.headers as any).Authorization;
    }
    // 빈 params 제거로 서버측 NPE/파싱 오류 예방
    if (config.params) {
        config.params = pruneParams(config.params);
    }
    return config;
});

/** 응답 인터셉터(선택) — 디버깅 편의 */
http.interceptors.response.use(
    (res) => res,
    (err) => {
        // 서버가 간단 오류 헤더(Ebook-Error 등)를 내려줄 수 있으므로 콘솔에 참고용 출력
        const ebookErr = err?.response?.headers?.["ebook-error"];
        if (ebookErr) {
            console.warn("[http] ebook-error:", ebookErr);
        }
        return Promise.reject(err);
    }
);

export default http;
