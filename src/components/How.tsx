// src/components/How.tsx
import React, { useState, useEffect } from "react";
import ArrowIcon from "../Icon/chevron_right.png";

const How: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // 2초마다 한 번씩 activeStep을 1, 2, 3 순서로 변경
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep % 3) + 1);
    }, 2000); // 2000ms = 2초

    // 컴포넌트가 언마운트될 때 setInterval을 정리(cleanup)하는 함수
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      step: 1,
      title: "지금 나의 감정을 숫자로 바꿔보기",
      description: (
        <>
          오늘 나의 '편안함 정도'와 '에너지 레벨'을 측정해요. 1부터 10까지의
          숫자로 기분을 환산해 볼 거예요.
        </>
      ),
    },
    {
      step: 2,
      title: "오늘의 무드 컬러와 키워드 진단받기",
      description: (
        <>
          입력한 숫자에 맞춰 오늘의 '무드컬러'를 예측해요. 보이지 않는 감정을
          색깔로, 또 단어로 파악할 수 있어요.
        </>
      ),
    },
    {
      step: 3,
      title: "가이드에 맞춰 무드 일기 작성하기",
      description: (
        <>
          나의 감정을 조금 더 파악한 다음엔 일기를 써보게 됩니다.
          '상황-행동-생각' 순서에 맞춰 글을 작성합니다.
        </>
      ),
    },
  ];

  return (
    <div className="bg-white flex justify-center items-center py-20">
      <div className="max-w-[1140px] w-full bg-white ">
        <div className="flex flex-col items-center gap-14 py-14">
          <div className="text-center">
            <h2 className="text-blue-950 text-4xl font-extrabold font-plus-jakarta-sans leading-10 mb-4">
              매글 무드 일기는 어떻게 쓰나요?
            </h2>
            <p className="text-slate-500 text-base font-medium font-plus-jakarta-sans leading-loose">
              매일 글로 감정을 기록하며 나를 돌보는 루틴을 만들어요. 매일 더
              편안하고 활기찬 기분이 들 수 있도록 매글이 도울게요!
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            {steps.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 flex justify-center items-center rounded-full ${
                    activeStep === item.step
                      ? "bg-indigo-600 text-white"
                      : "border-2 border-indigo-600 text-indigo-600"
                  } transition-colors duration-500`}
                >
                  <div className="text-base font-bold">{item.step}</div>
                </div>
                <div className="flex-1 w-[250px]">
                  <h3 className="text-blue-950 text-base font-bold font-plus-jakarta-sans tracking-tight leading-loose">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-base font-medium font-plus-jakarta-sans tracking-tight leading-loose">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <img
                    className="w-10 h-10 hidden md:block"
                    src={ArrowIcon}
                    alt="Arrow"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default How;
