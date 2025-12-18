import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { moodData } from "../api/moodData";
import { cn } from "../lib/utils";

interface MoodMeterProps {
  pleasantness: number;
  energy: number;
  onColorChange: (color: string) => void;
  onHighlightChange: (labels: string[]) => void;
}

const MoodMeter: React.FC<MoodMeterProps> = ({
  pleasantness,
  energy,
  onColorChange,
  onHighlightChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [highlightedLabels, setHighlightedLabels] = useState<string[]>([]);

  const findMoodIndex = (pleasantness: number, energy: number) => {
    return (10 - energy) * 10 + (pleasantness - 1);
  };

  useEffect(() => {
    const selectedMoodIndex = findMoodIndex(pleasantness, energy);

    // selectedIndex 업데이트 (이전 값과 다를 때만)
    setSelectedIndex((prevIndex) => {
      if (prevIndex !== selectedMoodIndex) {
        return selectedMoodIndex;
      }
      return prevIndex;
    });
  }, [pleasantness, energy]); // selectedIndex 제거

  // selectedIndex가 변경될 때만 색상과 라벨 업데이트
  useEffect(() => {
    if (selectedIndex === null) return;

    const selectedMood = moodData[selectedIndex];
    if (selectedMood) {
      onColorChange(selectedMood.color);
    }

    // 인접한 라벨 계산
    const isAdjacent = (idx1: number, idx2: number) => {
      const row1 = Math.floor(idx1 / 10);
      const col1 = idx1 % 10;
      const row2 = Math.floor(idx2 / 10);
      const col2 = idx2 % 10;
      return (
        (row1 === row2 && Math.abs(col1 - col2) === 1) ||
        (col1 === col2 && Math.abs(row1 - row2) === 1)
      );
    };

    const adjacentLabels = moodData
      .filter(
        (_, idx) => idx === selectedIndex || isAdjacent(selectedIndex, idx)
      )
      .map((mood) => mood.label);

    // 라벨이 변경되었을 때만 업데이트 (함수형 업데이트 사용)
    setHighlightedLabels((prevLabels) => {
      const prevLabelsStr = prevLabels.join(",");
      const newLabelsStr = adjacentLabels.join(",");
      if (prevLabelsStr !== newLabelsStr) {
        onHighlightChange(adjacentLabels);
        return adjacentLabels;
      }
      return prevLabels;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]); // selectedIndex만 의존성으로 사용

  const getClassName = (index: number) => {
    if (selectedIndex === null) return "";

    const isAdjacent = (idx1: number, idx2: number) => {
      const row1 = Math.floor(idx1 / 10);
      const col1 = idx1 % 10;
      const row2 = Math.floor(idx2 / 10);
      const col2 = idx2 % 10;

      return (
        (row1 === row2 && Math.abs(col1 - col2) === 1) ||
        (col1 === col2 && Math.abs(row1 - row2) === 1)
      );
    };

    if (index === selectedIndex || isAdjacent(selectedIndex, index)) {
      return "highlighted";
    }

    return "";
  };

  const isHighlighted = (index: number) => {
    return getClassName(index).includes("highlighted");
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4">
      {/* 모바일: 5열, 태블릿: 7열, 데스크톱: 10열 */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-0.5 sm:gap-1">
        {moodData.map((mood, index) => (
          <motion.div
            key={index}
            className={cn(
              "flex flex-col items-center justify-center",
              "h-10 sm:h-12 md:h-[50px]",
              "text-white font-bold text-[10px] sm:text-xs md:text-sm",
              "text-center rounded-sm sm:rounded cursor-pointer",
              "transition-all duration-300",
              isHighlighted(index)
                ? "brightness-100 scale-105"
                : "brightness-[0.4] hover:brightness-75"
            )}
            style={{ backgroundColor: mood.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6 }}
            whileHover={{ scale: 1.05 }}
          >
            {mood.label && (
              <span className="hidden sm:inline leading-tight">
                {mood.label}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodMeter;
