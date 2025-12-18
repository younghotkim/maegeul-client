import { apiClient } from '../lib/api-client'

export interface AnalyzeEmotionResponse {
  emotion: string
}

export const analyzeService = {
  // AI 감정 분석
  analyzeEmotion: async (text: string): Promise<string> => {
    const { data } = await apiClient.post<AnalyzeEmotionResponse>('/analyze/', { text })
    return data.emotion
  },
}
