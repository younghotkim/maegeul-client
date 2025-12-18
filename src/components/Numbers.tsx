// src/components/Nubmers.tsx
import React from "react";
import NumberImage from "../Image/Numbers.png";

const Numbers: React.FC = () => {
  const numberItems = [
    {
      number: "150분",
      title: "하루 5분씩 꾸준히 한 달 작성하면?",
      description:
        "하루 5분 나의 일상을 잠시 회고해요. 한 달이면 글쓰기 150분 확보 가능!",
    },
    {
      number: "40+",
      title: "매글을 지지해 준 분들은?",
      description:
        "매글 서비스의 기획 의도에 공감하며 응원을 보내는 분들이 늘어나는 중!",
    },
    {
      number: "92%",
      title: "매글의 감정 시각화 긍정 반응도?",
      description:
        "런칭 전 사용설문에서 매글의 기능이 마음돌봄에 긍정적이라는 다수 반응!",
    },
    {
      number: "76%",
      title: "실험으로 입증된 감정일기의 효과?",
      description:
        "상처 회복 실험에서 감정일기를 작성한 그룹이 34%나 빠른 회복을 보임!",
    },
  ];

  return (
    <div className="flex justify-center py-12 sm:py-20 lg:py-40 bg-white dark:bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1140px] w-full flex flex-col lg:flex-row items-start gap-8 sm:gap-16 lg:gap-[110px]">
        <div className="flex-1 flex-col justify-start items-start gap-8 sm:gap-14 inline-flex leading-tight w-full">
          <div className="flex-col justify-start items-start gap-2.5 flex w-full max-w-[515px]">
            <h2 className="text-blue-950 dark:text-white text-2xl sm:text-3xl font-extrabold font-plus-jakarta-sans leading-tight tracking-tighter mb-2.5 text-left">
              나의 하루를 돌보는 감정일기 플랫폼 매글
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-plus-jakarta-sans leading-loose text-left tracking-tighter">
              바쁜 일상 속에서 놓치기 쉬운 나의 마음 챙김을 매글에서 쉽게
              시작해보세요. <br />
              하루 중 나의 편안 지수와 에너지 레벨을 측정해 오늘의 무드 컬러를
              알려드려요.
            </p>
          </div>
          <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {numberItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="text-blue-950 dark:text-white text-2xl sm:text-3xl font-extrabold font-plus-jakarta-sans leading-loose">
                  {item.number}
                </div>
                <div className="text-blue-950 dark:text-white text-sm font-bold font-plus-jakarta-sans leading-loose">
                  {item.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium font-plus-jakarta-sans leading-loose">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[555px] min-h-[300px] sm:min-h-[400px] lg:h-[506px] px-4 sm:px-8 lg:px-[150px] relative">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img
              src={NumberImage}
              alt="NumberImage"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Numbers;
