import axios, { AxiosError } from "axios";

// 환경 변수에서 API URL을 가져옴
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isDev = import.meta.env.DEV;

  // 개발 환경에서만 디버깅 로그
  if (isDev) {
    console.log("🔍 API URL 환경 변수 확인:");
    console.log("  - VITE_API_URL:", envUrl);
    console.log("  - MODE:", import.meta.env.MODE);
  }

  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    if (isDev) {
      console.log("✅ 환경 변수에서 API URL 사용:", envUrl);
    }
    return envUrl;
  }

  // 환경 변수가 없으면 에러
  console.error("❌ VITE_API_URL 환경 변수가 설정되지 않았습니다.");
  if (isDev) {
    console.error("현재 window.location:", window.location.href);
    console.error("개발 환경에서는 .env 파일에 VITE_API_URL을 설정하세요.");
    console.error("프로덕션 환경에서는 Vercel 환경 변수를 확인하세요.");
  }
  throw new Error(
    "VITE_API_URL 환경 변수가 필요합니다. .env 파일 또는 Vercel 환경 변수를 확인하세요."
  );
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
    // Zustand persist storage에서 토큰 가져오기
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsedAuth = JSON.parse(authStorage);
        const token = parsedAuth.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to parse auth storage:", error);
      }
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
      // 로그인 관련 페이지에서는 리다이렉트하지 않음
      const currentPath = window.location.pathname;
      const authPaths = ['/mainlogin', '/email-login', '/mainsignup', '/kakao/callback', '/login/success'];
      
      if (!authPaths.some(path => currentPath.includes(path))) {
        // auth-storage에서 상태 초기화
        localStorage.removeItem("auth-storage");
        window.location.href = "/mainlogin";
      }
    }
    return Promise.reject(error);
  }
);

export type ApiError = {
  message: string;
  status?: number;
};
