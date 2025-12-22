//client/src/pages/Auth/EmailLogin.tsx
import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import MeageulLogo from "../../Icon/Brand Logo_web ver. (v.1.0) (24.09.22) 1.png";
import { Sparkles, UserPlus, Search, KeyRound } from "lucide-react";

const EmailLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <Link to="/home" className="flex-shrink-0">
            <img src={MeageulLogo} alt="Maegeul Logo" className="h-6 sm:h-7 brightness-0 invert" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>꾸준히 감정일기를 작성하면 나에게 맞는 콘텐츠를 추천받을 확률이 높아져요!</span>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-52px)] py-8 sm:py-12 px-4">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* 왼쪽: 텍스트 영역 */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  다시 만나서 반가워요
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
                회원가입 시 입력했던 이메일 주소와 비밀번호를 입력해 주세요.
                <br className="hidden sm:block" />
                계정 정보가 기억나지 않으시면 아래에서 찾을 수 있어요.
              </p>

              {/* 링크 카드들 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  to="/mainsignup"
                  className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
                    <UserPlus className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">회원가입</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">새 계정 만들기</p>
                  </div>
                </Link>

                <Link
                  to="#"
                  className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
                    <Search className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">계정 찾기</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">이메일 찾기</p>
                  </div>
                </Link>

                <Link
                  to="#"
                  className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
                    <KeyRound className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">비밀번호</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">비밀번호 재설정</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* 오른쪽: 로그인 폼 */}
            <div className="order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    로그인
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    매글 계정으로 로그인하세요
                  </p>
                </div>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;
