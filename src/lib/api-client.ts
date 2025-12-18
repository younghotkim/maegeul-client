import axios, { AxiosError } from "axios";

// 환경 변수에서 API URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl;
  }
  if (import.meta.env.MODE === "production") {
    return "/api";
  }
  // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5001/api`;
};

const BASE_URL = getBaseURL();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 중앙 집중식 에러 처리
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/mainlogin";
    }
    return Promise.reject(error);
  }
);

export type ApiError = {
  message: string;
  status?: number;
};
