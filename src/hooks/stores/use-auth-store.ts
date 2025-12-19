import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  user_id: number
  email: string
  profile_name: string
  profile_picture?: string
  isKakaoUser: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean // 초기화 완료 여부
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setInitialized: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        set({ token, isAuthenticated: !!token })
      },

      setInitialized: (value) => set({ isInitialized: value }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      // 토큰과 사용자 정보 모두 persist
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
