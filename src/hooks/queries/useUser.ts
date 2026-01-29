/**
 * React Query hooks for User operations
 */

import { useQuery, useMutation } from '@tanstack/react-query'
import { authService, type LoginCredentials, type SignupData } from '../../services/auth.service'
import { useAuthStore } from '../stores/use-auth-store'

// Query Keys
export const userKeys = {
  all: ['user'] as const,
  detail: (userId: number) => [...userKeys.all, userId] as const,
}

/**
 * 사용자 정보 조회
 */
export function useUser(userId?: number) {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => authService.getUser(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10분
  })
}

/**
 * 로그인 mutation
 */
export function useLogin() {
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(
        {
          user_id: data.user.user_id,
          email: data.user.email,
          profile_name: data.user.profile_name,
          profile_picture: data.user.profile_picture,
          isKakaoUser: false,
        },
        data.token
      )
    },
  })
}

/**
 * 회원가입 mutation
 */
export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
  })
}

/**
 * 이메일 중복 확인
 */
export function useCheckEmail() {
  return useMutation({
    mutationFn: (email: string) => authService.checkEmail(email),
  })
}
