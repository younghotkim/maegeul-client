import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";

import { _posts } from "../../../_mock";
import { DashboardContent } from "../../../layouts/dashboard";

import { AnalyticsNews } from "../analytics-news";
import { AnalyticsCurrentVisits } from "../analytics-current-visits";
import { AnalyticsWidgetSummary } from "../analytics-widget-summary";
import { useAuthStore } from "../../../hooks/stores/use-auth-store";
import AnalyticsWordCloud from "../../../dashboardComponents/wordcloud/AnalyticsWordCloud";

import { useState } from "react";
import { useMoodColorData } from "../../../hooks/useMoodColorData";
import { useDiaryCount, useEmotionCount } from "../../../hooks/queries";
import { DiaryTimeline } from "../../../dashboardComponents/timeline/DiaryTimeline";
import { MoodCalendar } from "../../../dashboardComponents/calendar/MoodCalendar";
import { EmotionTrendChart } from "../../../dashboardComponents/emotion-trend/EmotionTrendChart";
import { DiaryStreak } from "../../../dashboardComponents/streak/DiaryStreak";
import { EmotionInsights } from "../../../dashboardComponents/insights/EmotionInsights";
import { MoodRecommendations } from "../../../dashboardComponents/recommendations/MoodRecommendations";

// Chat components
import { ChatWidget } from "../../../components/chat/ChatWidget";
import { ChatPanel } from "../../../components/chat/ChatPanel";

// Lucide 아이콘
import { Palette, Smile, BookOpen, Sparkles } from "lucide-react";

// 애니메이션 variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const user = useAuthStore((state) => state.user);
  const { data: diaryCount = 0 } = useDiaryCount(user?.user_id);
  const { data: emotionCount = 0 } = useEmotionCount(user?.user_id);

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const { moodColorData, totalLabels, greenYellowTotal } = useMoodColorData();

  const handleChatToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  return (
    <DashboardContent maxWidth="xl">
      {/* 헤더 애니메이션 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}
        >
          {user?.profile_name}님, 안녕하세요 !
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: { xs: 3, md: 5 }, color: "text.secondary", mt: -3 }}
        >
          매글과 함께 그린 마음 지도를 보여드릴게요.
        </Typography>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {/* 통계 카드들 */}
          <Grid xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <AnalyticsWidgetSummary
                title="무드 컬러 진단"
                total={totalLabels}
                color="primary"
                icon={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <Palette size={24} color="white" />
                  </Box>
                }
                chart={{}}
              />
            </motion.div>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <AnalyticsWidgetSummary
                title="긍정 감정 기록"
                total={greenYellowTotal}
                color="warning"
                icon={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 16px rgba(245, 87, 108, 0.3)",
                    }}
                  >
                    <Smile size={24} color="white" />
                  </Box>
                }
                chart={{}}
              />
            </motion.div>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <AnalyticsWidgetSummary
                title="무드 일기"
                total={diaryCount}
                color="secondary"
                icon={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 16px rgba(79, 172, 254, 0.3)",
                    }}
                  >
                    <BookOpen size={24} color="white" />
                  </Box>
                }
                chart={{}}
              />
            </motion.div>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <AnalyticsWidgetSummary
                title="AI 하루진단"
                total={emotionCount}
                color="error"
                icon={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 16px rgba(250, 112, 154, 0.3)",
                    }}
                  >
                    <Sparkles size={24} color="white" />
                  </Box>
                }
                chart={{}}
              />
            </motion.div>
          </Grid>

          {/* 차트 섹션 */}
          <Grid xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <AnalyticsCurrentVisits
                title="무드 컬러"
                chart={{
                  series: moodColorData,
                  colors: ["#6AD2FF", "#FFDE57", "#35D28A", "#EE5D50"],
                }}
                sx={{ height: "100%", minHeight: 400 }}
              />
            </motion.div>
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <Box sx={{ height: "100%", minHeight: 400 }}>
                <AnalyticsWordCloud title="감정 어휘 클라우드" />
              </Box>
            </motion.div>
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <Box sx={{ height: "100%", minHeight: 400 }}>
                <DiaryTimeline />
              </Box>
            </motion.div>
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <Box sx={{ height: "100%", minHeight: 400 }}>
                <MoodCalendar />
              </Box>
            </motion.div>
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <Box sx={{ height: "100%", minHeight: 400 }}>
                <DiaryStreak />
              </Box>
            </motion.div>
          </Grid>

          {/* 감정 트렌드 & 인사이트 */}
          <Grid xs={12} md={8}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <Box sx={{ height: "100%", minHeight: 380 }}>
                <EmotionTrendChart />
              </Box>
            </motion.div>
          </Grid>

          <Grid xs={12} md={4}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <Box sx={{ height: "100%", minHeight: 380 }}>
                <EmotionInsights />
              </Box>
            </motion.div>
          </Grid>

          {/* 맞춤 추천 */}
          <Grid xs={12} md={6}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <Box sx={{ height: "100%", minHeight: 320 }}>
                <MoodRecommendations />
              </Box>
            </motion.div>
          </Grid>

          <Grid xs={12} md={6}>
            <motion.div variants={itemVariants} style={{ height: "100%" }}>
              <AnalyticsNews title="추천 컨텐츠" list={_posts.slice(0, 3)} sx={{ height: "100%", minHeight: 320 }} />
            </motion.div>
          </Grid>

        </Grid>
      </motion.div>

      {/* Mudita Bot Chat Widget - Floating button (bottom-right) */}
      <ChatWidget 
        onOpen={handleChatToggle} 
        isOpen={isChatOpen}
      />

      {/* Mudita Bot Chat Panel - Slide-out panel */}
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={handleChatClose} 
      />
    </DashboardContent>
  );
}
