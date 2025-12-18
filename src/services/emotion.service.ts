import { apiClient } from '../lib/api-client'

export interface EmotionAnalysis {
  user_id: number
  diary_id: number
  emotion_result: string
}

export interface CreateEmotionDto {
  user_id: number
  diary_id: number
  emotion_result: any
}

export interface EmotionCountResponse {
  totalEmotionResults: number
}

export interface EmotionReportResponse {
  emotionReport: string
}

export const emotionService = {
  // 감정 분석 결과 저장
  createEmotionAnalysis: async (data: CreateEmotionDto): Promise<any> => {
    const response = await apiClient.post('/emotion', data)
    return response.data
  },

  // 특정 일기의 감정 분석 결과 가져오기
  getEmotionByDiaryId: async (diaryId: number): Promise<string> => {
    const { data } = await apiClient.get<EmotionReportResponse>(`/emotion/diary/${diaryId}`)
    return data.emotionReport
  },

  // 특정 사용자의 감정 분석 개수 가져오기
  getEmotionCount: async (userId: number): Promise<number> => {
    const { data } = await apiClient.get<EmotionCountResponse>(`/emotion/user/${userId}/count`)
    return data.totalEmotionResults
  },
}
