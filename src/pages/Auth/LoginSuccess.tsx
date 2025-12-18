// src/pages/LoginSuccess.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 토큰 추출
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // 토큰을 localStorage에 저장
      localStorage.setItem("token", token);
      // 홈 페이지로 이동
      navigate("/home");
    } else {
      // 토큰이 없으면 로그인 실패 처리
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>로그인 중...</div>;
};

export default LoginSuccess;
