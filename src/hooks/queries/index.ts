/**
 * React Query Hooks - Central Export
 * 모든 쿼리 훅을 한 곳에서 export
 */

// Diary hooks
export {
  useDiaries,
  useDiaryCount,
  useConsecutiveDays,
  useCreateDiary,
  usePrefetchDiaries,
  diaryKeys,
} from './use-diary-queries'

// Mood hooks
export {
  useMoodLabels,
  useMoodColors,
  useMoodColorCounts,
  useCreateMood,
  moodKeys,
} from './useMood'

// Emotion hooks
export {
  useEmotionAnalysis,
  useEmotionCount,
  useAnalyzeEmotion,
  useSaveEmotionAnalysis,
  emotionKeys,
} from './useEmotion'

// User hooks
export {
  useUser,
  useLogin,
  useSignup,
  useCheckEmail,
  userKeys,
} from './useUser'
