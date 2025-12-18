import React, { useState } from "react";
import { motion } from "framer-motion";

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  icon: string;
  iconSize: number;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  onChange,
  min,
  max,
  icon,
  iconSize,
}) => {
  const [value, setValue] = useState(5);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-[570px] h-24 mx-auto select-none">
      {/* 슬라이더 배경 */}
      <div className="absolute w-full h-3 bg-black/10 rounded-full">
        <motion.div
          className="h-full bg-violet-300 rounded-full"
          style={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }} // 애니메이션 부드럽게
        />
      </div>

      {/* Thumb 대신 Slider가 움직임 */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="absolute w-full h-3 appearance-none bg-transparent cursor-pointer"
        style={{ opacity: 0, zIndex: 1 }} // 기본 슬라이더 숨김
      />

      {/* 아이콘 이미지와 크기 */}
      <motion.div
        className="absolute transition-all duration-300 ease-out pointer-events-none"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          bottom: "1px",
          left: `calc(${percentage}% - ${iconSize / 2}px)`, // 슬라이더 위치 계산
        }}
      >
        <img src={icon} alt="Icon" className="w-full h-full" />
      </motion.div>

      {/* Thumb에 Value 표시 및 Shadow 효과 추가 */}
      <motion.div
        className="absolute w-[60px] h-[60px] bg-violet-300 rounded-full shadow-lg flex items-center justify-center text-white font-bold"
        style={{ left: `calc(${percentage}% - 30px)`, top: "-25px" }} // 중앙 정렬
        animate={{ left: `calc(${percentage}% - 30px)` }}
        transition={{
          type: "spring",
          stiffness: 500, // thumb이 빠르게 따라가도록 설정
          damping: 30, // 스프링 감속
        }}
      >
        {value} {/* 슬라이더 버튼 안에 값 표시 */}
      </motion.div>
    </div>
  );
};

export default CustomSlider;
