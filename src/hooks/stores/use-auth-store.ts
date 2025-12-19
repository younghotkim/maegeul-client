import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set((state) => ({ 
        user, 
        isAuthenticated: !!user && !!state.token 
      })),

      setToken: (token) => set((state) => ({ 
        token, 
        isAuthenticated: !!token && !!state.user 
      })),

      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 모든 상태를 persist
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
