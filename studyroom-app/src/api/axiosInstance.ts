import axios from 'axios';

const axiosInstance = axios.create({
    // 백엔드 서버 주소
    baseURL: 'http://localhost:8080/api',
});

export default axiosInstance;