import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import axios from "axios";

// 환경 변수에서 API URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getAPIURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl.replace(/\/api$/, ""); // /api 제거 (이미 포함되어 있을 수 있음)
  }
  if (import.meta.env.MODE === "production") {
    // 프로덕션에서는 환경 변수가 필수
    console.error("VITE_API_URL 환경 변수가 설정되지 않았습니다.");
    throw new Error("VITE_API_URL 환경 변수가 필요합니다.");
  }
  // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5001`;
};

const API_URL = getAPIURL();

const KakaoCallback = () => {
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("location.search: ", location.search); // URL 파라미터 출력

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const userId = queryParams.get("userId");

    if (token && userId) {
      // Store에 토큰 저장
      setToken(token);

      axios
        .get(`${API_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 백엔드로 토큰을 보내어 검증
          },
        })
        .then((response) => {
          const { profile_name, profile_picture, email } = response.data.user;
          // Store에 사용자 정보 저장
          setUser({
            user_id: Number(userId),
            profile_name: profile_name || null,
            profile_picture: profile_picture || undefined,
            email: email || null,
            isKakaoUser: true, // 카카오 사용자 여부 저장
          });
          navigate("/"); // 홈으로 리다이렉트
        })
        .catch((error) => {
          console.error("사용자 정보를 가져오는데 실패했습니다:", error);
        });
    } else {
      console.log("토큰 또는 userId가 없습니다.");
    }
  }, [location, setUser, setToken, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
