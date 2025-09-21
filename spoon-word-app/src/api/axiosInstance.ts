import axios from 'axios';

const axiosInstance = axios.create({
    // 백엔드 서버 주소
    baseURL: 'http://localhost:8080',
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("userToken");
    console.log("userToken:" + token)
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});

export default axiosInstance;