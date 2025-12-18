import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,

      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.isDarkMode
          // DOM 업데이트
          if (newMode) {
            document.body.classList.add('dark')
          } else {
            document.body.classList.remove('dark')
          }
          return { isDarkMode: newMode }
        }),

      setDarkMode: (value) =>
        set(() => {
          // DOM 업데이트
          if (value) {
            document.body.classList.add('dark')
          } else {
            document.body.classList.remove('dark')
          }
          return { isDarkMode: value }
        }),
    }),
    {
      name: 'theme-storage',
    }
  )
)
