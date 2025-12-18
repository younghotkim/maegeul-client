//client2/src/pages/Auth/MainLogin.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Apple from "../../Icon/Apple.png";
import Facebook from "../../Icon/Facebook.png";
import Google from "../../Icon/Google.png";
import KakaoIcon from "../../Icon/kakao_login_large_wide.png";
import Email from "../../Icon/email_login.png";
import MeageulLogo from "../../Icon/Brand Logo_web ver. (v.1.0) (24.09.22) 1.png";
import axios from "axios";

// 환경 변수에서 BASE_URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_BASE_URL;
  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl;
  }
  if (import.meta.env.MODE === "production") {
    return "";
  }
  // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5001`;
};

const BASE_URL = getBaseURL();

const MainLogin = () => {
  const navigate = useNavigate();

  const handleEmailLoginClick = () => {
    navigate("/email-login");
  };

  const handleSignupClick = () => {
    navigate("/mainsignup");
  };

  const handleLogin = async () => {
    try {
      // 현재 클라이언트 호스트를 쿼리 파라미터로 전달
      const clientHost = `${window.location.protocol}//${window.location.host}`;
      window.location.href = `${BASE_URL}/api/kakao/?clientHost=${encodeURIComponent(
        clientHost
      )}`;
    } catch (error) {
      console.error("카카오 로그인 요청 실패:", error);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-5 dark:bg-gray-800 dark:text-white">
        <Link to="/home">
          <img
            src={MeageulLogo}
            alt="Maegeul Logo"
            className="w-[300px] justify-center items-center ml-7"
          />
          <h2 className="text-blue-950 text-xl font-bold font-plus-jakarta-sans leading-10 text-center">
            매일 감정 글쓰기를 통해 만드는 단단한 나
          </h2>
        </Link>
        {/* 카카오 로그인 버튼 */}
        <button onClick={handleLogin} className="">
          <img
            className="w-[486px] h-[72px]  object-cover transition-color mt-10  rounded-lg transition-color hover:shadow-lg"
            src={KakaoIcon}
            alt="Kakao Login Button"
          />
        </button>
        {/* 이메일 로그인 버튼 */}
        <button type="button" onClick={handleEmailLoginClick} className="">
          <img
            src={Email}
            className="w-[486px] h-[72px]  object-cover transition-color mt-5  rounded-lg transition-color hover:shadow-lg"
            alt="Email icon"
          />
        </button>
        {/* '또는' 구분선 */}
        <div className="w-[300px] flex items-center mt-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-scampi-700 dark:text-scampi-300">
            또는
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        {/* 소셜 로그인 버튼들 */}
        <div className="flex gap-4 mt-5">
          <button className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <img src={Google} alt="Google" className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <img src={Apple} alt="Apple" className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <img src={Facebook} alt="Facebook" className="w-6 h-6" />
          </button>
        </div>
        {/* 회원가입, 계정찾기, 비밀번호 찾기 */}
        <div className="flex items-center gap-4 mt-5">
          <button
            type="button"
            onClick={handleSignupClick}
            className="text-scampi-500 dark:text-scampi-600 text-sm font-normal"
          >
            회원 가입
          </button>
          <span className="text-scampi-400 dark:text-scampi-600">|</span>
          <button className="text-scampi-500 dark:text-scampi-600 text-sm font-normal">
            계정 찾기
          </button>
          <span className="text-scampi-400 dark:text-scampi-600">|</span>
          <button className="text-scampi-500 dark:text-scampi-600 text-sm font-normal">
            비밀번호 찾기
          </button>
        </div>
        {/* 하단 부분 */}
        <div className=" text-center text-slate-500 text-sm font-medium font-plus-jakarta-sans leading-loose">
          Copyright © Litme Team. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default MainLogin;
