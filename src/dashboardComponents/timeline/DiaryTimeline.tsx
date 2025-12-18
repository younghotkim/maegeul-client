import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useAuthStore } from "../../hooks/stores/use-auth-store"; // Store 사용
import { AnalyticsOrderTimeline } from "../../sections/overview/analytics-order-timeline"; // 타임라인 컴포넌트 임포트

// Diary 타입 정의
interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  formatted_date: string;
  color: string;
}

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

export function DiaryTimeline() {
  const [diaryData, setDiaryData] = useState<Diary[]>([]); // Diary 데이터를 저장하는 상태
  const user = useAuthStore((state) => state.user); // Store에서 사용자 정보 가져오기

  // Diary 데이터를 API에서 가져오는 함수
  const fetchDiaryData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/diary/${user?.user_id}`);
      const data = await response.json();

      // 응답이 배열인지 확인 후 처리
      if (Array.isArray(data)) {
        setDiaryData(data);
      } else {
        console.error("다이어리 데이터가 배열이 아닙니다:", data);
        setDiaryData([]); // 배열이 아닐 경우 빈 배열로 처리
      }
    } catch (error) {
      console.error(
        "다이어리 데이터를 가져오는 중 오류가 발생했습니다:",
        error
      );
      setDiaryData([]); // 오류 발생 시에도 빈 배열로 설정
    }
  };

  // 컴포넌트가 처음 렌더링될 때 다이어리 데이터를 가져옴
  useEffect(() => {
    if (user?.user_id) {
      fetchDiaryData();
    }
  }, [user?.user_id]);

  // 색상 변환 맵 정의
  const colorMap: { [key: string]: string } = {
    빨간색: "#EE5D50",
    노란색: "#FFDE57",
    파란색: "#6AD2FF",
    초록색: "#35D28A",
  };

  // 데이터를 AnalyticsOrderTimeline에서 사용할 수 있는 리스트 형식으로 변환
  const _timeline = diaryData.map((diary) => {
    // 변환되지 않은 색상 값 로그 출력
    console.log(`Diary ID: ${diary.diary_id}, Color: ${diary.color}`);

    return {
      id: diary.diary_id.toString(),
      type: colorMap[diary.color] || "#000000", // colorMap에서 diary.color를 찾아 변환, 없으면 기본 색상(#000000)
      title: diary.title,
      time: diary.formatted_date, // 시간을 시간 형식으로 표시
    };
  });

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1, sm: 2 },
      }}
    >
      <AnalyticsOrderTimeline
        title="무드 컬러 타임라인"
        list={_timeline} // 변환한 _timeline 데이터 전달
      />
    </Box>
  );
}
