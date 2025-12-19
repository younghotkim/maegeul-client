import React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  size?: "sm" | "default" | "lg"
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = true,
  size = "default",
}) => {
  const sizeClasses = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4",
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          "bg-secondary dark:bg-gray-800",
          sizeClasses[size]
        )}
      >
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10" />

        {/* 진행 바 */}
        <motion.div
          className={cn(
            "absolute top-0 left-0 h-full rounded-full",
            "bg-gradient-to-r from-primary via-violet-500 to-primary",
            "shadow-sm shadow-primary/30"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* 빛나는 효과 */}
        <motion.div
          className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ left: "-20%" }}
          animate={{ left: "120%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 라벨 */}
      {showLabel && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">진행률</span>
          <span className="text-xs font-semibold text-primary">
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar
