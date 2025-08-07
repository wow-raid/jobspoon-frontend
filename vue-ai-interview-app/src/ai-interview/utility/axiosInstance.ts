import axios, { type AxiosInstance } from "axios";

export let djangoAxiosInstance: AxiosInstance | null = null;

export function createAxiosInstances() {
    // Vue CLI(webpack)에서는 process.env로 접근
    const mainApiUrl = process.env.VUE_APP_MAIN_API_URL;
    console.log("mainApiUrl", mainApiUrl);

    if (!djangoAxiosInstance) {
        djangoAxiosInstance = axios.create({
            baseURL: mainApiUrl,
            timeout: 80000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // 필요하다면 aiAxiosInstance도 동일하게 생성 가능
    // let aiAxiosInstance = axios.create({ baseURL: aiBaseUrl, ... });

    // return { djangoAxiosInstance, aiAxiosInstance };
    return { djangoAxiosInstance };
}

