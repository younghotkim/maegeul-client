import { useMemo } from "react";
import Box from "@mui/material/Box";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { AnalyticsOrderTimeline } from "../../sections/overview/analytics-order-timeline";
import { useDiaries } from "../../hooks/queries";

export function DiaryTimeline() {
  const user = useAuthStore((state) => state.user);
  const { data: diaryData = [] } = useDiaries(user?.user_id);

  // 색상 변환 맵 정의
  const colorMap: { [key: string]: string } = {
    빨간색: "#EE5D50",
    노란색: "#FFDE57",
    파란색: "#6AD2FF",
    초록색: "#35D28A",
  };

  // 데이터를 최신순으로 정렬 후 AnalyticsOrderTimeline에서 사용할 수 있는 리스트 형식으로 변환
  const _timeline = useMemo(() => {
    return [...diaryData]
      .sort((a, b) => b.diary_id - a.diary_id) // 최신순 정렬 (diary_id 내림차순)
      .map((diary) => {
        // 빠른 체크인인지 확인
        const isQuickCheckin = diary.title.startsWith("빠른 체크인:");
        
        return {
          id: diary.diary_id.toString(),
          type: colorMap[diary.color] || "#667eea", // colorMap에서 diary.color를 찾아 변환
          title: isQuickCheckin 
            ? `⚡ ${diary.title.replace("빠른 체크인: ", "")}` 
            : diary.title,
          time: diary.formatted_date,
        };
      });
  }, [diaryData]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <AnalyticsOrderTimeline
        title="무드 컬러 타임라인"
        list={_timeline}
        sx={{ height: "100%", minHeight: 400 }}
      />
    </Box>
  );
}
