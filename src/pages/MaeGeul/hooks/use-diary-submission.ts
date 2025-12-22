import { useState, useEffect } from "react";
import { apiClient } from "../../../lib/api-client";

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
      const response = await apiClient.post('/save-moodmeter', moodData);
      console.log(
        `데이터가 성공적으로 저장되었습니다. 저장된 ID: ${response.data.id}`
      );
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다.", error);
      throw error;
    }
  };

  const handleSaveDiary = async (diaryData: SaveDiaryData) => {
    try {
      const response = await apiClient.post('/diary', diaryData);
      setDiaryId(response.data.diary_id);
      setDiarySaved(true);
      console.log(
        `일기가 성공적으로 저장되었습니다. 일기 ID: ${response.data.diary_id}`
      );
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error);
      throw error;
    }
  };

  const handleSaveEmotionAnalysis = async (emotionData: SaveEmotionData) => {
    try {
      console.log("Saving emotion analysis with diaryId:", diaryId);

      const emotionResultString = sentences.join(" ");

      const response = await apiClient.post('/emotion', {
        ...emotionData,
        emotion_result: emotionResultString,
      });

      console.log("감정 분석 결과가 성공적으로 저장되었습니다:", response.data);
    } catch (error) {
      console.error("감정 분석 결과 저장 중 오류 발생:", error);
      throw error;
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
