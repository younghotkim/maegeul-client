/**
 * React Query hooks for Mood operations
 * Provides caching and automatic refetching for mood data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moodService, type CreateMoodDto } from '../../services/mood.service'

// Query Keys
export const moodKeys = {
  all: ['mood'] as const,
  labels: (userId: number) => [...moodKeys.all, 'labels', userId] as const,
  colors: (userId: number) => [...moodKeys.all, 'colors', userId] as const,
  colorCounts: (userId: number) => [...moodKeys.all, 'colorCounts', userId] as const,
}

/**
 * 사용자의 무드 라벨 데이터 조회
 */
export function useMoodLabels(userId?: number) {
  return useQuery({
    queryKey: moodKeys.labels(userId!),
    queryFn: () => moodService.getMoodLabels(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 사용자의 무드 컬러 데이터 조회
 */
export function useMoodColors(userId?: number) {
  return useQuery({
    queryKey: moodKeys.colors(userId!),
    queryFn: () => moodService.getMoodColors(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 사용자의 무드 컬러별 카운트 조회
 */
export function useMoodColorCounts(userId?: number) {
  return useQuery({
    queryKey: moodKeys.colorCounts(userId!),
    queryFn: () => moodService.getMoodColorCounts(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 무드 데이터 저장 mutation
 */
export function useCreateMood() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMoodDto) => moodService.createMood(data),
    onSuccess: (_, variables) => {
      // 무드 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: moodKeys.labels(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: moodKeys.colors(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: moodKeys.colorCounts(variables.user_id) })
    },
  })
}
