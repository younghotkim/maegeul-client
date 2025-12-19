import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import Emoji_1 from "../Icon/emoji01.gif";
import Emoji_3 from "../Icon/emoji03.gif";
import Emoji_5 from "../Icon/emoji05.gif";
import Emoji_7 from "../Icon/emoji07.gif";
import Emoji_9 from "../Icon/emoji09.gif";
import Tooltip from "./Tooltip";
import ProgressBar from "./ProgressBar";
import CustomSlider from "./CustomSlider";

interface MoodSliderProps {
  onValueChange: (value: number) => void;
  onSubmit: () => void;
}

const emojis = [
  { range: [1, 2], gif: Emoji_1 },
  { range: [3, 4], gif: Emoji_3 },
  { range: [5, 6], gif: Emoji_5 },
  { range: [7, 8], gif: Emoji_7 },
  { range: [9, 10], gif: Emoji_9 },
];

const MoodSlider: React.FC<MoodSliderProps> = ({ onValueChange, onSubmit }) => {
  const [value, setValue] = useState<number>(5);
  const [progress, setProgress] = useState<number>(0);

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    onValueChange(newValue);
    setProgress(20);
  };

  const currentEmoji = emojis.find(
    (emoji) => value >= emoji.range[0] && value <= emoji.range[1]
  );

  return (
    <>
      {/* Progress Bar 섹션 */}
      <div className="w-full max-w-[1140px] relative mt-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-[-2rem] left-4 sm:left-6 lg:left-0 z-10 font-bold text-scampi-700 dark:text-scampi-300 text-sm sm:text-base">
          1단계: 감정 인식하기
        </div>
        <div className="w-full flex justify-center">
          <ProgressBar value={progress} />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
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
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              오늘 나의 편안 지수는?
            </span>
            <Tooltip
              message="오늘 나의 편안함 수치는 몇인가요? 
              만족감, 쾌적함, 기쁨 등 내가 느낀 긍정 감정의 정도를 기록해 봅시다."
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center cursor-help hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 dark:text-violet-400" />
              </div>
            </Tooltip>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            지금 내가 느끼는 편안함, 얼마나 만족스럽고 쾌적한 상태인지
            <br className="hidden sm:block" />
            긍정 감정의 정도를 측정해 봅시다.
          </motion.p>
        </div>

        {/* 슬라이더 카드 */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          {/* 현재 감정 상태 표시 */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"
              key={value}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                현재 편안 지수
              </span>
              <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                {value}
              </span>
              <span className="text-sm text-violet-500 dark:text-violet-400">
                / 10
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
              icon={currentEmoji ? currentEmoji.gif : ""}
              iconSize={52}
            />
          </div>

          {/* 범례 */}
          <div className="flex justify-between items-center mt-8 px-2 sm:px-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                불편함
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                보통
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                편안함
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default MoodSlider;
