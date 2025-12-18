import axios from "axios";
import { useState, useEffect } from "react";
import { moodData } from "../api/moodData"; // 감정 데이터셋 임포트

// 환경 변수에서 API URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getAPIURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl;
  }
  if (import.meta.env.MODE === "production") {
    return "/api";
  }
  // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5001/api`;
};

const API_URL = getAPIURL();

// 사용자 감정 데이터를 가져오는 커스텀 훅
const useUserMoodData = (userId: number | string | undefined) => {
  const [moodDataWithColors, setMoodDataWithColors] = useState<any[]>([]); // API에서 받아온 데이터를 상태로 저장

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_URL}/moodmeter/label/${userId}`)
        .then((response) => {
          // 서버에서 받아온 데이터와 moodData를 매칭
          const mappedMoodData = response.data.flatMap(
            (labelObj: { label: string }) => {
              // 쉼표로 분리된 label을 배열로 나눔
              const labels = labelObj.label.split(",").map((l) => l.trim());

              // 각 label을 moodData에서 매칭
              return labels.map((label: string) => {
                const mood = moodData.find(
                  (m: { label: string }) => m.label === label
                ); // label을 기준으로 매칭
                return {
                  label, // 매칭된 label
                  color: mood ? mood.color : "#000", // 색상 매칭
                  pleasantness: mood ? mood.pleasantness : 1, // pleasantness 매칭 (없으면 기본값 1)
                };
              });
            }
          );

          setMoodDataWithColors(mappedMoodData); // 매핑된 데이터 상태로 저장
        })
        .catch((error) => {
          console.error(
            "감정 데이터를 불러오는 중 오류가 발생했습니다:",
            error
          );
        });
    }
  }, [userId]);

  return moodDataWithColors;
};

export default useUserMoodData;
