import React from "react";
import KakaoLoginLg from "../../Icon/kakao_login_large_narrow.png";

// 환경 변수에서 API URL을 가져옴
const getAPIURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // 디버깅: 환경 변수 확인
  console.log("🔍 SocialLogin API URL 확인:");
  console.log("  - VITE_API_URL:", envUrl);
  console.log("  - MODE:", import.meta.env.MODE);

  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    const apiUrl = envUrl.replace(/\/api$/, ""); // /api 제거 (이미 포함되어 있을 수 있음)
    console.log("✅ 환경 변수에서 API URL 사용:", apiUrl);
    return apiUrl;
  }

  // 환경 변수가 없으면 에러
  console.error("❌ VITE_API_URL 환경 변수가 설정되지 않았습니다.");
  console.error("현재 window.location:", window.location.href);
  console.error("개발 환경에서는 .env 파일에 VITE_API_URL을 설정하세요.");
  console.error("프로덕션 환경에서는 Vercel 환경 변수를 확인하세요.");
  throw new Error(
    "VITE_API_URL 환경 변수가 필요합니다. .env 파일 또는 Vercel 환경 변수를 확인하세요."
  );
};

const API_URL = getAPIURL();

const imageStyle: React.CSSProperties = {
  marginRight: "10px",
};

const KakaoLoginButton: React.FC = () => {
  const handleLogin = () => {
    // 서버의 CLIENT_BASE_URL 환경 변수를 사용하므로 쿼리 파라미터 불필요
    window.location.href = `${API_URL}/api/kakao`;
  };

  return (
    <button onClick={handleLogin}>
      <img className="w-96 h-20" src={KakaoLoginLg} alt="Kakao Login Button" />
    </button>
  );
};

export default KakaoLoginButton;
