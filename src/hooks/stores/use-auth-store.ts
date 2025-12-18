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
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem('token'),
      isAuthenticated: !!localStorage.getItem('token'),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        if (token) {
          localStorage.setItem('token', token)
        } else {
          localStorage.removeItem('token')
        }
        set({ token, isAuthenticated: !!token })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // 토큰만 persist
    }
  )
)
