import { apiClient } from '../lib/api-client'

export interface MoodData {
  user_id: number
  pleasantness: number
  energy: number
  label: string
  color: string
}

export interface CreateMoodDto {
  user_id: number
  pleasantness: number
  energy: number
  label: string
  color: string
}

export interface MoodLabelResponse {
  label: string
}

export interface MoodColorCount {
  color: string
  count: number
}

export const moodService = {
  // 무드 데이터 저장
  createMood: async (data: CreateMoodDto): Promise<any> => {
    const response = await apiClient.post('/save-moodmeter', data)
    return response.data
  },

  // 특정 사용자의 무드 라벨 데이터 가져오기
  getMoodLabels: async (userId: number): Promise<MoodLabelResponse[]> => {
    const { data } = await apiClient.get(`/moodmeter/label/${userId}`)
    return data
  },

  // 특정 사용자의 무드 컬러 데이터 가져오기
  getMoodColors: async (userId: number): Promise<any[]> => {
    const { data } = await apiClient.get(`/moodmeter/color/${userId}`)
    return data
  },

  // 특정 사용자의 무드 컬러별 카운트 가져오기
  getMoodColorCounts: async (userId: number): Promise<MoodColorCount[]> => {
    const { data } = await apiClient.get(`/moodmeter/colorcount/${userId}`)
    return data
  },
}
