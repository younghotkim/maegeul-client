import { useState, useEffect } from "react";
import { useAuthStore } from "./stores/use-auth-store"; // Store 사용

// 환경 변수에서 API URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getAPIURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl;
  }
  if (import.meta.env.MODE === "production") {
    return "/api";
  }
  // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5001/api`;
};

const API_URL = getAPIURL();

// 커스텀 훅: user_id에 따른 무드 컬러 데이터를 가져옴
export const useMoodColorData = () => {
  const user = useAuthStore((state) => state.user); // Store에서 user 가져오기

  const [moodColorData, setMoodColorData] = useState([
    { label: "파란색", value: 0 },
    { label: "노란색", value: 0 },
    { label: "초록색", value: 0 },
    { label: "빨간색", value: 0 },
  ]);

  useEffect(() => {
    const fetchMoodColorData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/moodmeter/colorcount/${user?.user_id}`
        );
        const data = await response.json();

        // 초기 상태를 직접 정의하여 사용 (moodColorData 의존성 제거)
        const initialMoodColorData = [
          { label: "파란색", value: 0 },
          { label: "노란색", value: 0 },
          { label: "초록색", value: 0 },
          { label: "빨간색", value: 0 },
        ];

        // API에서 반환된 데이터를 상태로 업데이트
        const updatedMoodColorData = initialMoodColorData.map((item) => {
          const match = data.find(
            (colorData: { color: string }) => colorData.color === item.label
          );
          return match ? { ...item, value: match.count } : item;
        });

        setMoodColorData(updatedMoodColorData);
      } catch (error) {
        console.error(
          "무드 컬러 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
      }
    };

    if (user?.user_id) {
      fetchMoodColorData(); // API 호출
    }
  }, [user?.user_id]); // user_id가 변경될 때마다 호출

  // 총 label 개수를 계산
  const totalLabels = moodColorData.reduce(
    (total, item) => total + item.value,
    0
  );

  // 초록색과 노란색만 더한 값을 계산
  const greenYellowTotal = moodColorData
    .filter((item) => item.label === "초록색" || item.label === "노란색")
    .reduce((total, item) => total + item.value, 0);

  return { moodColorData, totalLabels, greenYellowTotal };
};
