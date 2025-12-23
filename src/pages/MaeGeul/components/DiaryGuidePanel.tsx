import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Feather,
  BookOpen,
} from "lucide-react";

interface DiaryGuidePanelProps {
  emotionResult: string | null;
  userName?: string;
  colorName: string;
  highlightedColor: string | null;
  highlightedLabels: string[];
  onLabelClick: (label: string) => void;
  onSaveAi: () => void;
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

// Floating animation for decorative elements
const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Pulse glow animation
const pulseGlow = {
  scale: [1, 1.05, 1],
  opacity: [0.5, 0.8, 0.5],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export function DiaryGuidePanel({
  emotionResult,
  userName,
  colorName,
  highlightedColor,
  highlightedLabels,
  onLabelClick,
  onSaveAi,
}: DiaryGuidePanelProps) {
  const accentColor = highlightedColor || "#8b5cf6";

  // AI 분석 결과가 있을 때 - 편지 UI
  if (emotionResult) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={cn(
          "relative h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]",
          "overflow-hidden flex flex-col",
          "rounded-2xl lg:rounded-3xl"
        )}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/80 via-purple-50/60 to-pink-100/80 dark:from-violet-950/50 dark:via-purple-950/30 dark:to-pink-950/50" />
        <div className="absolute inset-0 backdrop-blur-xl" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-violet-400/30 to-purple-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-pink-400/30 to-rose-500/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 blur-lg"
                  animate={pulseGlow}
                />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-600 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent">
                  무디타의 편지
                </h2>
                <p className="text-sm text-violet-600/70 dark:text-violet-400/70">
                  {userName}님을 위해 작성했어요
                </p>
              </div>
              <motion.div animate={floatAnimation}>
                <Feather className="w-6 h-6 text-violet-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Letter content */}
          <div className="flex-1 px-5 sm:px-6 lg:px-8 py-4 overflow-y-auto">
            <motion.div
              variants={letterVariants}
              className="relative"
            >
              {/* Letter card with glass effect */}
              <div className={cn(
                "relative p-6 sm:p-7",
                "bg-white/70 dark:bg-gray-900/50",
                "backdrop-blur-md",
                "rounded-2xl",
                "border border-white/50 dark:border-gray-700/50",
                "shadow-[0_8px_32px_rgba(139,92,246,0.12)]"
              )}>
                {/* Decorative corner */}
                <motion.div
                  className="absolute -top-3 -right-3"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                {/* Letter lines */}
                <AnimatePresence>
                  <div className="space-y-4">
                    {emotionResult.split("\n").filter(s => s.trim()).map((sentence, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.15 * index,
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        }}
                        className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed"
                      >
                        {sentence}
                      </motion.p>
                    ))}
                  </div>
                </AnimatePresence>

                {/* Signature */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 pt-4 border-t border-violet-100 dark:border-violet-800/30"
                >
                  <p className="text-right text-sm text-violet-500 dark:text-violet-400 italic">
                    - 무디타 드림 💜
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Save button area */}
          <motion.div
            variants={itemVariants}
            className="px-5 sm:px-6 lg:px-8 py-5"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onSaveAi}
                className={cn(
                  "w-full gap-2 py-6",
                  "bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600",
                  "hover:from-violet-700 hover:via-purple-700 hover:to-violet-700",
                  "text-white font-medium text-base",
                  "rounded-xl",
                  "shadow-lg shadow-violet-500/25",
                  "transition-all duration-300"
                )}
              >
                <Save className="w-5 h-5" />
                편지 저장하기
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // 기본 가이드 UI
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "relative h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]",
        "overflow-hidden flex flex-col",
        "rounded-2xl lg:rounded-3xl"
      )}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white/80 to-gray-100/90 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-800/90" />
      <div className="absolute inset-0 backdrop-blur-xl" />
      
      {/* Accent gradient orb */}
      <motion.div
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, ${accentColor}, ${accentColor}88, ${accentColor})`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl blur-lg opacity-50"
                style={{ background: accentColor }}
                animate={pulseGlow}
              />
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
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
        </motion.div>

        {/* Cards container */}
        <div className="flex-1 px-5 sm:px-6 lg:px-8 py-4 space-y-4 overflow-y-auto">
          {/* Mood color card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            className={cn(
              "p-5 rounded-2xl",
              "bg-white/60 dark:bg-gray-800/40",
              "backdrop-blur-md",
              "border border-gray-200/50 dark:border-gray-700/50",
              "shadow-sm hover:shadow-md transition-shadow duration-300"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Palette className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                오늘의 무드 컬러
              </span>
            </div>
            <div className="flex items-center gap-4">
              {highlightedColor && (
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl blur-md"
                    style={{ backgroundColor: highlightedColor }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div
                    className="relative w-14 h-14 rounded-xl shadow-lg"
                    style={{ backgroundColor: highlightedColor }}
                  />
                </motion.div>
              )}
              <span
                className="text-2xl font-bold"
                style={{ color: accentColor }}
              >
                {colorName}
              </span>
            </div>
          </motion.div>

          {/* Emotion tags card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            className={cn(
              "p-5 rounded-2xl",
              "bg-gradient-to-br from-violet-50/80 to-purple-50/60",
              "dark:from-violet-950/40 dark:to-purple-950/30",
              "backdrop-blur-md",
              "border border-violet-200/50 dark:border-violet-800/30",
              "shadow-sm hover:shadow-md transition-shadow duration-300"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-violet-500" />
              </div>
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
                  transition={{
                    delay: 0.05 * index,
                    type: "spring",
                    stiffness: 400,
                  }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onLabelClick(label)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    "transition-all duration-200",
                    "shadow-sm hover:shadow-md"
                  )}
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                    border: `1.5px solid ${accentColor}30`,
                  }}
                >
                  #{label}
                </motion.button>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-violet-500/70 dark:text-violet-400/60 mt-4 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              키워드를 탭하면 제목에 추가돼요
            </motion.p>
          </motion.div>

          {/* Writing tips card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            className={cn(
              "p-5 rounded-2xl",
              "bg-gradient-to-br from-amber-50/80 to-orange-50/60",
              "dark:from-amber-950/40 dark:to-orange-950/30",
              "backdrop-blur-md",
              "border border-amber-200/50 dark:border-amber-800/30",
              "shadow-sm hover:shadow-md transition-shadow duration-300"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                작성 팁
              </span>
            </div>
            <ul className="space-y-3">
              {[
                "감정을 느낀 상황을 구체적으로 적어보세요",
                "그때의 생각과 행동을 함께 기록해보세요",
                "3줄 이상 작성하면 AI 분석을 받을 수 있어요",
              ].map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 text-sm text-amber-800/80 dark:text-amber-200/80"
                >
                  <BookOpen className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
