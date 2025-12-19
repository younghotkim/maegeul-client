import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/stores/use-auth-store";

const LogoutForm = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleLogout = () => {
      try {
        // Store의 logout 함수 호출 (토큰, 사용자 정보 모두 초기화)
        logout();
        // 로그아웃 성공 시 홈 페이지로 리다이렉트
        navigate("/");
      } catch (err) {
        console.error("로그아웃에 실패했습니다.", err);
      }
    };

    handleLogout();
  }, [navigate, logout]);

  return null;
};

export default LogoutForm;
