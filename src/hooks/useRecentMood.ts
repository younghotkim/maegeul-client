/**
 * useRecentMood Hook
 * Fetches user's recent mood data for personalized welcome messages
 * Validates: Requirements 1.1
 */

import { useState, useEffect } from 'react';

export interface RecentMoodData {
  recentColor: string | null;
  recentLabel: string | null;
  dominantColor: string | null;
  moodCounts: {
    blue: number;
    yellow: number;
    green: number;
    red: number;
  };
  totalEntries: number;
  isLoading: boolean;
  error: string | null;
}

// Map Korean color names to English
const colorMap: Record<string, string> = {
  '파란색': 'blue',
  '노란색': 'yellow',
  '초록색': 'green',
  '빨간색': 'red',
};

// Map colors to mood descriptions
export const moodDescriptions: Record<string, string> = {
  blue: '평온한',
  yellow: '활기찬',
  green: '행복한',
  red: '힘든',
};

// Map colors to emoji
export const moodEmojis: Record<string, string> = {
  blue: '🌊',
  yellow: '⚡',
  green: '🌿',
  red: '🔥',
};

export function useRecentMood(userId?: number): RecentMoodData {
  const [data, setData] = useState<RecentMoodData>({
    recentColor: null,
    recentLabel: null,
    dominantColor: null,
    moodCounts: { blue: 0, yellow: 0, green: 0, red: 0 },
    totalEntries: 0,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchRecentMood = async () => {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Dynamic import to avoid loading apiClient during tests
        const { apiClient } = await import('../lib/api-client');
        
        // Fetch mood color counts
        const colorResponse = await apiClient.get(`/moodmeter/colorcount/${userId}`);
        const colorData = colorResponse.data;

        // Parse color counts
        const moodCounts = { blue: 0, yellow: 0, green: 0, red: 0 };
        let totalEntries = 0;

        colorData.forEach((item: { color: string; count: number }) => {
          const englishColor = colorMap[item.color];
          if (englishColor && englishColor in moodCounts) {
            moodCounts[englishColor as keyof typeof moodCounts] = item.count;
            totalEntries += item.count;
          }
        });

        // Find dominant color
        let dominantColor: string | null = null;
        let maxCount = 0;
        Object.entries(moodCounts).forEach(([color, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
          }
        });

        // Try to fetch most recent mood entry
        let recentColor: string | null = null;
        let recentLabel: string | null = null;

        try {
          const recentResponse = await apiClient.get(`/moodmeter/color/${userId}`);
          if (recentResponse.data && recentResponse.data.length > 0) {
            const mostRecent = recentResponse.data[0];
            recentColor = colorMap[mostRecent.color] || mostRecent.color;
            recentLabel = mostRecent.label;
          }
        } catch (e) {
          // Recent mood fetch failed, use dominant color
          recentColor = dominantColor;
        }

        setData({
          recentColor,
          recentLabel,
          dominantColor,
          moodCounts,
          totalEntries,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('Failed to fetch recent mood:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to fetch mood data',
        }));
      }
    };

    fetchRecentMood();
  }, [userId]);

  return data;
}

/**
 * Generate personalized welcome message based on mood data
 * Validates: Requirements 1.1
 */
export function generateWelcomeMessage(
  userName?: string,
  moodData?: RecentMoodData
): { greeting: string; subtext: string } {
  const name = userName || '회원';
  
  // Default message if no mood data
  if (!moodData || moodData.totalEntries === 0) {
    return {
      greeting: `안녕하세요, ${name}님! 👋`,
      subtext: '저는 무디타봇이에요. 당신의 감정 여정에 함께하는 동반자입니다. 오늘 기분이 어떠신가요?',
    };
  }

  const { recentColor, dominantColor, totalEntries } = moodData;
  const effectiveColor = recentColor || dominantColor;
  
  if (!effectiveColor) {
    return {
      greeting: `안녕하세요, ${name}님! 👋`,
      subtext: `${totalEntries}개의 감정 기록을 함께 나눠주셨네요. 오늘은 어떤 하루를 보내고 계신가요?`,
    };
  }

  const moodDesc = moodDescriptions[effectiveColor] || '';
  const emoji = moodEmojis[effectiveColor] || '💜';

  // Personalized messages based on mood color
  const messages: Record<string, { greeting: string; subtext: string }> = {
    blue: {
      greeting: `안녕하세요, ${name}님 ${emoji}`,
      subtext: `최근 ${moodDesc} 시간을 보내셨군요. 차분한 마음으로 이야기 나눠볼까요?`,
    },
    yellow: {
      greeting: `안녕하세요, ${name}님! ${emoji}`,
      subtext: `최근 ${moodDesc} 에너지가 느껴지네요! 오늘도 좋은 하루 보내고 계신가요?`,
    },
    green: {
      greeting: `안녕하세요, ${name}님 ${emoji}`,
      subtext: `최근 ${moodDesc} 순간들이 많으셨네요. 그 기쁨을 함께 나눠주세요!`,
    },
    red: {
      greeting: `안녕하세요, ${name}님 💜`,
      subtext: `최근 ${moodDesc} 시간을 보내셨군요. 제가 곁에서 들어드릴게요.`,
    },
  };

  return messages[effectiveColor] || {
    greeting: `안녕하세요, ${name}님! 👋`,
    subtext: '오늘 기분이 어떠신가요? 편하게 이야기해주세요.',
  };
}
