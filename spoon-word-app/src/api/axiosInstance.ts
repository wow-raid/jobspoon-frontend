import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

function pruneParams(obj: Record<string, any>) {
    const out: Record<string, any> = {};
    Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "string" && v.trim() === "") return; // 빈 문자열 제거
        out[k] = v;
    });
    return out;
}

axiosInstance.interceptors.request.use((config) => {
    if (config.headers && "Authorization" in config.headers) {
        delete (config.headers as any).Authorization;
    }
    if (config.params) {
        config.params = pruneParams(config.params);
    }
    return config;
});

export default axiosInstance;
