import axios from "axios";

const api = axios.create({
    baseURL: "http://3.35.22.232:8080/api",
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export default api;