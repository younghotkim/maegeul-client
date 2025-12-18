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

// 감정 분석 결과 저장
export const saveEmotionAnalysis = async (
  user_id: number,
  diary_id: number,
  emotion_result: any
) => {
  try {
    const response = await axios.post(`${API_URL}/emotion`, {
      user_id,
      diary_id,
      emotion_result,
    });
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("감정 분석 저장 중 오류 발생:", error);
    throw error;
  }
};

// 특정 일기의 감정 분석 결과 가져오기
export const getEmotionAnalysisByDiaryId = async (diary_id: number) => {
  try {
    const response = await axios.get(`${API_URL}/emotion/diary/${diary_id}`);
    return response.data.emotionReport; // 감정 분석 결과 반환
  } catch (error) {
    console.error("감정 분석 결과 조회 중 오류 발생:", error);
    throw error;
  }
};

// 특정 사용자의 감정 분석 결과 개수 가져오기
export const countEmotionAnalysisByUserId = async (user_id: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/emotion/user/${user_id}/count`
    );
    return response.data.totalEmotionResults; // 감정 분석 개수 반환
  } catch (error) {
    console.error("감정 분석 개수 조회 중 오류 발생:", error);
    throw error;
  }
};
