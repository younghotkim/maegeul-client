import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { moodData } from "../api/moodData";
import { cn } from "../lib/utils";

interface MoodMeterProps {
  pleasantness: number;
  energy: number;
  onColorChange: (color: string) => void;
  onHighlightChange: (labels: string[]) => void;
  compact?: boolean;
}

const MoodMeter: React.FC<MoodMeterProps> = ({
  pleasantness,
  energy,
  onColorChange,
  onHighlightChange,
  compact = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const findMoodIndex = (pleasantness: number, energy: number) => {
    return (10 - energy) * 10 + (pleasantness - 1);
  };

  useEffect(() => {
    const selectedMoodIndex = findMoodIndex(pleasantness, energy);
    setSelectedIndex((prevIndex) => {
      if (prevIndex !== selectedMoodIndex) {
        return selectedMoodIndex;
      }
      return prevIndex;
    });
  }, [pleasantness, energy]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const selectedMood = moodData[selectedIndex];
    if (selectedMood) {
      onColorChange(selectedMood.color);
    }

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

    onHighlightChange(adjacentLabels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const isHighlighted = (index: number) => {
    if (selectedIndex === null) return false;

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

    return index === selectedIndex || isAdjacent(selectedIndex, index);
  };

  // 컴팩트 모드 (모바일 Bottom Sheet용)
  if (compact) {
    return (
      <div className="w-full max-w-[320px] mx-auto">
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: "repeat(10, 1fr)",
          }}
        >
          {moodData.map((mood, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-full aspect-square flex items-center justify-center",
                "rounded-[2px] cursor-pointer",
                "transition-all duration-300",
                isHighlighted(index)
                  ? "brightness-100 ring-1 ring-white/50 z-10"
                  : "brightness-[0.4]"
              )}
              style={{ backgroundColor: mood.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.002 }}
            />
          ))}
        </div>

        {/* 축 레이블 */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            불쾌함
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            ← 편안함 →
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            쾌적함
          </span>
        </div>
      </div>
    );
  }

  // 기본 모드 (데스크탑/태블릿) - 고정 크기 셀 사용
  const cellSize = 54; // 고정 셀 크기 (px)
  const gap = 4; // gap 크기 (px)
  const gridWidth = cellSize * 10 + gap * 9;

  return (
    <div className="mx-auto" style={{ width: gridWidth }}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(10, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {moodData.map((mood, index) => (
          <motion.div
            key={index}
            className={cn(
              "flex flex-col items-center justify-center overflow-hidden",
              "text-white font-bold text-[10px]",
              "text-center rounded cursor-pointer",
              "transition-all duration-300",
              isHighlighted(index)
                ? "brightness-100 scale-105 ring-2 ring-white/60 z-10"
                : "brightness-[0.4] hover:brightness-75"
            )}
            style={{
              backgroundColor: mood.color,
              width: cellSize,
              height: cellSize,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.005 }}
            whileHover={{ scale: 1.08 }}
          >
            <span className="leading-tight px-0.5 truncate w-full">
              {mood.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* 축 레이블 */}
      <div className="flex justify-between mt-3 px-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">불쾌함</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          ← 편안함 (Pleasantness) →
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">쾌적함</span>
      </div>
    </div>
  );
};

export default MoodMeter;
