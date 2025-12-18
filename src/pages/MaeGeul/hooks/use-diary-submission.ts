import { useState, useEffect } from "react";

// 환경 변수에서 API URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getAPIURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl.replace(/\/api$/, ""); // /api 제거 (이미 포함되어 있을 수 있음)
  }
  if (import.meta.env.MODE === "production") {
    // 프로덕션에서는 환경 변수가 필수
    console.error("VITE_API_URL 환경 변수가 설정되지 않았습니다.");
    throw new Error("VITE_API_URL 환경 변수가 필요합니다.");
  }
  // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5001`;
};

const API_URL = getAPIURL();

interface SaveMoodData {
  user_id?: number;
  pleasantness: number;
  energy: number;
  label: string;
  color: string;
}

interface SaveDiaryData {
  user_id?: number;
  title: string;
  content: string;
  color: string;
}

interface SaveEmotionData {
  user_id?: number;
  diary_id: number | null;
  emotion_result: string;
}

export function useDiarySubmission() {
  const [emotionResult, setEmotionResult] = useState<string | null>(null);
  const [sentences, setSentences] = useState<string[]>([]);
  const [diaryId, setDiaryId] = useState<number | null>(null);
  const [diarySaved, setDiarySaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [progressBarValue, setProgressBarValue] = useState(80);

  // emotionResult를 문장 단위로 분리
  useEffect(() => {
    if (emotionResult) {
      const updatedSentences = emotionResult
        .split("\n")
        .filter((sentence) => sentence.trim() !== "");
      setSentences(updatedSentences);
    }
  }, [emotionResult]);

  // emotionResult가 있으면 progressBar를 100으로
  useEffect(() => {
    if (emotionResult) {
      setProgressBarValue(100);
    }
  }, [emotionResult]);

  const handleSaveMoodData = async (moodData: SaveMoodData) => {
    try {
      const response = await fetch(`${API_URL}/api/save-moodmeter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moodData),
      });

      if (!response.ok) {
        throw new Error("데이터 저장 중 오류가 발생했습니다.");
      }

      const result = await response.json();
      console.log(
        `데이터가 성공적으로 저장되었습니다. 저장된 ID: ${result.id}`
      );
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다.", error);
    }
  };

  const handleSaveDiary = async (diaryData: SaveDiaryData) => {
    try {
      const response = await fetch(`${API_URL}/api/diary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diaryData),
      });

      if (!response.ok) {
        throw new Error("일기 저장 중 오류가 발생했습니다.");
      }

      const result = await response.json();
      setDiaryId(result.diary_id);
      setDiarySaved(true);
      console.log(
        `일기가 성공적으로 저장되었습니다. 일기 ID: ${result.diary_id}`
      );
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error);
    }
  };

  const handleSaveEmotionAnalysis = async (emotionData: SaveEmotionData) => {
    try {
      console.log("Saving emotion analysis with diaryId:", diaryId);

      const emotionResultString = sentences.join(" ");

      const response = await fetch(`${API_URL}/api/emotion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emotionData,
          emotion_result: emotionResultString,
        }),
      });

      if (!response.ok) {
        throw new Error("감정 분석 결과 저장 중 오류가 발생했습니다.");
      }

      const result = await response.json();
      console.log("감정 분석 결과가 성공적으로 저장되었습니다:", result);
    } catch (error) {
      console.error("감정 분석 결과 저장 중 오류 발생:", error);
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const toggleSaveModal = () => {
    setIsSaveModalOpen(!isSaveModalOpen);
  };

  const handleAnalyzeComplete = (result: string) => {
    setEmotionResult(result);
  };

  return {
    // State
    emotionResult,
    sentences,
    diaryId,
    diarySaved,
    showModal,
    isSaveModalOpen,
    progressBarValue,
    // Handlers
    setEmotionResult,
    handleSaveMoodData,
    handleSaveDiary,
    handleSaveEmotionAnalysis,
    handleModalOpen,
    handleModalClose,
    toggleSaveModal,
    handleAnalyzeComplete,
  };
}
