import { apiClient } from "../lib/api-client";

export interface AnalyzeEmotionParams {
  text: string;
  moodColor?: string;
  moodLabels?: string[];
  pleasantness?: number;
  energy?: number;
  userName?: string;
}

export const analyzeEmotion = async (
  params: string | AnalyzeEmotionParams
): Promise<string> => {
  try {
    // 하위 호환성: string만 전달된 경우
    const requestBody =
      typeof params === "string" ? { text: params } : params;

    const response = await apiClient.post(`/analyze/`, requestBody);
    return response.data.emotion;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw error;
  }
};
