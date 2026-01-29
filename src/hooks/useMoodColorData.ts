import { useMemo } from "react";
import { useAuthStore } from "./stores/use-auth-store";
import { useMoodColorCounts } from "./queries";

interface MoodColorItem {
  label: string;
  value: number;
}

const DEFAULT_MOOD_COLORS: MoodColorItem[] = [
  { label: "파란색", value: 0 },
  { label: "노란색", value: 0 },
  { label: "초록색", value: 0 },
  { label: "빨간색", value: 0 },
];

/**
 * 커스텀 훅: user_id에 따른 무드 컬러 데이터를 가져옴
 * React Query를 사용하여 캐싱 및 자동 리페치 지원
 */
export const useMoodColorData = () => {
  const user = useAuthStore((state) => state.user);
  const { data: colorCounts, isLoading, error } = useMoodColorCounts(user?.user_id);

  // API 데이터를 차트 형식으로 변환
  const moodColorData = useMemo(() => {
    if (!colorCounts) return DEFAULT_MOOD_COLORS;

    return DEFAULT_MOOD_COLORS.map((item) => {
      const match = colorCounts.find(
        (colorData) => colorData.color === item.label
      );
      return match ? { ...item, value: match.count } : item;
    });
  }, [colorCounts]);

  // 총 label 개수를 계산
  const totalLabels = useMemo(
    () => moodColorData.reduce((total, item) => total + item.value, 0),
    [moodColorData]
  );

  // 초록색과 노란색만 더한 값을 계산 (긍정 감정)
  const greenYellowTotal = useMemo(
    () =>
      moodColorData
        .filter((item) => item.label === "초록색" || item.label === "노란색")
        .reduce((total, item) => total + item.value, 0),
    [moodColorData]
  );

  return { 
    moodColorData, 
    totalLabels, 
    greenYellowTotal,
    isLoading,
    error,
  };
};
