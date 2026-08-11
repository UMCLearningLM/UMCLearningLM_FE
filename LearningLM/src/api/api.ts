import axios, { AxiosError } from "axios";

const API_BASE_URL = "http://3.35.22.232:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let reissuePromise: Promise<string> | null = null;

// 모든 일반 API 요청에 Access Token 추가
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// Access Token 만료 시 Refresh Token으로 재발급
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const requestUrl = originalRequest.url ?? "";

        // 로그인·회원가입·토큰 재발급 같은 auth API는 자동 재발급 대상에서 제외
        const isAuthRequest = requestUrl.startsWith("/auth/");

        if (status !== 401 || originalRequest._retry || isAuthRequest) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.assign("/login");

            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // 동시에 여러 요청이 401이어도 재발급은 한 번만 요청
            if (!reissuePromise) {
                reissuePromise = axios
                    .post(`${API_BASE_URL}/auth/reissue`, {
                        refreshToken,
                    })
                    .then((response) => {
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                            response.data.result;

                        localStorage.setItem("accessToken", newAccessToken);
                        localStorage.setItem("refreshToken", newRefreshToken);

                        return newAccessToken;
                    })
                    .finally(() => {
                        reissuePromise = null;
                    });
            }

            const newAccessToken = await reissuePromise;

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // 새 Access Token으로 원래 요청 재시도
            return api(originalRequest);
        } catch (reissueError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            window.location.assign("/login");

            return Promise.reject(reissueError);
        }
    },
);

export default api;