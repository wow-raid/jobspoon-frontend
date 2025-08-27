// src/account/utility/axiosInstance.ts
import axios from "axios";
export function createAxiosInstances() {
    return {
        djangoAxiosInstance: axios.create({
            baseURL: "http://localhost:8080", // 실서버 주소로 맞춰주세요
            timeout: 7000,
            headers: {
                "Content-Type": "application/json",
            },
        }),
    };
}
