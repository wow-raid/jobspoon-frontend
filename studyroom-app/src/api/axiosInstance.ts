import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    // 백엔드 서버 주소
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("LoggedIn");
//     console.log("LoggedIn:" + token)
//     if(token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config
// });

export default axiosInstance;