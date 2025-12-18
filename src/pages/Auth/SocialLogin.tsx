import React from "react";
import KakaoLoginLg from "../../Icon/kakao_login_large_narrow.png";

// 스타일을 추가할 수도 있음
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

const imageStyle: React.CSSProperties = {
  marginRight: "10px",
};

const KakaoLoginButton: React.FC = () => {
  const handleLogin = () => {
    // 현재 클라이언트 호스트를 쿼리 파라미터로 전달
    const clientHost = `${window.location.protocol}//${window.location.host}`;
    window.location.href = `${BASE_URL}/api/kakao/?clientHost=${encodeURIComponent(
      clientHost
    )}`;
  };

  return (
    <button onClick={handleLogin}>
      <img className="w-96 h-20" src={KakaoLoginLg} alt="Kakao Login Button" />
    </button>
  );
};

export default KakaoLoginButton;
