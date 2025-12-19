import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import ProgressBar from "../../components/ProgressBar";
import MgModal from "./MgModal";
import SaveAiModal from "./SaveAiModal";
import { DiaryGuidePanel } from "./components/DiaryGuidePanel";
import { DiaryEditorPanel } from "./components/DiaryEditorPanel";
import { useDiaryForm } from "./hooks/use-diary-form";
import { useDiarySubmission } from "./hooks/use-diary-submission";
import { cn } from "@/lib/utils";
import { Feather, ChevronLeft, ChevronRight } from "lucide-react";

const MgWriting: React.FC = () => {
  const navigate = useNavigate();
  const form = useDiaryForm();
  const submission = useDiarySubmission();
  const [activePanel, setActivePanel] = useState<"guide" | "editor">("editor");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!form.user) {
      console.warn("User not found, redirecting to login");
      navigate("/mainlogin");
    }
    // 로딩 애니메이션
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [form.user, navigate]);

  if (!form.user) {
    return null;
  }

  const handleComplete = async () => {
    if (!form.user || !form.isValid) return;

    // 1. 무드 데이터 저장
    await submission.handleSaveMoodData({
      user_id: form.user.user_id,
      pleasantness: form.pleasantness,
      energy: form.energy,
      label: form.highlightedLabels.join(", "),
      color: form.colorName,
    });

    // 2. 일기 저장
    await submission.handleSaveDiary({
      user_id: form.user.user_id,
      title: form.title,
      content: form.content,
      color: form.colorName,
    });

    // 3. 모달 열기 (분석은 선택사항)
    submission.handleModalOpen();
    form.handleClickComplete();
  };

  const handleSaveAi = async () => {
    if (!form.user || !submission.diaryId) return;

    await submission.handleSaveEmotionAnalysis({
      user_id: form.user.user_id,
      diary_id: submission.diaryId,
      emotion_result: submission.sentences.join(" "),
    });

    submission.toggleSaveModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/20">
      <Header />

      {/* 메인 컨테이너 */}
      <motion.main
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 상단 헤더 */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Feather className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                오늘의 감정 일기
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {form.formattedDate}
              </p>
            </div>
          </div>

          {/* 프로그레스 */}
          <div className="w-full sm:w-64">
            <ProgressBar value={submission.progressBarValue} />
          </div>
        </motion.div>

        {/* 모바일 패널 토글 */}
        <div className="lg:hidden flex justify-center mb-4">
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            <button
              onClick={() => setActivePanel("guide")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activePanel === "guide"
                  ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              가이드
            </button>
            <button
              onClick={() => setActivePanel("editor")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activePanel === "editor"
                  ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              일기 쓰기
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="relative">
          {/* 데스크탑: 2열 레이아웃 */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            {/* 가이드 패널 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
            </motion.div>

            {/* 에디터 패널 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
            </motion.div>
          </div>

          {/* 모바일: 슬라이드 패널 */}
          <div className="lg:hidden relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activePanel === "guide" ? (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  {/* 다음 패널 힌트 */}
                  <button
                    onClick={() => setActivePanel("editor")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
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
                  {/* 이전 패널 힌트 */}
                  <button
                    onClick={() => setActivePanel("guide")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 하단 팁 */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-gray-400 dark:text-gray-500">
            💡 일기를 작성하면 AI가 당신의 감정을 분석해드려요
          </p>
        </motion.div>
      </motion.main>

      {/* Modals */}
      <AnimatePresence>
        {submission.showModal && (
          <MgModal
            content={form.content}
            diaryId={submission.diaryId}
            onClose={submission.handleModalClose}
            onAnalyzeComplete={submission.handleAnalyzeComplete}
          />
        )}
      </AnimatePresence>
      <SaveAiModal
        isOpen={submission.isSaveModalOpen}
        onClose={submission.toggleSaveModal}
      />
    </div>
  );
};

export default MgWriting;
