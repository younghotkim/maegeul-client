/**
 * React Query hooks for Emotion Analysis operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  saveEmotionAnalysis,
  getEmotionAnalysisByDiaryId,
  countEmotionAnalysisByUserId,
} from '../../api/emotionApi'
import { analyzeEmotion, type AnalyzeEmotionParams } from '../../api/analyzeApi'

// Query Keys
export const emotionKeys = {
  all: ['emotion'] as const,
  analysis: (diaryId: number) => [...emotionKeys.all, 'analysis', diaryId] as const,
  count: (userId: number) => [...emotionKeys.all, 'count', userId] as const,
}

/**
 * 특정 일기의 감정 분석 결과 조회
 * - 감정 분석은 변하지 않으므로 30분 캐시
 */
export function useEmotionAnalysis(diaryId?: number) {
  return useQuery({
    queryKey: emotionKeys.analysis(diaryId!),
    queryFn: () => getEmotionAnalysisByDiaryId(diaryId!),
    enabled: !!diaryId,
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * 사용자의 감정 분석 결과 개수 조회
 */
export function useEmotionCount(userId?: number) {
  return useQuery({
    queryKey: emotionKeys.count(userId!),
    queryFn: () => countEmotionAnalysisByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 감정 분석 실행 mutation
 */
export function useAnalyzeEmotion() {
  return useMutation({
    mutationFn: (params: string | AnalyzeEmotionParams) => analyzeEmotion(params),
  })
}

/**
 * 감정 분석 결과 저장 mutation
 */
export function useSaveEmotionAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      diaryId,
      emotionResult,
    }: {
      userId: number
      diaryId: number
      emotionResult: any
    }) => saveEmotionAnalysis(userId, diaryId, emotionResult),
    onSuccess: (_, variables) => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: emotionKeys.analysis(variables.diaryId) })
      queryClient.invalidateQueries({ queryKey: emotionKeys.count(variables.userId) })
    },
  })
}
