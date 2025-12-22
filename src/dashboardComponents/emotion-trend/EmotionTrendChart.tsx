import { useEffect, useState, useMemo } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { alpha, useTheme } from "@mui/material/styles";
import { TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import { Chart, useChart } from "../chart";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { apiClient } from "../../lib/api-client";

dayjs.locale("ko");

interface Diary {
  diary_id: number;
  date: string;
  color: string;
  title: string;
}

const colorMap: Record<string, string> = {
  빨간색: "#EE5D50",
  노란색: "#FFDE57",
  파란색: "#6AD2FF",
  초록색: "#35D28A",
};

const colorLabels: Record<string, string> = {
  빨간색: "불쾌",
  노란색: "활력",
  파란색: "평온",
  초록색: "행복",
};

// 감정을 숫자로 변환 (차트용)
const colorToScore: Record<string, number> = {
  초록색: 4, // 행복
  노란색: 3, // 활력
  파란색: 2, // 평온
  빨간색: 1, // 불쾌
};

export function EmotionTrendChart() {
  const theme = useTheme();
  const [diaryData, setDiaryData] = useState<Diary[]>([]);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_id) return;
      try {
        const response = await apiClient.get(`/diary/${user.user_id}`);
        if (Array.isArray(response.data)) {
          setDiaryData(response.data);
        }
      } catch (error) {
        console.error("다이어리 데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, [user?.user_id]);

  const chartData = useMemo(() => {
    const now = dayjs();
    const days = period === "week" ? 7 : 30;
    const labels: string[] = [];
    const scores: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = now.subtract(i, "day");
      const dateKey = date.format("YYYY-MM-DD");
      labels.push(period === "week" ? date.format("ddd") : date.format("M/D"));

      const dayDiaries = diaryData.filter(
        (d) => dayjs(d.date).format("YYYY-MM-DD") === dateKey
      );

      if (dayDiaries.length > 0) {
        const avgScore =
          dayDiaries.reduce((sum, d) => sum + (colorToScore[d.color] || 2), 0) /
          dayDiaries.length;
        scores.push(Math.round(avgScore * 10) / 10);
      } else {
        scores.push(0);
      }
    }

    return { labels, scores };
  }, [diaryData, period]);

  const chartOptions = useChart({
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#667eea"],
    stroke: {
      width: 3,
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: chartData.labels,
      labels: {
        style: { fontSize: "11px" },
      },
    },
    yaxis: {
      min: 0,
      max: 4,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => {
          const labels = ["", "불쾌", "평온", "활력", "행복"];
          return labels[Math.round(val)] || "";
        },
        style: { fontSize: "11px" },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          if (val === 0) return "기록 없음";
          const labels = ["", "불쾌", "평온", "활력", "행복"];
          return labels[Math.round(val)] || `${val}`;
        },
      },
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      borderColor: alpha(theme.palette.grey[500], 0.1),
      strokeDashArray: 3,
    },
  });

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 380,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(theme.palette.grey[500], 0.16)}`,
        },
      }}
    >
      <CardHeader
        avatar={
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={20} color="white" />
          </Box>
        }
        title="감정 트렌드"
        subheader="시간에 따른 감정 변화"
        titleTypographyProps={{
          sx: { fontWeight: 700, fontSize: "1.1rem" },
        }}
        action={
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, val) => val && setPeriod(val)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                px: 2,
                py: 0.5,
                fontSize: "0.75rem",
                "&.Mui-selected": {
                  backgroundColor: alpha("#667eea", 0.1),
                  color: "#667eea",
                },
              },
            }}
          >
            <ToggleButton value="week">주간</ToggleButton>
            <ToggleButton value="month">월간</ToggleButton>
          </ToggleButtonGroup>
        }
        sx={{ pb: 0 }}
      />

      <Box sx={{ p: 2, pt: 1 }}>
        <Chart
          type="area"
          series={[{ name: "감정 점수", data: chartData.scores }]}
          options={chartOptions}
          height={250}
        />
      </Box>

      {/* 범례 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          pb: 2,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(colorMap).map(([name, color]) => (
          <Box key={name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
            <Box component="span" sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
              {colorLabels[name]}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
