import { useQuery, useMutation } from '@tanstack/react-query'
import { authService, type LoginCredentials, type SignupData } from '../../services/auth.service'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: (userId: number) => [...authKeys.all, 'user', userId] as const,
}

// Queries
export function useUser(userId?: number) {
  return useQuery({
    queryKey: authKeys.user(userId!),
    queryFn: () => authService.getUser(userId!),
    enabled: !!userId,
  })
}

// Mutations
export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
  })
}

export function useCheckEmail() {
  return useMutation({
    mutationFn: (email: string) => authService.checkEmail(email),
  })
}
