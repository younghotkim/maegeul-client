import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { diaryService, type CreateDiaryDto } from '../../services/diary.service'

// Query Keys
export const diaryKeys = {
  all: ['diaries'] as const,
  byUser: (userId: number) => [...diaryKeys.all, 'user', userId] as const,
  count: (userId: number) => [...diaryKeys.all, 'count', userId] as const,
  consecutive: (userId: number) => [...diaryKeys.all, 'consecutive', userId] as const,
}

// Queries
export function useDiaries(userId?: number) {
  return useQuery({
    queryKey: diaryKeys.byUser(userId!),
    queryFn: () => diaryService.getDiaries(userId!),
    enabled: !!userId,
  })
}

export function useDiaryCount(userId?: number) {
  return useQuery({
    queryKey: diaryKeys.count(userId!),
    queryFn: () => diaryService.getDiaryCount(userId!),
    enabled: !!userId,
  })
}

export function useConsecutiveDays(userId?: number) {
  return useQuery({
    queryKey: diaryKeys.consecutive(userId!),
    queryFn: () => diaryService.getConsecutiveDays(userId!),
    enabled: !!userId,
  })
}

// Mutations
export function useCreateDiary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (diary: CreateDiaryDto) => diaryService.createDiary(diary),
    onSuccess: (data, variables) => {
      // 관련 쿼리 무효화하여 자동 리페치
      queryClient.invalidateQueries({ queryKey: diaryKeys.byUser(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: diaryKeys.count(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: diaryKeys.consecutive(variables.user_id) })
    },
  })
}
