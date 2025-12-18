import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getDiariesByUserId,
  countDiariesByUserId,
  saveDiary,
  getConsecutiveDaysByUserId,
} from "../api/diaryApi"; // API 함수 사용

interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  color: string;
  formatted_date: string;
}

interface DiaryContextType {
  diaries: Diary[] | null;
  diaryCount: number;
  consecutiveDays: number; // 연속된 일수 상태 추가
  fetchDiaries: (user_id: number) => void;
  saveDiaryEntry: (
    diaryData: Omit<Diary, "diary_id" | "date">
  ) => Promise<void>;
  fetchDiaryCount: (user_id: number) => void;
  fetchConsecutiveDays: (user_id: number) => void; // 연속된 일수 함수 추가
}

export const DiaryContext = createContext<DiaryContextType | undefined>(
  undefined
);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [diaries, setDiaries] = useState<Diary[] | null>(null);
  const [diaryCount, setDiaryCount] = useState<number>(0);
  const [consecutiveDays, setConsecutiveDays] = useState<number>(0); // 연속된 일수 상태 추가

  const fetchDiaries = async (user_id: number) => {
    try {
      const result = await getDiariesByUserId(user_id);
      setDiaries(result);
    } catch (error) {
      console.error("일기 데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  const saveDiaryEntry = async (
    diaryData: Omit<Diary, "diary_id" | "date">
  ) => {
    try {
      await saveDiary(diaryData);
      fetchDiaries(diaryData.user_id);
      fetchDiaryCount(diaryData.user_id);
      fetchConsecutiveDays(diaryData.user_id); // 일기 저장 후 연속된 일수 업데이트
    } catch (error) {
      console.error("일기를 저장하는 중 오류가 발생했습니다:", error);
    }
  };

  const fetchDiaryCount = async (user_id: number) => {
    try {
      const count = await countDiariesByUserId(user_id);
      setDiaryCount(count);
    } catch (error) {
      console.error("일기 갯수 조회 중 오류가 발생했습니다:", error);
    }
  };

  // 연속된 일수를 조회하는 함수
  const fetchConsecutiveDays = async (user_id: number) => {
    try {
      const consecutive = await getConsecutiveDaysByUserId(user_id); // API 호출
      setConsecutiveDays(consecutive.consecutive_days); // 연속된 일수 상태 업데이트
    } catch (error) {
      console.error("연속된 일수 조회 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <DiaryContext.Provider
      value={{
        diaries,
        diaryCount,
        consecutiveDays, // 연속된 일수 추가
        fetchDiaries,
        saveDiaryEntry,
        fetchDiaryCount,
        fetchConsecutiveDays, // 연속된 일수 함수 추가
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error("useDiary는 DiaryProvider 내에서 사용되어야 합니다.");
  }
  return context;
};
