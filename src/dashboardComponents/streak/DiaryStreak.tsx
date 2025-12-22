import { useEffect, useState, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { alpha, useTheme } from "@mui/material/styles";
import { Flame, Trophy, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { apiClient } from "../../lib/api-client";

interface Diary {
  diary_id: number;
  date: string;
}

// 마일스톤 정의
const milestones = [
  { days: 3, icon: Zap, label: "시작", color: "#4facfe" },
  { days: 7, icon: Flame, label: "1주일", color: "#f5576c" },
  { days: 14, icon: Target, label: "2주일", color: "#fa709a" },
  { days: 30, icon: Trophy, label: "1개월", color: "#fee140" },
];

export function DiaryStreak() {
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

  // 연속 기록 일수 계산
  const streakData = useMemo(() => {
    if (diaryData.length === 0) return { current: 0, longest: 0, total: 0 };

    // 날짜별로 그룹화
    const dateSet = new Set(
      diaryData.map((d) => dayjs(d.date).format("YYYY-MM-DD"))
    );
    const sortedDates = Array.from(dateSet).sort();

    // 현재 연속 기록 계산 (오늘부터 역순으로)
    let currentStreak = 0;
    let checkDate = dayjs();

    // 오늘 기록이 있는지 확인
    if (dateSet.has(checkDate.format("YYYY-MM-DD"))) {
      currentStreak = 1;
      checkDate = checkDate.subtract(1, "day");

      while (dateSet.has(checkDate.format("YYYY-MM-DD"))) {
        currentStreak++;
        checkDate = checkDate.subtract(1, "day");
      }
    } else {
      // 어제부터 확인
      checkDate = checkDate.subtract(1, "day");
      if (dateSet.has(checkDate.format("YYYY-MM-DD"))) {
        currentStreak = 1;
        checkDate = checkDate.subtract(1, "day");

        while (dateSet.has(checkDate.format("YYYY-MM-DD"))) {
          currentStreak++;
          checkDate = checkDate.subtract(1, "day");
        }
      }
    }

    // 최장 연속 기록 계산
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = dayjs(sortedDates[i - 1]);
      const curr = dayjs(sortedDates[i]);

      if (curr.diff(prev, "day") === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      current: currentStreak,
      longest: longestStreak,
      total: dateSet.size,
    };
  }, [diaryData]);

  // 다음 마일스톤 계산
  const nextMilestone = useMemo(() => {
    for (const m of milestones) {
      if (streakData.current < m.days) {
        return m;
      }
    }
    return milestones[milestones.length - 1];
  }, [streakData.current]);

  const progress =
    nextMilestone.days > 0
      ? Math.min((streakData.current / nextMilestone.days) * 100, 100)
      : 100;

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.12)}`,
        background: `linear-gradient(135deg, ${alpha("#667eea", 0.05)} 0%, ${alpha("#764ba2", 0.05)} 100%)`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(theme.palette.grey[500], 0.16)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f5576c 0%, #fa709a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px ${alpha("#f5576c", 0.4)}`,
              }}
            >
              <Flame size={24} color="white" />
            </Box>
          </motion.div>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              기록 스트릭
            </Typography>
            <Typography variant="caption" color="text.secondary">
              꾸준함이 힘이에요
            </Typography>
          </Box>
        </Box>

        {/* 현재 스트릭 */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {streakData.current}
            </Typography>
          </motion.div>
          <Typography variant="body2" color="text.secondary">
            연속 기록 일수
          </Typography>
        </Box>

        {/* 진행 바 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              다음 목표: {nextMilestone.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {streakData.current}/{nextMilestone.days}일
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(nextMilestone.color, 0.2),
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: `linear-gradient(90deg, #667eea 0%, ${nextMilestone.color} 100%)`,
              },
            }}
          />
        </Box>

        {/* 마일스톤 뱃지 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          {milestones.map((m) => {
            const Icon = m.icon;
            const achieved = streakData.current >= m.days;
            return (
              <Box
                key={m.days}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: achieved ? m.color : alpha(theme.palette.grey[500], 0.1),
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon size={18} color={achieved ? "white" : theme.palette.grey[400]} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    color: achieved ? "text.primary" : "text.disabled",
                    fontWeight: achieved ? 600 : 400,
                  }}
                >
                  {m.days}일
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* 통계 */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#667eea" }}>
              {streakData.longest}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              최장 연속
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#764ba2" }}>
              {streakData.total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              총 기록일
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
