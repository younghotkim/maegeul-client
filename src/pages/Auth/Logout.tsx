import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // `useNavigate` 훅을 사용하여 리다이렉트

const LogoutForm = () => {
  const navigate = useNavigate(); // 리다이렉트 훅

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem("token");
        // 로그아웃 성공 시 홈 페이지로 리다이렉트
        navigate("/");
      } catch (err) {
        console.error("로그아웃에 실패했습니다.", err);
        // 만약 로그아웃 실패 시 사용자에게 오류 메시지 표시 가능 (예: 에러 페이지 이동)
        // navigate("/error");
      }
    };

    handleLogout();
  }, [navigate]);

  // 이 컴포넌트는 UI를 렌더링하지 않음 (렌더할 필요 없음)
  return null;
};

export default LogoutForm;
