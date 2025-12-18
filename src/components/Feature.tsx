// src/components/Feature.tsx
import React from "react";
import MessageIcon from "../Icon/Messages.png";
import ThunderIcon from "../Icon/Thunder.png";
import UserIcon from "../Icon/User_White.png";

const Feature: React.FC = () => {
  const features = [
    {
      icon: MessageIcon,
      title: "AI 무디타의 마음챙김 편지",
      description:
        "'당신이 행복해 나도 기쁘다'는 의미를 담은 매글AI '무디타'(Mudita)! 일기 속의 감정을 분석해 개인화된 마음 챙김 가이드를 드려요!",
    },
    {
      icon: ThunderIcon,
      title: "나만의 매글 대시보드",
      description:
        "매일 글로 감정을 기록하는 게 쉽지 않다면? 매글의 대시보드로 나의 감정 추이와 글 작성 통계를 살펴보며 변화와 성장을 만들어요!",
    },
    {
      icon: UserIcon,
      title: "개인화 루틴 콘텐츠 추천",
      description:
        "요즘 나의 마음 상태에는 어떤 시도들이 필요할까? 고민해본 적 있나요? 매글에서는 감정기록 데이터를 반영해 루틴을 추천해드려요!",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-950 flex justify-center items-center py-12 sm:py-20 lg:py-30 font-plus-jakarta-sans">
      <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl w-full max-w-[375px] mx-auto transition-shadow duration-300 ease-in-out
                ${feature.title === "나만의 매글 대시보드" ? "shadow-lg" : ""}
                hover:shadow-lg`}
            >
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex justify-center items-center mb-6">
                <img
                  src={feature.icon}
                  className="w-6 h-6"
                  alt={feature.title}
                />
              </div>
              <h3 className="text-blue-950 dark:text-white text-xl sm:text-2xl font-extrabold font-plus-jakarta-sans leading-loose mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-plus-jakarta-sans font-medium tracking-normal leading-loose">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feature;
