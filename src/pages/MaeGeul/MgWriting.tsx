import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import ProgressBar from "../../components/ProgressBar";
import MgModal from "./MgModal";
import SaveAiModal from "./SaveAiModal";
import { DiaryGuidePanel } from "./components/DiaryGuidePanel";
import { DiaryEditorPanel } from "./components/DiaryEditorPanel";
import { useDiaryForm } from "./hooks/use-diary-form";
import { useDiarySubmission } from "./hooks/use-diary-submission";

const MgWriting: React.FC = () => {
  const navigate = useNavigate();
  const form = useDiaryForm();
  const submission = useDiarySubmission();

  // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!form.user) {
      console.warn("User not found, redirecting to login");
      navigate("/mainlogin");
    }
  }, [form.user, navigate]);

  // 사용자 정보가 없으면 아무것도 렌더링하지 않음
  if (!form.user) {
    return null;
  }

  const handleComplete = async () => {
    if (!form.user || !form.isValid) return;

    // Save mood data
    await submission.handleSaveMoodData({
      user_id: form.user.user_id,
      pleasantness: form.pleasantness,
      energy: form.energy,
      label: form.highlightedLabels.join(", "),
      color: form.colorName,
    });

    // Save diary
    await submission.handleSaveDiary({
      user_id: form.user.user_id,
      title: form.title,
      content: form.content,
      color: form.colorName,
    });

    // Open modal and update UI state
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
    <>
      <Header />
      <div className="w-full max-w-[1140px] relative mt-10 mx-auto font-plus-jakarta-sans px-4 sm:px-6 lg:px-8">
        {/* Progress Bar Header */}
        <div className="absolute top-[-2rem] left-4 sm:left-6 lg:left-0 z-10 text-scampi-700 dark:text-scampi-300 font-bold leading-10 text-sm sm:text-base">
          3단계: 감정 표현하기
        </div>
        <div className="w-full flex justify-center">
          <ProgressBar value={submission.progressBarValue} />
        </div>
      </div>

      <motion.div
        className="flex flex-col lg:flex-row w-full max-w-[1140px] min-h-[500px] lg:h-[700px] mx-auto p-0 bg-base dark:bg-gray-700 mt-10 relative font-plus-jakarta-sans px-4 sm:px-6 lg:px-8 gap-4"
        initial={{ opacity: 0, scaleX: 0.5 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Left Panel */}
        <motion.div
          className="w-full lg:w-1/2 h-full p-4 bg-slate-100 rounded-3xl shadow-md dark:bg-gray-700"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "center right" }}
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

        {/* Right Panel */}
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
    </>
  );
};

export default MgWriting;
