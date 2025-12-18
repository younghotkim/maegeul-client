//client2/src/pages/Auth/EmailLogin.tsx
import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import MeageulLogo from "../../Icon/Brand Logo_web ver. (v.1.0) (24.09.22) 1.png";

const EmailLogin = () => {
  return (
    <>
      {/* 상단 광고 줄 */}
      <div className="font-plus-jakarta-sans items-center justify-center flex w-full bg-violet-400 p-2 sm:p-3 text-xs sm:text-sm px-4">
        <Link to="/home" className="flex-shrink-0">
          <img src={MeageulLogo} alt="Maegeul Logo" className="w-20 sm:w-[100px]" />
        </Link>
        <div className="text-white font-plus-jakarta-sans ml-2 sm:ml-3">
          꾸준히 감정일기를 작성하면 나에게 맞는 콘텐츠를 추천받을 확률이
          높아져요!
        </div>
      </div>

      {/* 이메일 로그인 페이지 */}
      <div className="font-plus-jakarta-sans min-h-screen bg-white dark:bg-gray-800 dark:text-white py-8 sm:py-12">
        {/* 컨테이너 추가: 텍스트와 로그인 폼을 함께 감싸는 컨테이너 */}
        <div className="container mx-auto h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* 그리드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-6xl">
            {/* 텍스트 영역 */}
            <div className="flex flex-col justify-center p-4 sm:p-8 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 text-violet-500 dark:text-violet-400">
                이메일 로그인하기
              </h2>
              <p className="text-xs sm:text-sm text-violet-950 dark:text-violet-200 leading-6 mb-6 sm:mb-10">
                회원가입 시에 입력했던 이메일 주소와 비밀번호를 입력해 주세요.
                <br /> 만약 이메일 주소나 비밀번호가 기억나지 않는다면 아래의
                계정 찾기 버튼을 통해 확인 후 로그인할 수 있어요.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-violet-500 dark:text-violet-400 mb-4 sm:mb-10">
                회원가입 정보가 기억나지 않는다면?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-10">
                <Link
                  to="/mainsignup"
                  className="text-slate-400 dark:text-slate-300 font-plus-jakarta-sans hover:font-bold hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-300"
                >
                  회원가입
                </Link>
                <Link
                  to="#"
                  className="text-slate-400 dark:text-slate-300 font-plus-jakarta-sans hover:font-bold hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-300"
                >
                  계정 찾기
                </Link>
                <Link
                  to="#"
                  className="text-slate-400 dark:text-slate-300 font-plus-jakarta-sans hover:font-bold hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-300"
                >
                  비밀번호 찾기
                </Link>
              </div>
            </div>

            {/* 로그인 폼 영역 */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[463px] min-h-[400px] sm:min-h-[481px] items-center justify-center rounded-xl bg-slate-100 dark:bg-gray-900">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailLogin;
