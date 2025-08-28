// 서버에 요청을 보내는 도메인
import axios, { type AxiosInstance } from "axios";

export let djangoAxiosInstance: AxiosInstance | null = null;
export let springAxiosInstance: AxiosInstance | null = null;
export let fastapiAxiosInst: AxiosInstance | null = null;

export function createAxiosInstances() {

    const djangoApiUrl = process.env.VUE_APP_DJANGO_API_BASE_URL;
    const springApiUrl = process.env.VUE_APP_SPRING_API_BASE_URL;
    const aiBaseUrl = process.env.VUE_APP_AI_API_BASE_URL;

    if (!djangoAxiosInstance) {
        djangoAxiosInstance = axios.create({
            baseURL: djangoApiUrl,
            timeout: 80000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (!springAxiosInstance) {
        springAxiosInstance = axios.create({
            baseURL: springApiUrl,
            timeout: 80000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }


    if (!fastapiAxiosInst) {
        fastapiAxiosInst = axios.create({
            baseURL: aiBaseUrl,
            timeout: 20000,
        });
    }

    return { djangoAxiosInstance, fastapiAxiosInst, springAxiosInstance };
}
