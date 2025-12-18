import React from "react";

interface ProgressBarProps {
  value: number; // Progress bar의 값 (0에서 100 사이)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="relative w-full h-5 bg-gray-200 rounded-lg">
      {/* 진행 바 */}
      <div
        className="absolute top-0 left-0 h-full bg-purple-200 rounded-lg"
        style={{ width: `${value}%` }}
      ></div>
      {/* 텍스트 중앙 정렬 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{`${Math.round(
          value
        )}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
