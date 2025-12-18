import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { emotionService, type CreateEmotionDto } from '../../services/emotion.service'

// Query Keys
export const emotionKeys = {
  all: ['emotions'] as const,
  byDiary: (diaryId: number) => [...emotionKeys.all, 'diary', diaryId] as const,
  countByUser: (userId: number) => [...emotionKeys.all, 'count', userId] as const,
}

// Queries
export function useEmotionByDiary(diaryId?: number) {
  return useQuery({
    queryKey: emotionKeys.byDiary(diaryId!),
    queryFn: () => emotionService.getEmotionByDiaryId(diaryId!),
    enabled: !!diaryId,
  })
}

export function useEmotionCount(userId?: number) {
  return useQuery({
    queryKey: emotionKeys.countByUser(userId!),
    queryFn: () => emotionService.getEmotionCount(userId!),
    enabled: !!userId,
  })
}

// Mutations
export function useCreateEmotion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEmotionDto) => emotionService.createEmotionAnalysis(data),
    onSuccess: (_, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: emotionKeys.byDiary(variables.diary_id) })
      queryClient.invalidateQueries({ queryKey: emotionKeys.countByUser(variables.user_id) })
    },
  })
}
