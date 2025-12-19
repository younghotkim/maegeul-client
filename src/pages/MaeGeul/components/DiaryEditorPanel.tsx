import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";

interface DiaryEditorPanelProps {
  title: string;
  formattedDate: string;
  content: string;
  userName?: string;
  maxLength: number;
  isContentEditable: boolean;
  isButtonVisible: boolean;
  isValid: boolean;
  onContentChange: (content: string) => void;
  onComplete: () => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 포커스
  useEffect(() => {
    if (isContentEditable && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isContentEditable]);

  const charPercentage = (content.length / maxLength) * 100;

  return (
    <motion.div
      className={cn(
        "relative h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]",
        "bg-white dark:bg-gray-900",
        "rounded-2xl lg:rounded-3xl",
        "shadow-xl shadow-gray-200/50 dark:shadow-black/20",
        "border border-gray-100 dark:border-gray-800",
        "overflow-hidden",
        "flex flex-col"
      )}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
      transition={{ duration: 0.3 }}
    >
      {/* 상단 그라데이션 바 */}
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />

      {/* 헤더 */}
      <div className="px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <motion.h2
          className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title || "오늘의 이야기"}
        </motion.h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {formattedDate}
        </p>
      </div>

      {/* 에디터 영역 */}
      <div className="flex-1 relative px-5 sm:px-6 lg:px-8 py-4">
        {/* 줄 노트 배경 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 32px)",
          }}
        />

        <textarea
          ref={textareaRef}
          className={cn(
            "w-full h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]",
            "bg-transparent resize-none",
            "text-gray-800 dark:text-gray-100",
            "text-base sm:text-lg leading-8",
            "placeholder:text-gray-300 dark:placeholder:text-gray-600",
            "focus:outline-none",
            "relative z-10"
          )}
          placeholder={`${userName || ""}님, 오늘 하루는 어땠나요?

자유롭게 적어보세요.
감정, 생각, 있었던 일...
무엇이든 좋아요.`}
          maxLength={maxLength}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          disabled={!isContentEditable}
        />
      </div>

      {/* 하단 영역 */}
      <div className="px-5 sm:px-6 lg:px-8 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between gap-4">
          {/* 글자수 프로그레스 */}
          <div className="flex items-center gap-3">
            <div className="relative w-24 sm:w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "absolute left-0 top-0 h-full rounded-full",
                  charPercentage > 80
                    ? "bg-orange-500"
                    : charPercentage > 50
                      ? "bg-violet-500"
                      : "bg-gray-400"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(charPercentage, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                charPercentage > 80
                  ? "text-orange-500"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              {content.length}/{maxLength}
            </span>
          </div>

          {/* 완료 버튼 */}
          {isButtonVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={onComplete}
                disabled={!isValid}
                className={cn(
                  "gap-2 px-5 sm:px-6",
                  "bg-gradient-to-r from-violet-600 to-purple-600",
                  "hover:from-violet-700 hover:to-purple-700",
                  "text-white font-medium",
                  "shadow-lg shadow-violet-500/25",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {isValid ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">AI 분석 받기</span>
                    <span className="sm:hidden">완료</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>작성 중...</span>
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* 장식 요소 */}
      <div className="absolute top-16 right-4 w-20 h-20 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 left-4 w-16 h-16 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
}
