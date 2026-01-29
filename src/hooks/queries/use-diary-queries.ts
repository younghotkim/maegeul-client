/**
 * React Query hooks for Diary operations
 * Provides caching, automatic refetching, and optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { diaryService, type CreateDiaryDto } from '../../services/diary.service'

// Query Keys - 일관된 캐시 키 관리
export const diaryKeys = {
  all: ['diaries'] as const,
  byUser: (userId: number) => [...diaryKeys.all, 'user', userId] as const,
  count: (userId: number) => [...diaryKeys.all, 'count', userId] as const,
  consecutive: (userId: number) => [...diaryKeys.all, 'consecutive', userId] as const,
}

/**
 * 사용자의 일기 목록 조회
 * - 5분간 캐시 유지
 * - userId가 없으면 쿼리 비활성화
 */
export function useDiaries(userId?: number) {
  return useQuery({
    queryKey: diaryKeys.byUser(userId!),
    queryFn: () => diaryService.getDiaries(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  })
}

/**
 * 사용자의 일기 개수 조회
 */
export function useDiaryCount(userId?: number) {
  return useQuery({
    queryKey: diaryKeys.count(userId!),
    queryFn: () => diaryService.getDiaryCount(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 사용자의 연속 작성 일수 조회
 */
export function useConsecutiveDays(userId?: number) {
  return useQuery({
    queryKey: diaryKeys.consecutive(userId!),
    queryFn: () => diaryService.getConsecutiveDays(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 일기 생성 mutation
 * 성공 시 관련 쿼리들을 자동으로 무효화
 */
export function useCreateDiary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (diary: CreateDiaryDto) => diaryService.createDiary(diary),
    onSuccess: (_, variables) => {
      // 일기 목록, 개수, 연속 일수 캐시 무효화
      queryClient.invalidateQueries({ queryKey: diaryKeys.byUser(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: diaryKeys.count(variables.user_id) })
      queryClient.invalidateQueries({ queryKey: diaryKeys.consecutive(variables.user_id) })
    },
  })
}

/**
 * 일기 목록 프리페치 (미리 로딩)
 */
export function usePrefetchDiaries() {
  const queryClient = useQueryClient()

  return (userId: number) => {
    queryClient.prefetchQuery({
      queryKey: diaryKeys.byUser(userId),
      queryFn: () => diaryService.getDiaries(userId),
      staleTime: 5 * 60 * 1000,
    })
  }
}
