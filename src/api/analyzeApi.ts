import axios from "axios";

// 환경 변수에서 API URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getAPIURL = () => {
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

const API_URL = getAPIURL();
// 환경 변수에서 API URL을 가져오고, 없으면 기본값으로 localhost 사용

export const analyzeEmotion = async (text: string) => {
  try {
    const response = await axios.post(`${API_URL}/analyze/`, { text });
    return response.data.emotion;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw error;
  }
};
