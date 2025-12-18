import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  CardProps,
  Box,
} from "@mui/material";
import D3WordCloud from "../../layouts/d3/D3WordCloud"; // D3WordCloud 컴포넌트
import { useAuthStore } from "../../hooks/stores/use-auth-store"; // Store 사용
import useUserMoodData from "../../hooks/useUserMoodData"; // useUserMoodData 훅 임포트
import { ChartLegends } from "../chart/chart-legends";

// Word 타입 정의 (size와 color 포함)
type Word = {
  text: string;
  size: number;
  color: string;
};

// ChartOptions 타입 정의
export type ChartOptions = {
  labels?: string[];
  colors?: string[];
  series?: number[];
  type?: string;
};

// Chart에 기본 옵션을 추가
const chartOptions: ChartOptions = {
  labels: ["편안 지수가 높은 단어들이 더 크게 보여요"], // 원하는 라벨 추가
  colors: ["#B9A2FF"], // 색상 커스텀
};

interface AnalyticsWordCloudProps {
  title: string;
}

const AnalyticsWordCloud: React.FC<AnalyticsWordCloudProps> = ({
  title,
  ...other
}) => {
  const user = useAuthStore((state) => state.user); // Store에서 user 가져오기
  const moodData = useUserMoodData(user?.user_id || undefined); // 이미 매칭된 데이터를 가져옴

  // API에서 받은 라벨을 D3WordCloud에서 요구하는 형식으로 변환
  const words: Word[] = moodData.map((mood) => ({
    text: mood.label, // 감정 라벨
    size: mood.pleasantness * 5, // pleasantness를 기반으로 크기 설정
    color: mood.color, // 매칭된 색상
  }));

  return (
    <Card
      {...other}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // 모바일: 전체 너비, 태블릿 이상: 자동
        width: { xs: "100%", sm: "auto" },
      }}
    >
      <CardHeader
        title={title}
        sx={{
          // 모바일: 작은 폰트 크기
          "& .MuiCardHeader-title": {
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
          },
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      />
      <CardContent
        sx={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {/* 필터링된 데이터를 기반으로 워드 클라우드 렌더링 */}
        {words.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              height: { xs: "250px", sm: "300px", md: "356px" }, // 반응형 높이
              minHeight: { xs: "250px", sm: "300px", md: "356px" },
            }}
          >
            <D3WordCloud words={words} />
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              px: { xs: 2, sm: 3 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            지금 매글을 시작해서 나만의 감정 어휘 클라우드를 만들어보세요 🎈
          </Box>
        )}
      </CardContent>

      <Divider sx={{ borderStyle: "dashed" }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          justifyContent: "center",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 1.5 },
        }}
      />
    </Card>
  );
};

export default AnalyticsWordCloud;
