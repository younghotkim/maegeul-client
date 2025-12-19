import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Mail,
  Heart,
  Sparkles,
  Palette,
  Tag,
  Lightbulb,
  Save,
  BookHeart,
} from "lucide-react"
import letter from "../../../Image/letter.png"
import postbox from "../../../Image/postbox.png"
import heart from "../../../Image/heart.png"

interface DiaryGuidePanelProps {
  emotionResult: string | null
  userName?: string
  colorName: string
  highlightedColor: string | null
  highlightedLabels: string[]
  onLabelClick: (label: string) => void
  onSaveAi: () => void
}

export function DiaryGuidePanel({
  emotionResult,
  userName,
  colorName,
  highlightedColor,
  highlightedLabels,
  onLabelClick,
  onSaveAi,
}: DiaryGuidePanelProps) {
  // AI 분석 결과가 있을 때 - 편지 UI
  if (emotionResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="h-full flex flex-col p-4 sm:p-6"
      >
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-4 lg:mb-6">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
            {userName}님을 위한 AI 무디타의 편지
          </h2>
          <img
            src={letter}
            className="w-6 h-6 sm:w-8 sm:h-8"
            alt="Letter"
          />
        </div>

        {/* 편지 내용 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "flex-1 relative p-4 sm:p-6",
            "bg-white dark:bg-gray-800",
            "rounded-2xl shadow-lg",
            "border border-primary/10"
          )}
        >
          {/* 편지 장식 */}
          <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8">
            <Sparkles className="w-full h-full text-yellow-400" />
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto max-h-[200px] sm:max-h-[280px] lg:max-h-[350px]">
            {emotionResult.split("\n").map((sentence, index) => (
              <p
                key={index}
                className="mb-2 sm:mb-3 text-sm sm:text-base text-foreground/90 leading-relaxed"
              >
                {sentence}
              </p>
            ))}
          </div>

          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white dark:border-t-gray-800" />
        </motion.div>

        {/* 우체통 & 저장 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center mt-6 lg:mt-8 pt-4"
        >
          <img
            src={postbox}
            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-3 lg:mb-4"
            alt="Postbox"
          />
          <Button
            onClick={onSaveAi}
            variant="violet"
            size="lg"
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            편지 저장하기
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  // 기본 가이드 UI
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full flex flex-col"
    >
      {/* 일기장 커버 스타일 */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          "bg-white dark:bg-gray-800",
          "rounded-xl lg:rounded-2xl shadow-lg",
          "border border-gray-100 dark:border-gray-700",
          "overflow-hidden"
        )}
      >
        {/* 헤더 */}
        <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-primary/10 to-violet-500/10 dark:from-primary/20 dark:to-violet-500/20">
          <div className="flex items-center gap-2">
            <BookHeart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              {userName}님의 무드일기
            </h1>
            <img
              src={heart}
              alt="Heart"
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
            />
          </div>
        </div>

        {/* 내용 영역 */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto">
          {/* 작성 안내 카드 */}
          <div
            className={cn(
              "p-3 sm:p-4 lg:p-5 rounded-xl",
              "bg-gradient-to-br from-blue-50 to-indigo-50",
              "dark:from-blue-950/30 dark:to-indigo-950/30",
              "border border-blue-100 dark:border-blue-900/30"
            )}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-blue-900 dark:text-blue-100">
                작성 안내
              </h2>
            </div>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
              <li className="flex gap-2">
                <span className="text-blue-500 font-medium">1.</span>
                <span>
                  감정을 느낀 구체적인 "상황"과 그 때 나의 "행동", "생각"을
                  포함해 적어보세요.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-medium">2.</span>
                <span>
                  하루를 회고하며 나의 감정을 중심으로 3줄 이상 적어보는 것을
                  추천드려요.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-medium">3.</span>
                <span>
                  감정을 느꼈을 때 나의 신체적 변화에 대해서 적어보는 것도
                  도움이 되어요.
                </span>
              </li>
            </ul>
          </div>

          {/* 오늘의 무드 진단 카드 */}
          <div
            className={cn(
              "p-3 sm:p-4 lg:p-5 rounded-xl",
              "bg-gradient-to-br from-violet-50 to-purple-50",
              "dark:from-violet-950/30 dark:to-purple-950/30",
              "border border-violet-100 dark:border-violet-900/30"
            )}
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-violet-900 dark:text-violet-100">
                오늘의 무드 진단
              </h2>
            </div>

            {/* 무드 컬러 */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Palette className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-violet-800 dark:text-violet-200">
                무드 컬러:
              </span>
              <span className="font-medium text-xs sm:text-sm text-violet-900 dark:text-violet-100">
                {colorName}
              </span>
              {highlightedColor && (
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md shadow-sm border border-white/50 flex-shrink-0"
                  style={{ backgroundColor: highlightedColor }}
                />
              )}
            </div>

            {/* 무드 태그 */}
            <div className="flex flex-wrap items-start gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Tag className="w-4 h-4 text-violet-500" />
                <span className="text-xs sm:text-sm text-violet-800 dark:text-violet-200">
                  무드 태그:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {highlightedLabels.map((label) => (
                  <Badge
                    key={label}
                    variant="violet"
                    className="cursor-pointer hover:scale-105 transition-transform text-xs"
                    onClick={() => onLabelClick(label)}
                  >
                    #{label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 팁 */}
            <div className="flex items-start gap-2 p-2 sm:p-3 bg-white/50 dark:bg-gray-900/30 rounded-lg">
              <span className="text-base sm:text-lg">💭</span>
              <p className="text-xs text-violet-700 dark:text-violet-300">
                감정 키워드를 선택하면 제목에 무드태그를 걸 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
