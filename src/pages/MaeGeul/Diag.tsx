import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, PenLine, Sparkles, Grid3X3, X } from "lucide-react";
import MoodSlider from "../../components/MoodSlider";
import EnergySlider from "../../components/EnergySlider";
import MoodMeter from "../../components/MoodMeter";
import ProgressBar from "../../components/ProgressBar";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { useMoodStore } from "../../hooks/stores/use-mood-store";

const Diag: React.FC = () => {
  const [moodValue, setMoodValue] = useState<number>(5);
  const [energyValue, setEnergyValue] = useState<number>(5);
  const [submitted, setSubmitted] = useState(false);
  const [showMoodMeter, setShowMoodMeter] = useState(false);

  const user = useAuthStore((state) => state.user);

  const {
    highlightedLabels,
    setHighlightedLabels,
    highlightedColor,
    setHighlightedColor,
    setPleasantness,
    setEnergy,
  } = useMoodStore();

  const getColorName = (colorValue: string) => {
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
        return "마음 색상";
    }
  };

  const handleMoodChange = useCallback(
    (value: number) => {
      setMoodValue(value);
      setPleasantness(value);
    },
    [setPleasantness]
  );

  const handleEnergyChange = useCallback(
    (value: number) => {
      setEnergyValue(value);
      setEnergy(value);
    },
    [setEnergy]
  );

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const handleRetry = useCallback(() => {
    setSubmitted(false);
    setMoodValue(5);
    setEnergyValue(5);
  }, []);

  const handleColorChange = useCallback(
    (color: string) => {
      setHighlightedColor(color);
    },
    [setHighlightedColor]
  );

  const handleHighlightChange = useCallback(
    (labels: string[]) => {
      setHighlightedLabels(labels);
    },
    [setHighlightedLabels]
  );

  // 결과 화면
  if (submitted) {
    const colorName = highlightedColor ? getColorName(highlightedColor) : "";

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Progress Bar 섹션 */}
        <div className="w-full max-w-[1140px] relative pt-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute top-6 left-4 sm:left-6 lg:left-0 z-10 font-bold text-scampi-700 dark:text-scampi-300 text-sm sm:text-base">
            2단계: 감정 이해하기
          </div>
          <div className="w-full flex justify-center">
            <ProgressBar value={50} />
          </div>
        </div>

        {/* 결과 컨텐츠 */}
        <motion.div
          className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 결과 카드 */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* 헤더 */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                className="inline-flex items-center gap-2 mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  오늘의 무드 컬러 결과
                </span>
              </motion.div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-950 dark:text-white leading-tight">
                <span className="block sm:inline">
                  오늘 {user?.profile_name}님의
                </span>{" "}
                <span className="block sm:inline">
                  무드 컬러는{" "}
                  <span
                    className="inline-flex items-center gap-2"
                    style={{ color: highlightedColor || "#667eea" }}
                  >
                    {colorName}
                    {highlightedColor && (
                      <span
                        className="inline-block w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-md"
                        style={{ backgroundColor: highlightedColor }}
                      />
                    )}
                  </span>
                  이에요.
                </span>
              </h2>

              {/* 감정 태그 */}
              {highlightedLabels.length > 0 && (
                <motion.div
                  className="flex flex-wrap justify-center gap-2 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {highlightedLabels.map((label, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${highlightedColor || "#667eea"}20`,
                        color: highlightedColor || "#667eea",
                        border: `1px solid ${highlightedColor || "#667eea"}40`,
                      }}
                    >
                      #{label}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* 모바일: 무드미터 보기 버튼 */}
            <div className="md:hidden flex justify-center my-6">
              <button
                onClick={() => setShowMoodMeter(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold
                  text-white bg-gradient-to-r from-violet-500 to-purple-500
                  shadow-lg hover:shadow-xl
                  transform active:scale-95 transition-all duration-200"
                style={{
                  background: highlightedColor
                    ? `linear-gradient(135deg, ${highlightedColor} 0%, ${highlightedColor}dd 100%)`
                    : undefined,
                }}
              >
                <Grid3X3 className="w-5 h-5" />
                무드미터 자세히 보기
              </button>
            </div>

            {/* 데스크탑: MoodMeter 직접 표시 */}
            <motion.div
              className="hidden md:flex justify-center items-center my-6 sm:my-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <MoodMeter
                pleasantness={moodValue}
                energy={energyValue}
                onColorChange={handleColorChange}
                onHighlightChange={handleHighlightChange}
              />
            </motion.div>

            {/* CTA 섹션 */}
            <motion.div
              className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-4 sm:p-6 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-center text-blue-950 dark:text-white text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6">
                내 감정을 더욱 정확하게 알아보기 위해서,
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> </span>
                지금 바로 감정 일기를 작성하러 가볼까요?
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold
                    text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-800
                    border-2 border-violet-200 dark:border-violet-800
                    hover:bg-violet-50 dark:hover:bg-violet-900/30
                    transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  다시 측정하기
                </button>

                <Link to="/MgWriting">
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold
                      text-white bg-gradient-to-r from-violet-600 to-indigo-600
                      hover:from-violet-700 hover:to-indigo-700
                      shadow-lg hover:shadow-xl hover:shadow-violet-500/25
                      transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <PenLine className="w-5 h-5" />
                    무드 일기쓰기
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 모바일 무드미터 모달 (Bottom Sheet 스타일) */}
        <AnimatePresence>
          {showMoodMeter && (
            <>
              {/* 배경 오버레이 */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMoodMeter(false)}
              />

              {/* Bottom Sheet */}
              <motion.div
                className="fixed inset-x-0 bottom-0 z-50 md:hidden"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden">
                  {/* 핸들 바 */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  </div>

                  {/* 헤더 */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      무드미터
                    </h3>
                    <button
                      onClick={() => setShowMoodMeter(false)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* 무드미터 컨텐츠 */}
                  <div className="p-4 overflow-auto">
                    <div className="flex justify-center px-2">
                      <MoodMeter
                        pleasantness={moodValue}
                        energy={energyValue}
                        onColorChange={handleColorChange}
                        onHighlightChange={handleHighlightChange}
                        compact
                      />
                    </div>

                    {/* 현재 선택된 감정 표시 */}
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        현재 선택된 감정
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {highlightedLabels.map((label, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${highlightedColor || "#667eea"}20`,
                              color: highlightedColor || "#667eea",
                              border: `1px solid ${highlightedColor || "#667eea"}40`,
                            }}
                          >
                            #{label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 닫기 버튼 */}
                    <button
                      onClick={() => setShowMoodMeter(false)}
                      className="w-full mt-6 mb-2 py-3 rounded-xl font-bold text-white
                        bg-gradient-to-r from-violet-600 to-indigo-600
                        shadow-lg active:scale-95 transition-transform"
                    >
                      확인
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 슬라이더 화면
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-10">
      <div className="flex flex-col items-center gap-6 sm:gap-8">
        <MoodSlider onValueChange={handleMoodChange} onSubmit={handleSubmit} />
        <EnergySlider
          onValueChange={handleEnergyChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Diag;
