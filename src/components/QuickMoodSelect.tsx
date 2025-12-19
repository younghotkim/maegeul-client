import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Heart, Cloud, Leaf, ChevronRight, Sparkles } from "lucide-react";
import { moodData } from "../api/moodData";

interface MoodColor {
  id: string;
  name: string;
  color: string;
  emoji: string;
  icon: React.ReactNode;
  description: string;
  // 대표 pleasantness/energy 값 (해당 색상의 중앙값)
  pleasantness: number;
  energy: number;
}

const moodColors: MoodColor[] = [
  {
    id: "red",
    name: "빨간색",
    color: "#EE5D50",
    emoji: "😤",
    icon: <Zap className="w-8 h-8" />,
    description: "불편하고 에너지가 높아요",
    pleasantness: 3,
    energy: 8,
  },
  {
    id: "yellow",
    name: "노란색",
    color: "#FFDE57",
    emoji: "😊",
    icon: <Sparkles className="w-8 h-8" />,
    description: "기분 좋고 활기차요",
    pleasantness: 8,
    energy: 8,
  },
  {
    id: "blue",
    name: "파란색",
    color: "#6AD2FF",
    emoji: "😔",
    icon: <Cloud className="w-8 h-8" />,
    description: "지치고 힘이 없어요",
    pleasantness: 3,
    energy: 3,
  },
  {
    id: "green",
    name: "초록색",
    color: "#35D28A",
    emoji: "😌",
    icon: <Leaf className="w-8 h-8" />,
    description: "평온하고 편안해요",
    pleasantness: 8,
    energy: 3,
  },
];

interface QuickMoodSelectProps {
  onColorSelect: (color: string, pleasantness: number, energy: number) => void;
  onDetailedMode: () => void;
  onLabelSelect: (labels: string[]) => void;
}

const QuickMoodSelect: React.FC<QuickMoodSelectProps> = ({
  onColorSelect,
  onDetailedMode,
  onLabelSelect,
}) => {
  const [selectedColor, setSelectedColor] = useState<MoodColor | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [step, setStep] = useState<"color" | "labels">("color");

  // 선택된 색상에 해당하는 감정 라벨들 가져오기
  const getLabelsForColor = (colorName: string) => {
    return moodData
      .filter((mood) => {
        const colorMap: { [key: string]: string } = {
          빨간색: "#EE5D50",
          노란색: "#FFDE57",
          파란색: "#6AD2FF",
          초록색: "#35D28A",
        };
        return mood.color === colorMap[colorName];
      })
      .map((mood) => mood.label)
      .slice(0, 12); // 최대 12개만 표시
  };

  const handleColorClick = (mood: MoodColor) => {
    setSelectedColor(mood);
    setStep("labels");
  };

  const handleLabelToggle = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : prev.length < 3
          ? [...prev, label]
          : prev
    );
  };

  const handleComplete = () => {
    if (selectedColor) {
      onColorSelect(
        selectedColor.color,
        selectedColor.pleasantness,
        selectedColor.energy
      );
      onLabelSelect(
        selectedLabels.length > 0
          ? selectedLabels
          : [getLabelsForColor(selectedColor.name)[0]]
      );
    }
  };

  const handleSkip = () => {
    if (selectedColor) {
      const defaultLabel = getLabelsForColor(selectedColor.name)[0];
      onColorSelect(
        selectedColor.color,
        selectedColor.pleasantness,
        selectedColor.energy
      );
      onLabelSelect([defaultLabel]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {step === "color" ? (
          <motion.div
            key="color-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 헤더 */}
            <div className="text-center mb-8">
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                오늘 기분은 어떤{" "}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  색
                </span>
                인가요?
              </motion.h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                가장 가까운 감정을 선택해주세요
              </p>
            </div>

            {/* 4색 그리드 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {moodColors.map((mood, index) => (
                <motion.button
                  key={mood.id}
                  className="relative p-6 rounded-2xl border-2 transition-all duration-300 group"
                  style={{
                    backgroundColor: `${mood.color}15`,
                    borderColor: `${mood.color}40`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: mood.color,
                    backgroundColor: `${mood.color}25`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleColorClick(mood)}
                >
                  <div className="flex flex-col items-center gap-3">
                    {/* 이모지 */}
                    <span className="text-4xl sm:text-5xl">{mood.emoji}</span>

                    {/* 색상 이름 */}
                    <span
                      className="font-bold text-lg"
                      style={{ color: mood.color }}
                    >
                      {mood.name}
                    </span>

                    {/* 설명 */}
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                      {mood.description}
                    </span>
                  </div>

                  {/* 호버 시 화살표 */}
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: mood.color }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* 상세 모드 링크 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={onDetailedMode}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors underline underline-offset-4"
              >
                더 자세히 측정하고 싶어요 →
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="label-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 헤더 */}
            <div className="text-center mb-6">
              <motion.div
                className="inline-flex items-center gap-2 mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <span className="text-4xl">{selectedColor?.emoji}</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: selectedColor?.color }}
                >
                  {selectedColor?.name}
                </span>
              </motion.div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                지금 느끼는 감정을 골라주세요
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                최대 3개까지 선택할 수 있어요
              </p>
            </div>

            {/* 감정 라벨 그리드 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {selectedColor &&
                getLabelsForColor(selectedColor.name).map((label, index) => {
                  const isSelected = selectedLabels.includes(label);
                  return (
                    <motion.button
                      key={label}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: selectedColor.color,
                              boxShadow: `0 4px 14px ${selectedColor.color}50`,
                            }
                          : {}
                      }
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLabelToggle(label)}
                    >
                      #{label}
                    </motion.button>
                  );
                })}
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  setStep("color");
                  setSelectedLabels([]);
                }}
                className="px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 
                  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                다시 선택
              </button>

              <button
                onClick={handleSkip}
                className="px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 
                  border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                건너뛰기
              </button>

              <button
                onClick={handleComplete}
                className="px-8 py-3 rounded-xl font-bold text-white
                  shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${selectedColor?.color} 0%, ${selectedColor?.color}dd 100%)`,
                }}
              >
                선택 완료
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickMoodSelect;
