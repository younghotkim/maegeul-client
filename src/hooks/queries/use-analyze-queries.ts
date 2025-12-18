import { useMutation } from '@tanstack/react-query'
import { analyzeService } from '../../services/analyze.service'

// Mutations
export function useAnalyzeEmotion() {
  return useMutation({
    mutationFn: (text: string) => analyzeService.analyzeEmotion(text),
  })
}
