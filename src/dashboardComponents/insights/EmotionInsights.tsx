import { useEffect, useState, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { alpha, useTheme } from "@mui/material/styles";
import { Lightbulb, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/ko";

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

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

interface Insight {
  icon: typeof Lightbulb;
  title: string;
  description: string;
  color: string;
  type: "pattern" | "trend" | "tip";
}

export function EmotionInsights() {
  const theme = useTheme();
  const [diaryData, setDiaryData] = useState<Diary[]>([]);
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

  // 인사이트 분석
  const insights = useMemo((): Insight[] => {
    if (diaryData.length < 3) {
      return [
        {
          icon: Sparkles,
          title: "더 많은 기록이 필요해요",
          description: "3일 이상 기록하면 나만의 감정 패턴을 분석해드릴게요!",
          color: "#667eea",
          type: "tip",
        },
      ];
    }

    const result: Insight[] = [];

    // 1. 요일별 감정 패턴 분석
    const dayStats: Record<number, Record<string, number>> = {};
    for (let i = 0; i < 7; i++) {
      dayStats[i] = { 빨간색: 0, 노란색: 0, 파란색: 0, 초록색: 0 };
    }

    diaryData.forEach((diary) => {
      const dayOfWeek = dayjs(diary.date).day();
      if (diary.color && dayStats[dayOfWeek]) {
        dayStats[dayOfWeek][diary.color]++;
      }
    });

    // 가장 긍정적인 요일 찾기 (초록색 + 노란색)
    let bestDay = 0;
    let bestScore = 0;
    for (let i = 0; i < 7; i++) {
      const positiveScore = (dayStats[i]["초록색"] || 0) + (dayStats[i]["노란색"] || 0);
      if (positiveScore > bestScore) {
        bestScore = positiveScore;
        bestDay = i;
      }
    }

    if (bestScore > 0) {
      result.push({
        icon: Calendar,
        title: `${dayNames[bestDay]}요일이 가장 좋아요`,
        description: `${dayNames[bestDay]}요일에 긍정적인 감정을 ${bestScore}번 기록했어요. 이 날의 루틴을 다른 날에도 적용해보세요!`,
        color: "#35D28A",
        type: "pattern",
      });
    }

    // 2. 가장 많이 느낀 감정
    const colorCounts: Record<string, number> = { 빨간색: 0, 노란색: 0, 파란색: 0, 초록색: 0 };
    diaryData.forEach((diary) => {
      if (diary.color) colorCounts[diary.color]++;
    });

    const topColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0];
    if (topColor && topColor[1] > 0) {
      result.push({
        icon: Lightbulb,
        title: `${colorLabels[topColor[0]]} 감정이 가장 많아요`,
        description: `최근 기록 중 ${topColor[1]}번의 ${colorLabels[topColor[0]]} 감정을 기록했어요.`,
        color: colorMap[topColor[0]],
        type: "pattern",
      });
    }

    // 3. 최근 트렌드 분석
    const recentDiaries = diaryData
      .filter((d) => dayjs(d.date).isAfter(dayjs().subtract(7, "day")))
      .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

    if (recentDiaries.length >= 3) {
      const recentPositive = recentDiaries.filter(
        (d) => d.color === "초록색" || d.color === "노란색"
      ).length;
      const positiveRatio = recentPositive / recentDiaries.length;

      if (positiveRatio >= 0.6) {
        result.push({
          icon: TrendingUp,
          title: "긍정적인 흐름이에요!",
          description: "최근 일주일간 긍정적인 감정이 많았어요. 이 좋은 흐름을 유지해보세요!",
          color: "#4facfe",
          type: "trend",
        });
      } else if (positiveRatio <= 0.3) {
        result.push({
          icon: Sparkles,
          title: "작은 행복을 찾아보세요",
          description: "최근 힘든 시간을 보내고 계시네요. 오늘 하루 작은 즐거움을 찾아보는 건 어떨까요?",
          color: "#fa709a",
          type: "tip",
        });
      }
    }

    // 4. 빠른 체크인 패턴
    const quickCheckins = diaryData.filter((d) => d.title.startsWith("빠른 체크인:"));
    if (quickCheckins.length > diaryData.length * 0.5 && diaryData.length >= 5) {
      result.push({
        icon: Sparkles,
        title: "일기도 써보세요",
        description: "빠른 체크인을 자주 사용하시네요! 가끔은 자세한 일기를 써보면 더 깊은 감정 정리가 될 거예요.",
        color: "#764ba2",
        type: "tip",
      });
    }

    return result.slice(0, 3); // 최대 3개
  }, [diaryData]);

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
      <CardContent sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #fee140 0%, #fa709a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lightbulb size={20} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              감정 인사이트
            </Typography>
            <Typography variant="caption" color="text.secondary">
              나만의 감정 패턴 분석
            </Typography>
          </Box>
        </Box>

        {/* 인사이트 목록 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(insight.color, 0.08),
                    border: `1px solid ${alpha(insight.color, 0.2)}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        backgroundColor: alpha(insight.color, 0.15),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} color={insight.color} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {insight.title}
                        </Typography>
                        <Chip
                          label={
                            insight.type === "pattern"
                              ? "패턴"
                              : insight.type === "trend"
                                ? "트렌드"
                                : "팁"
                          }
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.6rem",
                            backgroundColor: alpha(insight.color, 0.15),
                            color: insight.color,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontSize: "0.8rem", lineHeight: 1.5 }}
                      >
                        {insight.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
