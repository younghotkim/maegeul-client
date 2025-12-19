import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Mail,
  Sparkles,
  Palette,
  Lightbulb,
  Save,
  Heart,
  MessageCircle,
} from "lucide-react";
import letter from "../../../Image/letter.png";
import postbox from "../../../Image/postbox.png";

interface DiaryGuidePanelProps {
  emotionResult: string | null;
  userName?: string;
  colorName: string;
  highlightedColor: string | null;
  highlightedLabels: string[];
  onLabelClick: (label: string) => void;
  onSaveAi: () => void;
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]",
          "bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50",
          "dark:from-violet-950/30 dark:via-purple-950/20 dark:to-pink-950/30",
          "rounded-2xl lg:rounded-3xl",
          "shadow-xl shadow-violet-200/30 dark:shadow-black/20",
          "border border-violet-100 dark:border-violet-900/30",
          "overflow-hidden flex flex-col"
        )}
      >
        {/* 헤더 */}
        <div className="px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-4 border-b border-violet-100 dark:border-violet-900/30">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Mail className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-violet-900 dark:text-violet-100">
                AI 무디타의 편지
              </h2>
              <p className="text-sm text-violet-600/70 dark:text-violet-400/70">
                {userName}님을 위해 작성했어요
              </p>
            </div>
            <img src={letter} className="w-8 h-8 ml-auto" alt="Letter" />
          </div>
        </div>

        {/* 편지 내용 */}
        <div className="flex-1 px-5 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "relative p-5 sm:p-6",
              "bg-white dark:bg-gray-800",
              "rounded-2xl shadow-lg",
              "border border-violet-100 dark:border-violet-800/50"
            )}
          >
            {/* 장식 */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>

            <div className="space-y-3">
              {emotionResult.split("\n").map((sentence, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed"
                >
                  {sentence}
                </motion.p>
              ))}
            </div>

            {/* 말풍선 꼬리 */}
            <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white dark:border-t-gray-800" />
          </motion.div>
        </div>

        {/* 저장 버튼 */}
        <div className="px-5 sm:px-6 lg:px-8 py-5 border-t border-violet-100 dark:border-violet-900/30 bg-white/50 dark:bg-gray-900/30">
          <div className="flex flex-col items-center gap-4">
            <motion.img
              src={postbox}
              className="w-16 h-16"
              alt="Postbox"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Button
              onClick={onSaveAi}
              className={cn(
                "gap-2 px-6",
                "bg-gradient-to-r from-violet-600 to-purple-600",
                "hover:from-violet-700 hover:to-purple-700",
                "text-white font-medium",
                "shadow-lg shadow-violet-500/25"
              )}
            >
              <Save className="w-4 h-4" />
              편지 저장하기
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // 기본 가이드 UI
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]",
        "bg-white dark:bg-gray-900",
        "rounded-2xl lg:rounded-3xl",
        "shadow-xl shadow-gray-200/50 dark:shadow-black/20",
        "border border-gray-100 dark:border-gray-800",
        "overflow-hidden flex flex-col"
      )}
    >
      {/* 상단 그라데이션 바 */}
      <div
        className="h-1"
        style={{
          background: highlightedColor
            ? `linear-gradient(to right, ${highlightedColor}, ${highlightedColor}88)`
            : "linear-gradient(to right, #8b5cf6, #a855f7)",
        }}
      />

      {/* 헤더 */}
      <div className="px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: highlightedColor
                ? `linear-gradient(135deg, ${highlightedColor}, ${highlightedColor}cc)`
                : "linear-gradient(135deg, #8b5cf6, #a855f7)",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {userName}님의 무드
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              오늘의 감정 상태
            </p>
          </div>
        </div>
      </div>

      {/* 내용 영역 */}
      <div className="flex-1 px-5 sm:px-6 lg:px-8 py-5 space-y-5 overflow-y-auto">
        {/* 무드 컬러 카드 */}
        <motion.div
          className={cn(
            "p-4 sm:p-5 rounded-xl",
            "bg-gradient-to-br from-gray-50 to-gray-100/50",
            "dark:from-gray-800 dark:to-gray-800/50",
            "border border-gray-100 dark:border-gray-700"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Palette className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              오늘의 무드 컬러
            </span>
          </div>
          <div className="flex items-center gap-3">
            {highlightedColor && (
              <motion.div
                className="w-12 h-12 rounded-xl shadow-lg"
                style={{ backgroundColor: highlightedColor }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
            )}
            <span
              className="text-xl font-bold"
              style={{ color: highlightedColor || "#8b5cf6" }}
            >
              {colorName}
            </span>
          </div>
        </motion.div>

        {/* 감정 태그 */}
        <motion.div
          className={cn(
            "p-4 sm:p-5 rounded-xl",
            "bg-gradient-to-br from-violet-50 to-purple-50",
            "dark:from-violet-950/30 dark:to-purple-950/30",
            "border border-violet-100 dark:border-violet-900/30"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
              감정 키워드
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlightedLabels.map((label, index) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLabelClick(label)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  "hover:shadow-md"
                )}
                style={{
                  backgroundColor: `${highlightedColor || "#8b5cf6"}20`,
                  color: highlightedColor || "#8b5cf6",
                  border: `1px solid ${highlightedColor || "#8b5cf6"}40`,
                }}
              >
                #{label}
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-violet-600/60 dark:text-violet-400/60 mt-3">
            💡 키워드를 탭하면 제목에 추가돼요
          </p>
        </motion.div>

        {/* 작성 팁 */}
        <motion.div
          className={cn(
            "p-4 sm:p-5 rounded-xl",
            "bg-gradient-to-br from-amber-50 to-orange-50",
            "dark:from-amber-950/30 dark:to-orange-950/30",
            "border border-amber-100 dark:border-amber-900/30"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              작성 팁
            </span>
          </div>
          <ul className="space-y-2 text-sm text-amber-800/80 dark:text-amber-200/80">
            <li className="flex gap-2">
              <span>•</span>
              <span>감정을 느낀 상황을 구체적으로 적어보세요</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>그때의 생각과 행동을 함께 기록해보세요</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>3줄 이상 작성하면 AI 분석을 받을 수 있어요</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
