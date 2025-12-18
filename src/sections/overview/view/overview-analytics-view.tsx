import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { _tasks, _posts, _timeline } from "../../../_mock";
import { DashboardContent } from "../../../layouts/dashboard";
import Graph from "../../../Icon/graph.png";
import Pen from "../../../Icon/pen.png";
import Glass from "../../../Icon/glass.png";
import Post from "../../../Icon/post.png";
import Pigeon from "../../../Icon/pigeon.png";
import Palette from "../../../Icon/palette.png";

import { AnalyticsNews } from "../analytics-news";
import { AnalyticsTasks } from "../analytics-tasks";
import { AnalyticsCurrentVisits } from "../analytics-current-visits";
import { AnalyticsOrderTimeline } from "../analytics-order-timeline";
import { AnalyticsWebsiteVisits } from "../analytics-website-visits";
import { AnalyticsWidgetSummary } from "../analytics-widget-summary";
import { AnalyticsTrafficBySite } from "../analytics-traffic-by-site";
import { AnalyticsCurrentSubject } from "../analytics-current-subject";
import { AnalyticsConversionRates } from "../analytics-conversion-rates";
import { useAuthStore } from "../../../hooks/stores/use-auth-store"; // Store 사용
import AnalyticsWordCloud from "../../../dashboardComponents/wordcloud/AnalyticsWordCloud";
import { moodData, Mood } from "../../../api/moodData";

import D3WordCloud from "../../../layouts/d3/D3WordCloud";
import { useEffect, useState } from "react";
import { useMoodColorData } from "../../../hooks/useMoodColorData";
import { useDiaryCount } from "../../../hooks/queries/use-diary-queries"; // React Query 사용
import { countEmotionAnalysisByUserId } from ".././../../api/emotionApi";
import { DiaryTimeline } from "../../../dashboardComponents/timeline/DiaryTimeline"; // DiaryTimeline 컴포넌트 임포트

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  // Store에서 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  // React Query로 일기 개수 가져오기
  const { data: diaryCount = 0 } = useDiaryCount(user?.user_id);

  const [emotionCount, setEmotionCount] = useState<number>(0);
  const [emotionData, setEmotionData] = useState<any[]>([]);

  // 감정 분석 횟수를 가져오는 함수
  useEffect(() => {
    const fetchEmotionAnalysisCount = async (user_id: number) => {
      try {
        const count = await countEmotionAnalysisByUserId(user_id); // API 호출
        setEmotionCount(count); // 감정 분석 횟수 저장
      } catch (error) {
        console.error("감정 분석 횟수를 불러오는 중 오류 발생:", error);
      }
    };

    if (user?.user_id) {
      // EmotionAnalysis 관련 정보 불러오기
      fetchEmotionAnalysisCount(user.user_id); // 감정 분석 횟수 가져오기
    }
  }, [user?.user_id]); // user_id만 의존성 배열에 포함

  type Word = {
    text: string;
    size: number;
    color: string;
  };

  //moodColorData Hook
  const { moodColorData, totalLabels, greenYellowTotal } = useMoodColorData();
  const words: Word[] = moodData.map((mood) => ({
    text: mood.label,
    size: mood.pleasantness * 5, // 크기는 예시로 조정 (필요에 따라 변경 가능)
    color: mood.color,
  }));

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {user?.profile_name}님, 안녕하세요 👋
        <br />
        매글과 함께 그린 마음 지도를 보여드릴게요.
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="무드 컬러 진단 횟수"
            // percent={0}
            total={totalLabels} // totalLabels 값을 total에 적용
            icon={
              // <img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />
              <img src={Palette} />
            }
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="긍정 감정 기록수"
            // percent={2.8}
            total={greenYellowTotal}
            color="warning"
            icon={<img src={Pen} />}
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="무드 일기 수"
            // percent={0.5} // 필요에 따라 작성 수 증감 비율을 계산하여 넣을 수 있음
            total={diaryCount} // diaryCount 값 적용
            color="secondary"
            icon={<img src={Post} />}
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [0, 0, 0, 0, 12, 23, 32, 23],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="AI 진단 횟수"
            // percent={3.6}
            total={emotionCount}
            color="error"
            icon={<img src={Glass} />}
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="무드 컬러"
            chart={{
              series: moodColorData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWordCloud title="감정 어휘 클라우드" />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <DiaryTimeline />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="무드 컬러 타임라인" list={_timeline} />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="추천 컨텐츠" list={_posts.slice(0, 3)} />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="추천 영역"
            chart={{
              categories: ["자기개발", "헬스", "문화", "취미", "언어", "운동"],
              series: [
                { name: "파란색", data: [80, 50, 30, 40, 100, 20] },
                { name: "빨간색", data: [20, 30, 40, 80, 20, 80] },
                { name: "초록색", data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="매글 이용자 정보"
            list={[
              { value: "facebook", label: "Facebook", total: 323234 },
              { value: "google", label: "Google", total: 341212 },
              { value: "linkedin", label: "Linkedin", total: 411213 },
              { value: "twitter", label: "Twitter", total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="무드 컬러 타임라인" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="주간 편안 지수, 에너지 지수"
            subheader="(+43%) than last year"
            chart={{
              categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
              series: [
                { name: "Team A", data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: "Team B", data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ["Italy", "Japan", "China", "Canada", "France"],
              series: [
                { name: "2022", data: [44, 55, 41, 64, 22] },
                { name: "2023", data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
function async(user_id: number | null | undefined) {
  throw new Error("Function not implemented.");
}
