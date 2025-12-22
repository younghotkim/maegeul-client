import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { alpha, useTheme } from "@mui/material/styles";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { apiClient } from "../../lib/api-client";

dayjs.locale("ko");

// Diary 타입 정의 (DiaryTimeline과 동일)
interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  date: string;
  formatted_date: string;
  color: string;
}

// 색상 변환 맵 (DiaryTimeline과 동일)
const colorMap: { [key: string]: string } = {
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

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function MoodCalendar() {
  const theme = useTheme();
  const [diaryData, setDiaryData] = useState<Diary[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [direction, setDirection] = useState(0);
  const user = useAuthStore((state) => state.user);

  // DiaryTimeline과 동일한 방식으로 데이터 fetch
  useEffect(() => {
    const fetchDiaryData = async () => {
      if (!user?.user_id) return;
      try {
        const response = await apiClient.get(`/diary/${user.user_id}`);
        const data = response.data;
        if (Array.isArray(data)) {
          console.log("📅 캘린더 다이어리 데이터:", data);
          setDiaryData(data);
        } else {
          console.error("다이어리 데이터가 배열이 아닙니다:", data);
          setDiaryData([]);
        }
      } catch (error) {
        console.error("다이어리 데이터를 가져오는 중 오류:", error);
        setDiaryData([]);
      }
    };
    fetchDiaryData();
  }, [user?.user_id]);

  // 날짜별 다이어리 맵 생성
  const diaryByDate = useMemo(() => {
    const map = new Map<string, Diary[]>();
    diaryData.forEach((diary) => {
      // date 필드에서 날짜 추출 (ISO 형식 또는 다양한 형식 지원)
      const dateKey = dayjs(diary.date).format("YYYY-MM-DD");
      console.log(`📆 diary_id: ${diary.diary_id}, date: ${diary.date}, dateKey: ${dateKey}, color: ${diary.color}`);
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, diary]);
    });
    console.log("📅 날짜별 다이어리 맵:", Object.fromEntries(map));
    return map;
  }, [diaryData]);

  // 현재 월의 날짜 정보 계산
  const calendarDays = useMemo(() => {
    const year = currentDate.year();
    const month = currentDate.month();
    const startOfMonth = dayjs(new Date(year, month, 1));
    const startDayOfWeek = startOfMonth.day();
    const daysInMonth = startOfMonth.daysInMonth();

    const days: (dayjs.Dayjs | null)[] = [];
    // 이전 달의 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(dayjs(new Date(year, month, i)));
    }
    return days;
  }, [currentDate]);

  // 특정 날짜의 다이어리 찾기
  const getDiariesForDay = (date: dayjs.Dayjs): Diary[] => {
    const dateKey = date.format("YYYY-MM-DD");
    return diaryByDate.get(dateKey) || [];
  };

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate((prev) => prev.add(1, "month"));
  };

  const isToday = (date: dayjs.Dayjs) => date.isSame(dayjs(), "day");

  // 이번 달 기록 통계
  const monthStats = useMemo(() => {
    let count = 0;
    calendarDays.forEach((day) => {
      if (day && getDiariesForDay(day).length > 0) count++;
    });
    return count;
  }, [calendarDays, diaryByDate]);

  return (
    <Card
      sx={{
        height: { xs: "auto", md: "400px" },
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
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
            <Calendar size={20} color="white" />
          </Box>
        }
        title="무드 캘린더"
        subheader={`이번 달 ${monthStats}일 기록`}
        titleTypographyProps={{
          sx: { fontWeight: 700, fontSize: { xs: "1rem", sm: "1.1rem" } },
        }}
        subheaderTypographyProps={{
          sx: { fontSize: "0.8rem", color: "text.secondary" },
        }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              onClick={handlePrevMonth}
              size="small"
              sx={{
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ChevronLeft size={18} />
            </IconButton>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                minWidth: 80,
                textAlign: "center",
                fontSize: "0.875rem",
              }}
            >
              {currentDate.format("YYYY.MM")}
            </Typography>
            <IconButton
              onClick={handleNextMonth}
              size="small"
              sx={{
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ChevronRight size={18} />
            </IconButton>
          </Box>
        }
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      />

      <Box
        sx={{
          px: 2,
          py: 1.5,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 요일 헤더 */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
            mb: 1,
          }}
        >
          {WEEKDAYS.map((day, index) => (
            <Typography
              key={day}
              variant="caption"
              sx={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: "0.7rem",
                color:
                  index === 0
                    ? alpha(theme.palette.error.main, 0.8)
                    : index === 6
                      ? alpha(theme.palette.primary.main, 0.8)
                      : "text.secondary",
                py: 0.5,
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* 날짜 그리드 */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentDate.format("YYYY-MM")}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.2 }}
            style={{ flexGrow: 1 }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
              }}
            >
              {calendarDays.map((day, index) => {
                const diaries = day ? getDiariesForDay(day) : [];
                const hasDiary = diaries.length > 0;
                const latestDiary = hasDiary ? diaries[0] : null;
                // DiaryTimeline과 동일한 방식으로 색상 변환
                const moodColor = latestDiary
                  ? colorMap[latestDiary.color] || "#667eea"
                  : null;
                const dayOfWeek = index % 7;
                const isQuickCheckin =
                  latestDiary?.title.startsWith("빠른 체크인:");

                return (
                  <Box
                    key={index}
                    sx={{
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {day && (
                      <Tooltip
                        title={
                          hasDiary ? (
                            <Box sx={{ p: 0.5 }}>
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 600, display: "block" }}
                              >
                                {isQuickCheckin
                                  ? `⚡ ${latestDiary?.title.replace("빠른 체크인: ", "")}`
                                  : latestDiary?.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "grey.400",
                                  display: "block",
                                  mt: 0.5,
                                }}
                              >
                                {latestDiary?.formatted_date} ·{" "}
                                {colorLabels[latestDiary?.color || ""] ||
                                  latestDiary?.color}
                              </Typography>
                              {diaries.length > 1 && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "grey.500",
                                    display: "block",
                                    mt: 0.5,
                                  }}
                                >
                                  +{diaries.length - 1}개 더
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            ""
                          )
                        }
                        arrow
                        placement="top"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 200 }}
                      >
                        <motion.div
                          whileHover={hasDiary ? { scale: 1.15 } : {}}
                          whileTap={hasDiary ? { scale: 0.95 } : {}}
                        >
                          <Box
                            sx={{
                              width: { xs: 26, sm: 30, md: 32 },
                              height: { xs: 26, sm: 30, md: 32 },
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: hasDiary ? "pointer" : "default",
                              position: "relative",
                              backgroundColor: hasDiary
                                ? moodColor
                                : isToday(day)
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : "transparent",
                              border: isToday(day)
                                ? `2px solid ${theme.palette.primary.main}`
                                : "none",
                              boxShadow: hasDiary
                                ? `0 2px 8px ${alpha(moodColor || "#667eea", 0.5)}`
                                : "none",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: isToday(day) || hasDiary ? 700 : 400,
                                fontSize: {
                                  xs: "0.65rem",
                                  sm: "0.7rem",
                                  md: "0.75rem",
                                },
                                color: hasDiary
                                  ? "#fff"
                                  : dayOfWeek === 0
                                    ? "error.main"
                                    : dayOfWeek === 6
                                      ? "primary.main"
                                      : "text.primary",
                                textShadow: hasDiary
                                  ? "0 1px 2px rgba(0,0,0,0.2)"
                                  : "none",
                              }}
                            >
                              {day.date()}
                            </Typography>
                            {/* 빠른 체크인 표시 */}
                            {isQuickCheckin && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: -4,
                                  right: -4,
                                  fontSize: "0.6rem",
                                }}
                              >
                                ⚡
                              </Box>
                            )}
                            {/* 다중 기록 표시 */}
                            {diaries.length > 1 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: -2,
                                  right: -2,
                                  width: 14,
                                  height: 14,
                                  borderRadius: "50%",
                                  backgroundColor: theme.palette.error.main,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: `1.5px solid ${theme.palette.background.paper}`,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.55rem",
                                    fontWeight: 700,
                                    color: "#fff",
                                  }}
                                >
                                  {diaries.length}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </motion.div>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* 범례 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            mt: "auto",
            pt: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          {Object.entries(colorMap).map(([name, color]) => (
            <Box
              key={name}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 2px 4px ${alpha(color, 0.4)}`,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                }}
              >
                {colorLabels[name]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
