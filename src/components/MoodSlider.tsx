import React, { useState } from "react";
import Emoji_1 from "../Icon/emoji01.gif";
import Emoji_3 from "../Icon/emoji03.gif";
import Emoji_5 from "../Icon/emoji05.gif";
import Emoji_7 from "../Icon/emoji07.gif";
import Emoji_9 from "../Icon/emoji09.gif";
import Info from "../Icon/Info.png";
import Tooltip from "./Tooltip";
import ProgressBar from "./ProgressBar";
import CustomSlider from "./CustomSlider";
import { motion } from "framer-motion";

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
  const [value, setValue] = useState<number>(5); // 초기값 5로 설정
  const [progress, setProgress] = useState<number>(0); // ProgressBar의 상태값

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    onValueChange(newValue);
    setProgress(20); // 슬라이더가 변경되면 ProgressBar를 20%로 설정
  };

  const currentEmoji = emojis.find(
    (emoji) => value >= emoji.range[0] && value <= emoji.range[1]
  );

  return (
    <>
      <div className="w-[1140px] relative mt-10 mx-auto">
        {/* 텍스트 (ProgressBar 왼쪽 끝에 위치) */}
        <div className="absolute top-[-2rem] left-0 z-10 font-bold text-scampi-700 dark:text-scampi-300 font-['DM Sans'] leading-10">
          1단계: 감정 인식하기
        </div>
        {/* Progress Bar (가운데에 위치) */}
        <div className="w-full flex justify-center">
          <ProgressBar value={progress} />{" "}
          {/* ProgressBar의 value를 상태값으로 설정 */}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-10">
        <div className="text-center mb-8">
          <h1
            className="text-blue-950 text-5xl font-black font-['font-plus-jakarta-sans'] leading-5
            mb-9 dark:text-scampi-300 inline-flex items-center"
          >
            오늘 나의 편안 지수는?
            <Tooltip
              message="오늘 나의 편안함 수치는 몇인가요? 
            만족감, 쾌적함, 기쁨 등 내가 느낀 긍정 감정의 정도를 기록해 봅시다."
            >
              <img src={Info} alt="Info" className="ml-2 cursor-pointer" />
            </Tooltip>
          </h1>
          <div className="text-center text-slate-500 text-base font-bold font-plus-jakarta-sans leading-normal">
            지금 내가 느끼는 편안함, 얼마나 만족스럽고 쾌적한 상태인지 긍정
            감정의 정도를 측정해 봅시다.
          </div>
        </div>
        {/* 슬라이더 100px의 여백을 추가(mt-20) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} // 시작할 때 완전히 투명하고 아래에 위치
          animate={{ opacity: 1, y: 0 }} // 등장하면서 서서히 보이고 제자리로 이동
          transition={{ duration: 0.8, ease: "easeOut" }} // 부드러운 애니메이션과 0.8초의 지속 시간
          className="mt-20"
        >
          <CustomSlider
            value={value}
            onChange={handleSliderChange}
            min={1}
            max={10}
            icon={currentEmoji ? currentEmoji.gif : ""}
            iconSize={48}
          />
        </motion.div>
      </div>
    </>
  );
};

export default MoodSlider;
