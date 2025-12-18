import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moodService, type CreateMoodDto } from '../../services/mood.service'

// Query Keys
export const moodKeys = {
  all: ['moods'] as const,
  labelsByUser: (userId: number) => [...moodKeys.all, 'labels', userId] as const,
  colorsByUser: (userId: number) => [...moodKeys.all, 'colors', userId] as const,
}

// Queries
export function useMoodLabels(userId?: number) {
  return useQuery({
    queryKey: moodKeys.labelsByUser(userId!),
    queryFn: () => moodService.getMoodLabels(userId!),
    enabled: !!userId,
  })
}

export function useMoodColors(userId?: number) {
  return useQuery({
    queryKey: moodKeys.colorsByUser(userId!),
    queryFn: () => moodService.getMoodColors(userId!),
    enabled: !!userId,
  })
}

// Mutations
export function useCreateMood() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMoodDto) => moodService.createMood(data),
    onSuccess: (_, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: moodKeys.labelsByUser(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: moodKeys.colorsByUser(variables.user_id) })
    },
  })
}
