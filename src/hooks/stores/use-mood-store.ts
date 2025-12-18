import { create } from 'zustand'

interface MoodState {
  // MoodContext 상태
  pleasantness: number
  energy: number

  // HighlightContext 상태 (병합)
  highlightedLabels: string[]
  highlightedColor: string | null

  // Actions
  setPleasantness: (value: number) => void
  setEnergy: (value: number) => void
  setHighlightedLabels: (labels: string[]) => void
  setHighlightedColor: (color: string | null) => void
  reset: () => void
}

export const useMoodStore = create<MoodState>((set) => ({
  // 초기값
  pleasantness: 1,
  energy: 1,
  highlightedLabels: [],
  highlightedColor: null,

  // Setters
  setPleasantness: (value) => set({ pleasantness: value }),
  setEnergy: (value) => set({ energy: value }),
  setHighlightedLabels: (labels) => set({ highlightedLabels: labels }),
  setHighlightedColor: (color) => set({ highlightedColor: color }),

  // Reset
  reset: () =>
    set({
      pleasantness: 1,
      energy: 1,
      highlightedLabels: [],
      highlightedColor: null,
    }),
}))
