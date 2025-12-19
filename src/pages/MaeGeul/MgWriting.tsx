import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "../../components/Header"
import ProgressBar from "../../components/ProgressBar"
import MgModal from "./MgModal"
import SaveAiModal from "./SaveAiModal"
import { DiaryGuidePanel } from "./components/DiaryGuidePanel"
import { DiaryEditorPanel } from "./components/DiaryEditorPanel"
import { useDiaryForm } from "./hooks/use-diary-form"
import { useDiarySubmission } from "./hooks/use-diary-submission"
import { cn } from "@/lib/utils"

const MgWriting: React.FC = () => {
  const navigate = useNavigate()
  const form = useDiaryForm()
  const submission = useDiarySubmission()

  // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!form.user) {
      console.warn("User not found, redirecting to login")
      navigate("/mainlogin")
    }
  }, [form.user, navigate])

  // 사용자 정보가 없으면 아무것도 렌더링하지 않음
  if (!form.user) {
    return null
  }

  const handleComplete = async () => {
    if (!form.user || !form.isValid) return

    // Save mood data
    await submission.handleSaveMoodData({
      user_id: form.user.user_id,
      pleasantness: form.pleasantness,
      energy: form.energy,
      label: form.highlightedLabels.join(", "),
      color: form.colorName,
    })

    // Save diary
    await submission.handleSaveDiary({
      user_id: form.user.user_id,
      title: form.title,
      content: form.content,
      color: form.colorName,
    })

    // Open modal and update UI state
    submission.handleModalOpen()
    form.handleClickComplete()
  }

  const handleSaveAi = async () => {
    if (!form.user || !submission.diaryId) return

    await submission.handleSaveEmotionAnalysis({
      user_id: form.user.user_id,
      diary_id: submission.diaryId,
      emotion_result: submission.sentences.join(" "),
    })

    submission.toggleSaveModal()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />

      {/* Progress Section */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
              3
            </span>
            감정 표현하기
          </span>
        </motion.div>
        <ProgressBar value={submission.progressBarValue} />
      </div>

      {/* Main Content */}
      <motion.main
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* 일기장 컨테이너 */}
        <div
          className={cn(
            "relative",
            "bg-gradient-to-br from-amber-100/50 via-orange-50/30 to-yellow-100/50",
            "dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/20",
            "rounded-2xl lg:rounded-3xl",
            "p-3 sm:p-4 lg:p-6",
            "shadow-2xl shadow-amber-900/10 dark:shadow-black/30"
          )}
        >
          {/* 일기장 스프링 효과 (데스크톱) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 z-10">
            <div className="flex gap-6">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full shadow-md"
                />
              ))}
            </div>
          </div>

          {/* 패널 컨테이너 */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Panel - Guide */}
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className={cn(
                  "h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]",
                  "bg-slate-50/80 dark:bg-gray-800/50",
                  "backdrop-blur-sm",
                  "rounded-xl lg:rounded-2xl",
                  "shadow-lg",
                  "border border-slate-200/50 dark:border-gray-700/50"
                )}
              >
                <DiaryGuidePanel
                  emotionResult={submission.emotionResult}
                  userName={form.user?.profile_name}
                  colorName={form.colorName}
                  highlightedColor={form.highlightedColor}
                  highlightedLabels={form.highlightedLabels}
                  onLabelClick={form.handleLabelClick}
                  onSaveAi={handleSaveAi}
                />
              </div>
            </motion.div>

            {/* Right Panel - Editor */}
            <DiaryEditorPanel
              title={form.title}
              formattedDate={form.formattedDate}
              content={form.content}
              userName={form.user?.profile_name}
              maxLength={form.maxLength}
              isContentEditable={form.isContentEditable}
              isButtonVisible={form.isButtonVisible}
              isValid={form.isValid}
              onContentChange={form.setContent}
              onComplete={handleComplete}
            />
          </div>
        </div>

        {/* 하단 장식 */}
        <motion.div
          className="flex justify-center mt-6 lg:mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-muted-foreground/30" />
            <span className="text-xs">오늘의 감정을 기록해보세요</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-muted-foreground/30" />
          </div>
        </motion.div>
      </motion.main>

      {/* Modals */}
      {submission.showModal && (
        <MgModal
          content={form.content}
          onClose={submission.handleModalClose}
          onAnalyzeComplete={submission.handleAnalyzeComplete}
        />
      )}
      <SaveAiModal
        isOpen={submission.isSaveModalOpen}
        onClose={submission.toggleSaveModal}
      />
    </div>
  )
}

export default MgWriting
