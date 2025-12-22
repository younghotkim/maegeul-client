import { apiClient } from "../lib/api-client";

// 감정 분석 결과 저장
export const saveEmotionAnalysis = async (
  user_id: number,
  diary_id: number,
  emotion_result: any
) => {
  try {
    const response = await apiClient.post('/emotion', {
      user_id,
      diary_id,
      emotion_result,
    });
    return response.data;
  } catch (error) {
    console.error("감정 분석 저장 중 오류 발생:", error);
    throw error;
  }
};

// 특정 일기의 감정 분석 결과 가져오기
export const getEmotionAnalysisByDiaryId = async (diary_id: number) => {
  try {
    const response = await apiClient.get(`/emotion/diary/${diary_id}`);
    return response.data.emotionReport;
  } catch (error) {
    console.error("감정 분석 결과 조회 중 오류 발생:", error);
    throw error;
  }
};

// 특정 사용자의 감정 분석 결과 개수 가져오기
export const countEmotionAnalysisByUserId = async (user_id: number) => {
  try {
    const response = await apiClient.get(`/emotion/user/${user_id}/count`);
    return response.data.totalEmotionResults;
  } catch (error) {
    console.error("감정 분석 개수 조회 중 오류 발생:", error);
    throw error;
  }
};
