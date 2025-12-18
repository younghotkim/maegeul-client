import React, { useState } from "react";
import { Link } from "react-router-dom";
import WritingImage from "../Image/Banner.png";
import GuideIcon from "../Icon/guideIcon.png";

interface BannerProps {
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ className }) => {
  // 로그인 여부를 localStorage에서 확인
  const [isLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  return (
    <div
      className={`w-full bg-white flex justify-center items-center ${className}`}
    >
      <div className="max-w-[1140px] w-full flex flex-col dark:bg-gray-950 lg:flex-row justify-between items-center relative px-4 sm:px-6 lg:px-8">
        {/* Text area */}
        <div className="flex-1 flex flex-col justify-start items-start gap-4 sm:gap-6 dark:bg-gray-950 py-8 lg:py-0">
          <div className="DailyMoodDiaryWithMaegeul text-indigo-600 text-xs sm:text-sm font-bold font-['Inter'] leading-tight tracking-widest">
            Daily Mood Diary with Maegeul
          </div>
          <div className="text-blue-950 dark:text-white text-2xl sm:text-3xl md:text-4xl font-medium font-plus-jakarta-sans leading-snug tracking-tight">
            나를 돌보는 하루 5분 습관
          </div>
          <div className="text-blue-950 dark:text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-plus-jakarta-sans leading-tight">
            마음챙김 글쓰기 <br />
            매글과 시작해요
          </div>
          <div className="w-full max-w-[470px]">
            <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-bold font-plus-jakarta-sans tracking-tight leading-relaxed">
              매일 글로 기록하는 나의 감정, 매글과 함께 시작하는 하루 기록{" "}
              <br />
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium font-plus-jakarta-sans leading-relaxed tracking-tight">
              바쁜 일상을 살다보면 나의 기분과 감정을 돌볼 시간이 부족해요.
              <br />
              매글에선 5분만에 오늘의 무드 진단과 일기 작성까지 가능해요!{" "}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* 로그인 상태에 따라 링크 경로 변경 */}
            <Link to={isLoggedIn ? "/maegeul" : "/mainsignup"} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-4 bg-indigo-600 rounded-lg text-white text-sm font-bold font-plus-jakarta-sans hover:bg-indigo-500 transition-colors">
                지금 바로 시작하기
              </button>
            </Link>
            <button
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-blue-950 dark:text-white text-sm font-medium font-plus-jakarta-sans
             inline-flex gap-2 justify-center items-center leading-normal hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img src={GuideIcon} alt="Guide" />
              이용 가이드 보기
            </button>
          </div>
        </div>

        {/* Image area */}
        <div className="w-full lg:w-[456px] min-h-[400px] sm:min-h-[500px] md:h-[600px] lg:h-[640px] relative mt-8 lg:mt-0">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img
              src={WritingImage}
              alt="Writing"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
