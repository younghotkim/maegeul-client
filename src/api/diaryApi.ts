import { apiClient } from "../lib/api-client";

// 특정 사용자의 일기를 가져오는 함수
export const getDiariesByUserId = async (user_id: number) => {
  try {
    const response = await apiClient.get(`/diary/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("일기 불러오기 중 오류 발생:", error);
    throw error;
  }
};

// 특정 사용자의 일기 갯수를 가져오는 함수
export const countDiariesByUserId = async (user_id: number) => {
  try {
    const response = await apiClient.get(`/diary/count/${user_id}`);
    return response.data.totalDiaries;
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
    const response = await apiClient.post(`/diary`, diaryData);
    return response.data;
  } catch (error) {
    console.error("일기 저장 중 오류 발생:", error);
    throw error;
  }
};

// 특정 사용자의 연속된 일수를 가져오는 함수
export const getConsecutiveDaysByUserId = async (user_id: number) => {
  try {
    const response = await apiClient.get(`/diary/consecutive/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("연속된 일수 불러오기 중 오류 발생:", error);
    throw error;
  }
};
