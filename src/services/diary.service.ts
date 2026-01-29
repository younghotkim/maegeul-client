import { apiClient } from '../lib/api-client'

export interface Diary {
  diary_id: number
  user_id: number
  title: string
  content: string
  color: string
  date?: string  // ISO date string
  formatted_date: string  // 포맷된 날짜 문자열
}

export interface CreateDiaryDto {
  user_id: number
  title: string
  content: string
  color: string
}

export interface DiaryCountResponse {
  totalDiaries: number
}

export interface ConsecutiveDaysResponse {
  consecutive_days: number
}

export const diaryService = {
  // 특정 사용자의 일기 목록 가져오기
  getDiaries: async (userId: number): Promise<Diary[]> => {
    const { data } = await apiClient.get(`/diary/${userId}`)
    return data
  },

  // 특정 사용자의 일기 개수 가져오기
  getDiaryCount: async (userId: number): Promise<number> => {
    const { data } = await apiClient.get<DiaryCountResponse>(`/diary/count/${userId}`)
    return data.totalDiaries
  },

  // 특정 사용자의 연속 작성 일수 가져오기
  getConsecutiveDays: async (userId: number): Promise<number> => {
    const { data } = await apiClient.get<ConsecutiveDaysResponse>(`/diary/consecutive/${userId}`)
    return data.consecutive_days
  },

  // 일기 생성
  createDiary: async (diary: CreateDiaryDto): Promise<{ diary_id: number }> => {
    const { data } = await apiClient.post('/diary', diary)
    return data
  },
}
