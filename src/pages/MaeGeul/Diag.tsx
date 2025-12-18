import React, { useEffect, useState, useCallback } from "react";
import MoodSlider from "../../components/MoodSlider";
import EnergySlider from "../../components/EnergySlider";
import MoodMeter from "../../components/MoodMeter";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../hooks/stores/use-auth-store"; // Store 사용
import { useMoodStore } from "../../hooks/stores/use-mood-store"; // Store 사용
import ProgressBar from "../../components/ProgressBar";

const Diag: React.FC = () => {
  const [moodValue, setMoodValue] = useState<number>(5);
  const [energyValue, setEnergyValue] = useState<number>(5);
  const [submitted, setSubmitted] = useState(false);

  // Store에서 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  // Store에서 mood 데이터 가져오기
  const {
    highlightedLabels,
    setHighlightedLabels,
    highlightedColor,
    setHighlightedColor,
    setPleasantness,
    setEnergy,
  } = useMoodStore();

  // RGB 값에 따른 색상 이름 반환 함수
  const getColorName = (colorValue: string) => {
    switch (colorValue) {
      case "#EE5D50":
        return "빨간색";
      case "#FFDE57":
        return "노란색";
      case "#6AD2FF":
        return "파란색";
      case "#35D28A":
        return "초록색";
      default:
        return "마음 색상";
    }
  };

  const handleMoodChange = useCallback(
    (value: number) => {
      setMoodValue(value);
      setPleasantness(value); // Store에도 저장
    },
    [setPleasantness]
  );

  const handleEnergyChange = useCallback(
    (value: number) => {
      setEnergyValue(value);
      setEnergy(value); // Store에도 저장
    },
    [setEnergy]
  );

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const handleRetry = useCallback(() => {
    setSubmitted(false);
    setMoodValue(5);
    setEnergyValue(5);
  }, []);

  // MoodMeter에서 전달받은 color를 업데이트하는 함수
  const handleColorChange = useCallback(
    (color: string) => {
      setHighlightedColor(color); // Store의 setHighlightedColor 사용
    },
    [setHighlightedColor]
  );

  // MoodMeter에서 highlight된 라벨들을 업데이트하는 함수
  const handleHighlightChange = useCallback(
    (labels: string[]) => {
      setHighlightedLabels(labels); // Store의 setHighlightedLabels 사용
    },
    [setHighlightedLabels]
  );

  // 제출된 경우 표시할 내용
  if (submitted) {
    const colorName = highlightedColor ? getColorName(highlightedColor) : "";

    return (
      <>
        <div className="w-[1140px] relative mt-10 mx-auto">
          {/* 텍스트 (ProgressBar 왼쪽 끝에 위치) */}
          <div className="absolute top-[-2rem] left-0 z-10 font-bold text-scampi-700 dark:text-scampi-300 font-['font-plus-jakarta-sans'] leading-10">
            2단계: 감정 이해하기
          </div>
          {/* Progress Bar (가운데에 위치) */}
          <div className="w-full flex justify-center">
            <ProgressBar value={50} />
          </div>
        </div>
        <div className="text-center p-4">
          <p className="text-blue-950 dark:text-scampi-300 text-4xl font-bold font-['font-plus-jakarta-sans'] leading-10 mt-3 flex justify-center items-center">
            오늘 {user?.profile_name}님의 무드 컬러는 {colorName}
            {highlightedColor && (
              <span
                style={{
                  display: "inline-block",
                  width: "45px",
                  height: "45px",
                  marginLeft: "5px",
                  backgroundColor: highlightedColor,
                  borderRadius: "3px",
                }}
              />
            )}
            이에요.
          </p>

          {highlightedLabels.length > 0 && (
            <p className="text-text-blue-950 dark:text-scampi-300 text-2xl font-bold font-['font-plus-jakarta-sans'] leading-10 mt-2">
              #{highlightedLabels.join("#")}
            </p>
          )}
          <div className="flex justify-center items-center mt-5">
            <MoodMeter
              pleasantness={moodValue}
              energy={energyValue}
              onColorChange={handleColorChange}
              onHighlightChange={handleHighlightChange}
            />
          </div>
          <div className="w-full bg-slate-100 flex justify-center items-center mt-5">
            <p className="text-blue-950 text-lg font-bold font-['font-plus-jakarta-sans'] text-center">
              내 감정을 더욱 정확하게 알아보기 위해서, <br />
              지금 바로 감정 일기를 작성하러 가볼까요?
            </p>
          </div>
          <div className="flex justify-center gap-4 p-0 mt-5">
            <button
              onClick={handleRetry}
              className="rounded-xl border dark:bg-scampi-600 text-indigo-600 py-2 px-8 shadow-md
           hover:bg-violet-200 border-none dark:hover:bg-scampi-700 transition-colors
          font-bold font-plus-jakarta-sans leading-normal"
            >
              다시 측정하기
            </button>
            <Link to="/MgWriting">
              <button
                className="rounded-xl border bg-violet-200 dark:bg-scampi-600 text-indigo-600 py-2 px-8 shadow-md
           hover:bg-slate-50 border-none dark:hover:bg-scampi-700 transition-colors font-bold font-plus-jakarta-sans leading-normal"
              >
                무드 일기쓰기
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  // 제출되지 않은 경우 슬라이더 표시
  return (
    <div className="flex flex-col items-center">
      <MoodSlider onValueChange={handleMoodChange} onSubmit={handleSubmit} />
      <EnergySlider
        onValueChange={handleEnergyChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Diag;
