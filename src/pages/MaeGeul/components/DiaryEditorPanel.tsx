import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookOpen, Clock, PenLine } from "lucide-react"

interface DiaryEditorPanelProps {
  title: string
  formattedDate: string
  content: string
  userName?: string
  maxLength: number
  isContentEditable: boolean
  isButtonVisible: boolean
  isValid: boolean
  onContentChange: (content: string) => void
  onComplete: () => void
}

export function DiaryEditorPanel({
  title,
  formattedDate,
  content,
  userName,
  maxLength,
  isContentEditable,
  isButtonVisible,
  isValid,
  onContentChange,
  onComplete,
}: DiaryEditorPanelProps) {
  return (
    <motion.div
      className={cn(
        "w-full lg:w-1/2 flex flex-col",
        "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
        "dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/30",
        "rounded-2xl lg:rounded-3xl shadow-xl",
        "border border-amber-200/50 dark:border-amber-800/30",
        "overflow-hidden relative"
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* 일기장 바인딩 효과 */}
      <div className="absolute left-0 top-0 bottom-0 w-3 lg:w-4 bg-gradient-to-r from-amber-700 to-amber-600 dark:from-amber-800 dark:to-amber-700" />
      <div className="absolute left-3 lg:left-4 top-0 bottom-0 w-1 bg-amber-400/50 dark:bg-amber-600/30" />

      {/* 일기장 내용 영역 */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pl-6 sm:pl-8 lg:pl-12">
        {/* 헤더 */}
        <div className="mb-4 lg:mb-6">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900 dark:text-amber-100 break-words">
                {title || "오늘의 일기"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-amber-700/70 dark:text-amber-300/70">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{formattedDate}</span>
          </div>
        </div>

        {/* 구분선 - 일기장 줄 효과 */}
        <div className="w-full h-px bg-gradient-to-r from-amber-300/50 via-amber-400/30 to-transparent mb-4" />

        {/* 텍스트 영역 */}
        <div className="flex-1 relative min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]">
          {/* 줄 노트 배경 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, rgba(180, 140, 100, 0.15) 28px)",
            }}
          />
          <textarea
            className={cn(
              "w-full h-full min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]",
              "bg-transparent resize-none",
              "text-amber-900 dark:text-amber-100",
              "text-sm sm:text-base leading-7",
              "placeholder:text-amber-600/50 dark:placeholder:text-amber-400/40",
              "focus:outline-none",
              "font-serif",
              "p-0"
            )}
            placeholder={`${userName || ""}님의 오늘 하루는 어떠셨나요?\n\n오늘 하루에 대해 자유롭게 적어보세요.\n감정을 느낀 상황, 그때의 생각과 행동을\n솔직하게 표현해보는 건 어떨까요?`}
            maxLength={maxLength}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            disabled={!isContentEditable}
          />
        </div>

        {/* 하단 영역 */}
        <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-700/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* 글자수 */}
            <div className="flex items-center gap-2 text-amber-700/70 dark:text-amber-300/70">
              <PenLine className="w-4 h-4" />
              <span className="text-xs sm:text-sm">
                {content.length} / {maxLength}자
              </span>
            </div>

            {/* 완료 버튼 */}
            {isButtonVisible && (
              <Button
                onClick={onComplete}
                disabled={!isValid}
                className={cn(
                  "w-full sm:w-auto",
                  "bg-gradient-to-r from-amber-500 to-orange-500",
                  "hover:from-amber-600 hover:to-orange-600",
                  "text-white font-semibold",
                  "shadow-lg shadow-amber-500/25",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                작성 완료
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 장식 요소 */}
      <div className="absolute top-4 right-4 w-8 h-8 lg:w-12 lg:h-12 opacity-10">
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-amber-600">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
    </motion.div>
  )
}
