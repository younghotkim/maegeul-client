import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeEmotion } from "../../api/analyzeApi";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { useMoodStore } from "../../hooks/stores/use-mood-store";
import { useDiaryCount } from "../../hooks/queries/use-diary-queries";
import { apiClient } from "../../lib/api-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  X,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Bot,
  Save,
} from "lucide-react";
import Logo from "../../logo/main_logo.png";

// 간단한 마크다운 렌더러
const renderMarkdown = (text: string): React.ReactNode[] => {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    if (!line.trim()) {
      elements.push(<br key={`br-${lineIndex}`} />);
      return;
    }

    // 헤더 처리
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={lineIndex} className="text-lg font-bold text-violet-700 dark:text-violet-300 mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={lineIndex} className="text-xl font-bold text-violet-800 dark:text-violet-200 mt-4 mb-2">
          {line.slice(3)}
        </h2>
      );
      return;
    }

    // 리스트 처리
    if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={lineIndex} className="ml-4 text-gray-700 dark:text-gray-200">
          {renderInlineMarkdown(line.slice(2))}
        </li>
      );
      return;
    }

    // 일반 텍스트
    elements.push(
      <p key={lineIndex} className="text-gray-700 dark:text-gray-200 leading-relaxed mb-2">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  return elements;
};

// 인라인 마크다운 (볼드, 이탤릭, 해시태그)
const renderInlineMarkdown = (text: string): React.ReactNode => {
  // **볼드** 처리
  const parts = text.split(/(\*\*[^*]+\*\*|#[가-힣a-zA-Z0-9_]+)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-violet-700 dark:text-violet-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("#") && part.length > 1) {
      return (
        <span
          key={index}
          className="inline-block px-2 py-0.5 mx-0.5 rounded-full text-sm font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300"
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

interface ModalProps {
  content: string;
  diaryId: number | null;
  onClose: () => void;
  onAnalyzeComplete: (result: string) => void;
}

const MgModal: React.FC<ModalProps> = ({
  content,
  diaryId,
  onClose,
  onAnalyzeComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [savingAnalysis, setSavingAnalysis] = useState(false);
  const [analysisSaved, setAnalysisSaved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const { data: diaryCountData } = useDiaryCount(user?.user_id);
  const navigate = useNavigate();

  // 무드 스토어에서 감정 데이터 가져오기
  const { pleasantness, energy, highlightedLabels, highlightedColor } =
    useMoodStore();

  // 색상 코드를 한글 이름으로 변환
  const getColorName = (colorValue: string | null): string => {
    if (!colorValue) return "";
    switch (colorValue) {
      case "#EE5D50":
        return "빨간색";
      case "#FFDE57":
        return "노란색";
      case "#6AD2FF":
        return "파란색";
      case "#35D28A":
        return "초록색";
      default:
        return "";
    }
  };

  const diaryCount = diaryCountData ?? 0;
  const diaryText =
    diaryCount === 0 ? "첫 번째" : diaryCount ? `${diaryCount}번째` : "N번째";

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleAnalyze = async () => {
    if (!isChecked) return;
    setLoading(true);
    try {
      // 무드 데이터와 함께 분석 요청
      const emotion = await analyzeEmotion({
        text: content,
        moodColor: getColorName(highlightedColor),
        moodLabels: highlightedLabels,
        pleasantness,
        energy,
        userName: user?.profile_name,
      });
      // 결과를 모달 내에서 보여주기
      setAnalysisResult(emotion);
      onAnalyzeComplete(emotion);
    } catch (error) {
      console.error("감정 분석 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  // 분석 결과 저장 (일기는 이미 저장됨)
  const handleSaveAnalysis = async () => {
    if (!user || !diaryId || !analysisResult || savingAnalysis || analysisSaved) return;
    
    setSavingAnalysis(true);
    try {
      await apiClient.post('/emotion', {
        user_id: user.user_id,
        diary_id: diaryId,
        emotion_result: analysisResult,
      });

      setAnalysisSaved(true);
      // 1.5초 후 대시보드로 이동
      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("분석 결과 저장 중 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSavingAnalysis(false);
    }
  };

  // 분석 없이 바로 대시보드로 이동
  const handleSkipAnalysis = () => {
    onClose();
    navigate("/dashboard");
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={handleDashboard}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative z-[10000] w-full max-w-3xl my-2 sm:my-4",
            "bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl",
            "max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          )}
          style={{ margin: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 장식 - 무드 컬러 반영 */}
          <div
            className="h-2"
            style={{
              background: highlightedColor
                ? `linear-gradient(to right, ${highlightedColor}, ${highlightedColor}88, ${highlightedColor})`
                : "linear-gradient(to right, #8b5cf6, #a855f7, #8b5cf6)",
            }}
          />

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
            {/* 분석 결과가 있을 때 */}
            {analysisResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* 결과 헤더 */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                    AI 무디타의 분석 결과
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {user?.profile_name}님의 오늘 하루를 분석했어요
                  </p>
                </div>

                {/* 무드 태그 */}
                {highlightedColor && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${highlightedColor}20`,
                        color: highlightedColor,
                        border: `1px solid ${highlightedColor}40`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: highlightedColor }}
                      />
                      {getColorName(highlightedColor)}
                    </div>
                    {highlightedLabels.slice(0, 3).map((label) => (
                      <span
                        key={label}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        #{label}
                      </span>
                    ))}
                  </div>
                )}

                {/* 분석 결과 내용 */}
                <div
                  className={cn(
                    "p-5 sm:p-6 rounded-xl mb-6",
                    "bg-gradient-to-br from-violet-50 to-purple-50",
                    "dark:from-violet-950/30 dark:to-purple-950/30",
                    "border border-violet-100 dark:border-violet-900/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={Logo}
                        alt="Logo"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                      />
                    </div>
                    <motion.div 
                      className="flex-1 text-sm sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {renderMarkdown(analysisResult)}
                    </motion.div>
                  </div>
                </div>

                {/* 분석 결과 저장 버튼 */}
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={handleSkipAnalysis}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    disabled={savingAnalysis || analysisSaved}
                  >
                    나중에 보기
                  </Button>
                  <Button
                    onClick={handleSaveAnalysis}
                    disabled={savingAnalysis || analysisSaved}
                    variant="violet"
                    size="lg"
                    className="gap-2 px-8"
                  >
                    {savingAnalysis ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        저장 중...
                      </>
                    ) : analysisSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        저장 완료!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        분석 결과 저장
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
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

                {/* 현재 무드 상태 표시 */}
                {highlightedColor && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-2 mb-6"
                  >
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${highlightedColor}20`,
                        color: highlightedColor,
                        border: `1px solid ${highlightedColor}40`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: highlightedColor }}
                      />
                      {getColorName(highlightedColor)}
                    </div>
                    {highlightedLabels.slice(0, 3).map((label) => (
                      <span
                        key={label}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        #{label}
                      </span>
                    ))}
                  </motion.div>
                )}

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
                        무디타봇이 {user?.profile_name}님의 일기와{" "}
                        <span
                          className="font-medium"
                          style={{ color: highlightedColor || "#8b5cf6" }}
                        >
                          {getColorName(highlightedColor) || "무드"} 감정
                        </span>
                        을 분석하여 맞춤형 피드백을 제공해드려요.
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

                {/* 분석 없이 완료 버튼 */}
                <div className="mt-4 text-center">
                  <Button
                    onClick={handleSkipAnalysis}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    분석 없이 완료하기
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MgModal;
