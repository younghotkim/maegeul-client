import React from "react";
import { motion } from "framer-motion";

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  icon: string;
  iconSize?: number;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  onChange,
  min,
  max,
  icon,
  iconSize = 48,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  // 색상 그라데이션 (값에 따라 변화)
  const getTrackColor = () => {
    if (value <= 3) return "from-blue-400 to-blue-500";
    if (value <= 5) return "from-blue-400 to-violet-500";
    if (value <= 7) return "from-violet-400 to-orange-400";
    return "from-orange-400 to-red-500";
  };

  return (
    <div className="relative w-full max-w-[570px] h-24 mx-auto select-none px-4">
      {/* 슬라이더 트랙 배경 */}
      <div className="absolute left-4 right-4 top-10 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        {/* 활성 트랙 */}
        <motion.div
          className={`h-full bg-gradient-to-r ${getTrackColor()} rounded-full`}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </div>

      {/* 눈금 표시 */}
      <div className="absolute left-4 right-4 top-[60px] flex justify-between px-1">
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <div
            key={i}
            className={`text-xs font-medium transition-colors duration-200 ${
              i + min === value
                ? "text-violet-600 dark:text-violet-400 font-bold scale-110"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {i + min}
          </div>
        ))}
      </div>

      {/* 숨겨진 네이티브 슬라이더 (접근성용) */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="absolute left-4 right-4 top-8 h-8 appearance-none bg-transparent cursor-pointer z-10 opacity-0"
        aria-label="슬라이더"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />

      {/* 이모지 아이콘 (Thumb 역할) */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          top: `${36 - iconSize / 2}px`,
        }}
        initial={false}
        animate={{
          left: `calc(${percentage}% - ${iconSize / 2}px + 16px - ${(percentage / 100) * 32}px)`,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.img
          src={icon}
          alt="감정 아이콘"
          className="w-full h-full drop-shadow-lg"
          initial={false}
          animate={{ scale: 1 }}
          whileTap={{ scale: 1.2 }}
        />
      </motion.div>
    </div>
  );
};

export default CustomSlider;
