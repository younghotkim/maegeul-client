import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { analyzeEmotion } from "../../api/analyzeApi"
import { useAuthStore } from "../../hooks/stores/use-auth-store"
import { useDiaryCount } from "../../hooks/queries/use-diary-queries"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  X,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Bot,
} from "lucide-react"
import Logo from "../../logo/main_logo.png"

interface ModalProps {
  content: string
  onClose: () => void
  onAnalyzeComplete: (result: string) => void
}

const MgModal: React.FC<ModalProps> = ({
  content,
  onClose,
  onAnalyzeComplete,
}) => {
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const user = useAuthStore((state) => state.user)
  const { data: diaryCountData } = useDiaryCount(user?.user_id)
  const navigate = useNavigate()

  const diaryCount = diaryCountData ?? 0
  const diaryText =
    diaryCount === 0 ? "첫 번째" : diaryCount ? `${diaryCount}번째` : "N번째"

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  const handleAnalyze = async () => {
    if (!isChecked) return
    setLoading(true)
    try {
      const emotion = await analyzeEmotion(content)
      onAnalyzeComplete(emotion)
    } catch (error) {
      console.error("감정 분석 중 오류 발생:", error)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleDashboard}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative z-10 w-full max-w-3xl",
            "bg-card rounded-2xl shadow-2xl",
            "overflow-hidden"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 장식 */}
          <div className="h-2 bg-gradient-to-r from-primary via-violet-500 to-primary" />

          {/* 닫기 버튼 */}
          <button
            onClick={handleDashboard}
            className={cn(
              "absolute top-4 right-4 p-2 rounded-full",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted transition-colors"
            )}
          >
            <X size={20} />
          </button>

          {/* 내용 */}
          <div className="p-6 sm:p-8 lg:p-10">
            {/* 성공 메시지 */}
            <div className="text-center mb-6 lg:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
                {user?.profile_name}님의 {diaryText} 무드일기 작성 완료!
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                꾸준히 무드 일기를 작성하면, 나의 마음 지도를 만들고 자기 돌봄
                습관을 만들어 갈 수 있어요.
              </p>
            </div>

            {/* AI 분석 섹션 */}
            <div
              className={cn(
                "p-4 sm:p-6 rounded-xl",
                "bg-gradient-to-br from-violet-50 to-purple-50",
                "dark:from-violet-950/30 dark:to-purple-950/30",
                "border border-violet-100 dark:border-violet-900/30"
              )}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* 아이콘 */}
                <div className="flex-shrink-0 flex justify-center sm:justify-start">
                  <div className="relative">
                    <img
                      src={Logo}
                      alt="Logo"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* 설명 */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI 하루진단 받아보기
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    무디타봇이 {user?.profile_name}님의 일기를 분석하여 오늘 느낀
                    감정을 파악하고, 맞춤형 기분 가이드를 제공해드려요.
                  </p>

                  {/* 동의 체크박스 */}
                  <label className="flex items-start gap-2 cursor-pointer group mb-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      AI 분석을 위해 OpenAI에 작성글을 전송하는 것에 동의합니다.
                    </span>
                  </label>

                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    이용 약관 자세히 보기
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* 버튼 */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!isChecked || loading}
                    variant="violet"
                    size="lg"
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        AI 하루진단
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MgModal
