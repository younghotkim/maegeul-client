import React, { useState } from "react";
import Fire from "../Icon/fire.gif";
import Info from "../Icon/Info.png";
import Tooltip from "./Tooltip";
import CustomSlider from "./CustomSlider";
import { motion } from "framer-motion";

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

  const fireSize = 48 + value * 3; // 슬라이더 값에 따라 이모지 크기 조정

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        {/* 텍스트 섹션 */}
        <h1
          className="text-blue-950 text-5xl font-black font-['font-plus-jakarta-sans'] leading-5
            mb-9 dark:text-scampi-300 inline-flex items-center"
        >
          오늘 나의 에너지 레벨은?
          <Tooltip message="오늘 나의 에너지 레벨은 몇인가요? 활성화 정도를 뜻하는 이 영역에서는 오늘 나의 각성, 흥분 정도를 기록해요.">
            <img src={Info} alt="Info" className="ml-2 cursor-pointer" />
          </Tooltip>
        </h1>
        <div className="text-center text-slate-500 text-base font-bold font-plus-jakarta-sans leading-normal">
          지금 내가 느끼는 활력 정도를 수치로 기록해봐요.
        </div>
      </div>

      {/* 슬라이더 100px의 여백을 추가(mt-20) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // 처음에 투명하고 아래에 위치
        animate={{ opacity: 1, y: 0 }} // 서서히 나타나면서 제자리로 이동
        transition={{ duration: 0.8, ease: "easeOut" }} // 애니메이션 지속 시간을 두 배로 (1.6초)
        className="mt-20"
      >
        <CustomSlider
          value={value}
          onChange={handleSliderChange}
          min={1}
          max={10}
          icon={Fire} // 아이콘으로 Fire 이미지 사용
          iconSize={fireSize}
        />
      </motion.div>

      <div className="text-center mt-8">
        <button
          onClick={onSubmit}
          className="rounded-xl border dark:bg-scampi-600 text-indigo-600 py-2 px-6 shadow-md
           hover:bg-violet-200 border-none dark:hover:bg-scampi-700 transition-colors
          font-bold font-plus-jakarta-sans leading-normal"
        >
          측정 완료하기
        </button>
      </div>
    </div>
  );
};

export default EnergySlider;
