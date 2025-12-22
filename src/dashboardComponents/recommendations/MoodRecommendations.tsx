import { useEffect, useState, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Sparkles,
  RefreshCw,
  Music,
  BookOpen,
  Dumbbell,
  Coffee,
  Heart,
  Palette,
  TreePine,
  Users,
  Pencil,
  Moon,
  Sun,
  Smile,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { apiClient } from "../../lib/api-client";

interface Diary {
  diary_id: number;
  date: string;
  color: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: typeof Music;
  category: "activity" | "content" | "mindfulness" | "social";
  duration?: string;
}

// 무드 컬러별 추천 데이터베이스
const recommendationsByMood: Record<string, Recommendation[]> = {
  빨간색: [
    // 불쾌 - 스트레스 해소, 진정
    {
      id: "red-1",
      title: "5분 호흡 명상",
      description: "깊은 호흡으로 마음을 진정시켜보세요",
      icon: Wind,
      category: "mindfulness",
      duration: "5분",
    },
    {
      id: "red-2",
      title: "가벼운 산책",
      description: "바깥 공기를 마시며 기분 전환해보세요",
      icon: TreePine,
      category: "activity",
      duration: "15분",
    },
    {
      id: "red-3",
      title: "감정 일기 쓰기",
      description: "지금 느끼는 감정을 글로 표현해보세요",
      icon: Pencil,
      category: "mindfulness",
      duration: "10분",
    },
    {
      id: "red-4",
      title: "좋아하는 음악 듣기",
      description: "마음이 편해지는 음악으로 휴식하세요",
      icon: Music,
      category: "content",
      duration: "20분",
    },
    {
      id: "red-5",
      title: "따뜻한 차 한 잔",
      description: "허브티나 따뜻한 음료로 몸과 마음을 달래세요",
      icon: Coffee,
      category: "activity",
      duration: "10분",
    },
  ],
  노란색: [
    // 활력 - 에너지 활용, 창작
    {
      id: "yellow-1",
      title: "새로운 취미 도전",
      description: "평소 해보고 싶었던 것을 시작해보세요",
      icon: Palette,
      category: "activity",
      duration: "30분",
    },
    {
      id: "yellow-2",
      title: "운동하기",
      description: "넘치는 에너지를 운동으로 발산해보세요",
      icon: Dumbbell,
      category: "activity",
      duration: "30분",
    },
    {
      id: "yellow-3",
      title: "친구에게 연락하기",
      description: "좋은 기분을 소중한 사람과 나눠보세요",
      icon: Users,
      category: "social",
      duration: "15분",
    },
    {
      id: "yellow-4",
      title: "창작 활동",
      description: "그림, 글쓰기, 음악 등 창작을 즐겨보세요",
      icon: Pencil,
      category: "content",
      duration: "30분",
    },
    {
      id: "yellow-5",
      title: "목표 계획 세우기",
      description: "이 에너지로 새로운 목표를 설정해보세요",
      icon: Sun,
      category: "mindfulness",
      duration: "15분",
    },
  ],
  파란색: [
    // 평온 - 휴식, 성찰
    {
      id: "blue-1",
      title: "독서 시간",
      description: "좋아하는 책을 읽으며 여유를 즐기세요",
      icon: BookOpen,
      category: "content",
      duration: "30분",
    },
    {
      id: "blue-2",
      title: "명상하기",
      description: "고요한 시간 속에서 내면을 들여다보세요",
      icon: Moon,
      category: "mindfulness",
      duration: "15분",
    },
    {
      id: "blue-3",
      title: "자연 감상",
      description: "창밖을 바라보거나 자연 속을 걸어보세요",
      icon: TreePine,
      category: "activity",
      duration: "20분",
    },
    {
      id: "blue-4",
      title: "잔잔한 음악 감상",
      description: "클래식이나 재즈로 평온함을 유지하세요",
      icon: Music,
      category: "content",
      duration: "20분",
    },
    {
      id: "blue-5",
      title: "감사 일기",
      description: "오늘 감사한 것 3가지를 적어보세요",
      icon: Heart,
      category: "mindfulness",
      duration: "10분",
    },
  ],
  초록색: [
    // 행복 - 공유, 확장
    {
      id: "green-1",
      title: "감사 표현하기",
      description: "소중한 사람에게 고마움을 전해보세요",
      icon: Heart,
      category: "social",
      duration: "10분",
    },
    {
      id: "green-2",
      title: "행복한 순간 기록",
      description: "지금 이 기분을 일기로 남겨보세요",
      icon: Pencil,
      category: "mindfulness",
      duration: "10분",
    },
    {
      id: "green-3",
      title: "좋아하는 활동",
      description: "가장 즐거운 취미 활동을 해보세요",
      icon: Smile,
      category: "activity",
      duration: "30분",
    },
    {
      id: "green-4",
      title: "사람들과 시간 보내기",
      description: "행복을 함께 나누면 두 배가 돼요",
      icon: Users,
      category: "social",
      duration: "60분",
    },
    {
      id: "green-5",
      title: "새로운 경험",
      description: "이 좋은 기분으로 새로운 것을 시도해보세요",
      icon: Sparkles,
      category: "activity",
      duration: "30분",
    },
  ],
};

// 기본 추천 (기록이 없을 때)
const defaultRecommendations: Recommendation[] = [
  {
    id: "default-1",
    title: "오늘의 기분 기록하기",
    description: "매글과 함께 오늘 하루를 기록해보세요",
    icon: Pencil,
    category: "mindfulness",
    duration: "5분",
  },
  {
    id: "default-2",
    title: "5분 명상",
    description: "잠시 멈추고 나를 돌아보는 시간을 가져보세요",
    icon: Wind,
    category: "mindfulness",
    duration: "5분",
  },
  {
    id: "default-3",
    title: "감사한 것 떠올리기",
    description: "오늘 감사한 것 하나를 생각해보세요",
    icon: Heart,
    category: "mindfulness",
    duration: "3분",
  },
];

const categoryColors: Record<string, string> = {
  activity: "#4facfe",
  content: "#fa709a",
  mindfulness: "#667eea",
  social: "#35D28A",
};

const categoryLabels: Record<string, string> = {
  activity: "활동",
  content: "콘텐츠",
  mindfulness: "마음챙김",
  social: "소통",
};

export function MoodRecommendations() {
  const theme = useTheme();
  const [diaryData, setDiaryData] = useState<Diary[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
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

  // 최근 무드 컬러 분석 및 추천 생성
  const { recommendations, dominantMood, moodLabel } = useMemo(() => {
    // 최근 7일 데이터
    const recentDiaries = diaryData.filter((d) =>
      dayjs(d.date).isAfter(dayjs().subtract(7, "day"))
    );

    if (recentDiaries.length === 0) {
      return {
        recommendations: defaultRecommendations,
        dominantMood: null,
        moodLabel: "기록을 시작해보세요",
      };
    }

    // 가장 많은 무드 컬러 찾기
    const colorCounts: Record<string, number> = {};
    recentDiaries.forEach((d) => {
      if (d.color) {
        colorCounts[d.color] = (colorCounts[d.color] || 0) + 1;
      }
    });

    const dominant = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0];
    const dominantColor = dominant?.[0] || "파란색";

    // 해당 무드의 추천 중 랜덤 3개 선택
    const moodRecs = recommendationsByMood[dominantColor] || defaultRecommendations;
    const shuffled = [...moodRecs].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    const labels: Record<string, string> = {
      빨간색: "마음이 힘들 때",
      노란색: "에너지가 넘칠 때",
      파란색: "평온한 하루",
      초록색: "행복한 순간",
    };

    return {
      recommendations: selected,
      dominantMood: dominantColor,
      moodLabel: labels[dominantColor] || "오늘의 추천",
    };
  }, [diaryData, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const moodColors: Record<string, string> = {
    빨간색: "#EE5D50",
    노란색: "#FFDE57",
    파란색: "#6AD2FF",
    초록색: "#35D28A",
  };

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 320,
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: dominantMood
                  ? `linear-gradient(135deg, ${moodColors[dominantMood]} 0%, ${alpha(moodColors[dominantMood], 0.6)} 100%)`
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={20} color="white" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                맞춤 추천
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {moodLabel}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleRefresh}
            size="small"
            sx={{
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <RefreshCw size={18} />
          </IconButton>
        </Box>

        {/* 추천 목록 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={refreshKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                const catColor = categoryColors[rec.category];

                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(catColor, 0.06),
                        border: `1px solid ${alpha(catColor, 0.15)}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: alpha(catColor, 0.12),
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            backgroundColor: alpha(catColor, 0.15),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={18} color={catColor} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                            >
                              {rec.title}
                            </Typography>
                            <Chip
                              label={categoryLabels[rec.category]}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: "0.6rem",
                                backgroundColor: alpha(catColor, 0.15),
                                color: catColor,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.8rem",
                              lineHeight: 1.4,
                            }}
                          >
                            {rec.description}
                          </Typography>
                          {rec.duration && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.disabled",
                                fontSize: "0.7rem",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              ⏱ {rec.duration}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
