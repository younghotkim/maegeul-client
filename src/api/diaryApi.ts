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

// 특정 사용자의 일기를 가져오는 함수
export const getDiariesByUserId = async (user_id: number) => {
  try {
    const response = await axios.get(`${API_URL}/diary/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("일기 불러오기 중 오류 발생:", error);
    throw error;
  }
};

// 특정 사용자의 일기 갯수를 가져오는 함수
export const countDiariesByUserId = async (user_id: number) => {
  try {
    const response = await axios.get(`${API_URL}/diary/count/${user_id}`);
    return response.data.totalDiaries; // 서버에서 totalDiaries로 응답한다고 가정
  } catch (error) {
    console.error("일기 갯수 불러오기 중 오류 발생:", error);
    throw error;
  }
};

// 일기를 저장하는 함수
export const saveDiary = async (diaryData: {
  user_id: number;
  title: string;
  content: string;
  color: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/diary`, diaryData);
    return response.data;
  } catch (error) {
    console.error("일기 저장 중 오류 발생:", error);
    throw error;
  }
};

// 특정 사용자의 연속된 일수를 가져오는 함수
export const getConsecutiveDaysByUserId = async (user_id: number) => {
  try {
    const response = await axios.get(`${API_URL}/diary/consecutive/${user_id}`);
    return response.data; // 서버에서 연속된 일수를 반환한다고 가정
  } catch (error) {
    console.error("연속된 일수 불러오기 중 오류 발생:", error);
    throw error;
  }
};
