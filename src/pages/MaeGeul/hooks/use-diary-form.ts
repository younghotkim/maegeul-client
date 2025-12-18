import { useState, useEffect } from "react";
import { useAuthStore } from "../../../hooks/stores/use-auth-store";
import { useMoodStore } from "../../../hooks/stores/use-mood-store";

export function useDiaryForm() {
  const user = useAuthStore((state) => state.user);
  const { pleasantness, energy, highlightedLabels, highlightedColor } =
    useMoodStore();

  // 사용자 정보가 없으면 경고만 출력 (리다이렉트는 컴포넌트 레벨에서 처리)
  useEffect(() => {
    if (!user) {
      console.warn("User not found in store. Please login first.");
    }
  }, [user]);

  const [content, setContent] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedDateOnly, setFormattedDateOnly] = useState("");
  const [title, setTitle] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isContentEditable, setIsContentEditable] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const maxLength = 500;

  // 날짜 포맷팅
  useEffect(() => {
    const today = new Date();
    const formatted = `${today.getHours()}시 ${today.getMinutes()}분`;
    setFormattedDate(formatted);

    const formattedOnlyDate = `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;
    setFormattedDateOnly(formattedOnlyDate);
  }, []);

  // 제목 초기화
  useEffect(() => {
    setTitle(`${formattedDateOnly}의 일기`);
  }, [formattedDateOnly]);

  // 색상 변환 함수
  const getColorName = (colorValue: string) => {
    switch (colorValue) {
      case "#EE5D50":
        return "빨간색";
      case "#FFDE57":
        return "노란색";
      case "#6AD2FF":
        return "파란색";
      case "#35D28A":
        return "초록색";
      default:
        return "마음 색상";
    }
  };

  const colorName = highlightedColor ? getColorName(highlightedColor) : "";

  // 라벨 클릭 핸들러
  const handleLabelClick = (label: string) => {
    setSelectedLabels((prevLabels) => {
      const updatedLabels = prevLabels.includes(label)
        ? prevLabels.filter((l) => l !== label)
        : [...prevLabels, label];

      // 제목 업데이트
      if (updatedLabels.length === 0) {
        setTitle(`${formattedDateOnly}의 일기`);
      } else {
        setTitle(`${formattedDateOnly}의 일기 #${updatedLabels.join("#")}`);
      }

      return updatedLabels;
    });
  };

  const handleClickComplete = () => {
    setIsButtonVisible(false);
    setIsContentEditable(false);
  };

  const contentReset = () => {
    setContent("");
  };

  const isValid = content.length >= 10;

  return {
    // State
    content,
    title,
    selectedLabels,
    formattedDate,
    formattedDateOnly,
    isContentEditable,
    isButtonVisible,
    maxLength,
    isValid,
    // Context data
    user,
    pleasantness,
    energy,
    highlightedLabels,
    highlightedColor,
    colorName,
    // Handlers
    setContent,
    handleLabelClick,
    handleClickComplete,
    contentReset,
  };
}
