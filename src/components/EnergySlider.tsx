import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info, Zap } from "lucide-react";
import Fire from "../Icon/fire.gif";
import Tooltip from "./Tooltip";
import CustomSlider from "./CustomSlider";

interface EnergySliderProps {
  onValueChange: (value: number) => void;
  onSubmit: () => void;
}

const EnergySlider: React.FC<EnergySliderProps> = ({
  onValueChange,
  onSubmit,
}) => {
  const [value, setValue] = useState<number>(5);

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  const fireSize = 48 + value * 3;

  // 에너지 레벨에 따른 상태 텍스트
  const getEnergyStatus = () => {
    if (value <= 3) return { text: "차분함", color: "text-blue-500" };
    if (value <= 5) return { text: "보통", color: "text-violet-500" };
    if (value <= 7) return { text: "활발함", color: "text-orange-500" };
    return { text: "에너지 폭발!", color: "text-red-500" };
  };

  const energyStatus = getEnergyStatus();

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto mt-8 sm:mt-10 px-4 sm:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 헤더 섹션 */}
      <div className="text-center mb-8 sm:mb-12">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-blue-950 dark:text-white mb-4 sm:mb-6 inline-flex items-center justify-center flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            오늘 나의 에너지 레벨은?
          </span>
          <Tooltip message="오늘 나의 에너지 레벨은 몇인가요? 활성화 정도를 뜻하는 이 영역에서는 오늘 나의 각성, 흥분 정도를 기록해요.">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center cursor-help hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400" />
            </div>
          </Tooltip>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          지금 내가 느끼는 활력 정도를 수치로 기록해봐요.
        </motion.p>
      </div>

      {/* 슬라이더 카드 */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        {/* 현재 에너지 상태 표시 */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
            key={value}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              에너지 레벨
            </span>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {value}
            </span>
            <span className="text-sm text-orange-500 dark:text-orange-400">
              / 10
            </span>
            <span className={`text-sm font-semibold ${energyStatus.color}`}>
              ({energyStatus.text})
            </span>
          </motion.div>
        </div>

        {/* 슬라이더 */}
        <div className="py-4">
          <CustomSlider
            value={value}
            onChange={handleSliderChange}
            min={1}
            max={10}
            icon={Fire}
            iconSize={fireSize}
          />
        </div>

        {/* 범례 */}
        <div className="flex justify-between items-center mt-8 px-2 sm:px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              차분함
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              보통
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              활발함
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              폭발!
            </span>
          </div>
        </div>
      </motion.div>

      {/* 완료 버튼 */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white
            bg-gradient-to-r from-orange-500 to-red-500 
            hover:from-orange-600 hover:to-red-600
            shadow-lg hover:shadow-xl hover:shadow-orange-500/25
            transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Zap className="w-5 h-5" />
          측정 완료하기
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EnergySlider;
