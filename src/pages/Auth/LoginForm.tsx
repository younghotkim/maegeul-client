//src/pages/Auth/LoginForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // `useNavigate` 훅을 사용하여 리다이렉트
import { useAuthStore } from "../../hooks/stores/use-auth-store"; // Store 사용
import { apiClient } from "../../lib/api-client"; // api-client 사용

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태
  const navigate = useNavigate(); // 리다이렉트 훅
  const { setUser, setToken } = useAuthStore(); // Store에서 setUser, setToken 가져오기

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 이전 에러 초기화

    try {
      // 로그인 API 호출 (api-client 사용)
      console.log(
        "🔍 로그인 요청 - apiClient baseURL:",
        apiClient.defaults.baseURL
      );
      const loginResponse = await apiClient.post("/login", {
        email,
        password,
      });

      console.log("로그인 응답 데이터:", loginResponse.data);

      // 로그인 성공 시 토큰과 사용자 정보 저장
      if (
        loginResponse.data &&
        loginResponse.data.token &&
        loginResponse.data.user
      ) {
        const token = loginResponse.data.token;

        // Store에 토큰 저장 (localStorage도 자동으로 업데이트됨)
        setToken(token);

        // 사용자 정보를 Store에 저장
        setUser({
          user_id: loginResponse.data.user.user_id,
          email: loginResponse.data.user.email,
          profile_name: loginResponse.data.user.profile_name,
          profile_picture: loginResponse.data.user.profile_picture || undefined,
          isKakaoUser: false, // 카카오 사용자 여부 저장
        });

        // 메인 페이지로 리다이렉트
        navigate("/"); // navigate로 이동
      } else {
        setError("로그인 응답에 필요한 데이터가 없습니다.");
      }
    } catch (err: any) {
      console.log("에러가 발생했습니다:", err);
      if (err.response && err.response.data) {
        setError(
          err.response.data.msg || "잘못된 이메일 주소 또는 비밀번호입니다."
        );
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col w-full max-w-lg mx-auto dark:bg-gray-800 dark:text-white font-plus-jakarta-sans px-6 sm:px-8"
    >
      <div className="mt-6 sm:mt-[34px] mb-6 sm:mb-[30px] text-violet-900 dark:text-violet-400 py-2 font-bold flex flex-col sm:flex-row sm:items-center gap-2">
        <span>이메일주소</span>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
      <input
        type="email"
        placeholder="example@email.com"
        value={email}
        name="email"
        onChange={handleEmailChange}
        className="w-full h-12 mb-6 sm:mb-[38px] text-base sm:text-lg border bg-white border-gray-300 dark:border-gray-600 rounded-xl shadow-sm
        focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-gray-800 dark:text-white px-4"
      />
      <div className="mt-6 sm:mt-[30px] mb-2 text-violet-900 dark:text-violet-400 py-1 font-bold">
        비밀번호
      </div>
      <input
        type="password"
        placeholder="숫자, 특수문자, 영문 포함 8자 이상"
        value={password}
        name="password"
        onChange={handlePasswordChange}
        className="w-full h-12 mb-2 text-base sm:text-lg border bg-white border-gray-300 dark:border-gray-600 rounded-xl shadow-sm
        focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-gray-800 dark:text-white px-4"
      />
      <button
        type="submit"
        className="w-full h-12 mt-6 sm:mt-[35px] bg-violet-500 dark:bg-scampi-600 font-extrabold
         text-white rounded-xl shadow-md text-sm sm:text-base
         hover:border-4 hover:border-violet-300 hover:bg-violet-500 dark:hover:bg-scampi-700 transition-colors"
      >
        매글 로그인 하기
      </button>
    </form>
  );
};

export default LoginForm;
