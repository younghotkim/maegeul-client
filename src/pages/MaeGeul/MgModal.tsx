import React, { useEffect, useState } from "react";
import aiIcon from "../../Icon/ai.png";
import { analyzeEmotion } from "../../api/analyzeApi"; // 분석 API import
import "./MgModal.css";
import { useAuthStore } from "../../hooks/stores/use-auth-store"; // Store 사용
import { useDiaryCount } from "../../hooks/queries/use-diary-queries"; // React Query 사용
import { Navigate, useNavigate } from "react-router-dom";
import Logo from "../../logo/main_logo.png";
import { DotLoader } from "react-spinners";

interface ModalProps {
  content: string; // content prop 추가
  onClose: () => void;
  onAnalyzeComplete: (result: string) => void; // 분석 결과를 부모에게 전달하는 콜백
}

const MgModal: React.FC<ModalProps> = ({
  content,
  onClose,
  onAnalyzeComplete,
}) => {
  const [emotionResult, setEmotionResult] = useState<string | null>(null); // 분석 결과 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태 추가
  const user = useAuthStore((state) => state.user); // Store에서 사용자 정보 가져오기
  const { data: diaryCountData } = useDiaryCount(user?.user_id); // React Query로 일기 갯수 가져오기
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleDashboard = () => {
    // 다른 로직을 처리한 후 페이지 이동
    navigate("/dashboard"); // "/target-page" 경로로 이동
  };

  // diaryCountData는 이미 number 타입이므로 직접 사용
  const diaryCount = diaryCountData ?? 0;

  const handleAnalyze = async () => {
    if (!isChecked) return; // 체크박스가 체크되지 않으면 실행하지 않음
    setLoading(true); // 분석 시작 시 로딩 상태를 true로 설정
    try {
      // AI 분석 호출
      const emotion = await analyzeEmotion(content);
      setEmotionResult(emotion); // 분석 결과 상태 저장
      onAnalyzeComplete(emotion); // 분석 결과를 부모 컴포넌트로 전달
    } catch (error) {
      console.error("감정 분석 중 오류 발생:", error);
    } finally {
      setLoading(false); // 분석이 완료되면 로딩 상태를 false로 설정
      onClose(); // 로딩이 끝난 후 모달 닫기
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked); // 체크박스 상태 업데이트
  };

  // diaryCount 처리 로직
  const diaryText =
    diaryCount === 0 ? "첫 번째" : diaryCount ? `${diaryCount}번째` : "N번째"; // 일기 갯수에 따라 표시할 텍스트

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="Container w-[1000px] h-[500px] relative bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        {/* 사용자 안내 문구 */}
        <div className="Paragraph text-center text-scampi-700 text-3xl font-bold font-['DM Sans'] leading-8 mt-20">
          {user?.profile_name}님의 {diaryText} 무드일기 작성이 완료되었어요!{" "}
        </div>
        <div className="Paragraph text-center text-blue-950 text-xl font-bold font-['DM Sans'] leading-8 mt-5 mb-6">
          꾸준히 무드 일기를 작성하면, 나의 마음 지도를 <br />
          만들고 자기 돌봄 습관을 만들어 갈 수 있어요.
        </div>

        {/* AI 하루진단 안내 및 설명 */}
        <div className="flex items-center justify-between w-full">
          {/* 아이콘 이미지 */}
          <div className="flex items-center justify-center w-1/6">
            <img
              src={Logo}
              alt="Logo"
              className="w-20 h-20 bg-scampi-500 rounded-full object-cover mb-10"
            />
          </div>

          {/* AI 하루진단 안내 및 설명 */}
          <div className="Paragraph text-left text-slate-400 text-lg font-bold font-plus-jakarta-sans w-4/6 mt-10">
            무디타봇에게 [AI 하루진단]을 받아보세요. <br /> {user?.profile_name}
            님이 작성한 일기 내용을 바탕으로 오늘 느낀 감정을 분석하고 <br />{" "}
            그에 맞는 기분 가이드를 드려요.
            <div className="text-zinc-500 text-sm font-plus-jakarta-sans leading-5 mt-10">
              <input
                type="checkbox"
                className="mr-2"
                checked={isChecked} // 체크박스 상태 연결
                onChange={handleCheckboxChange} // 체크박스 상태 변경 처리
              />
              AI 분석을 위해 OpenAI에 작성글을 전송하는 것에 동의합니다. <br />
            </div>
            <a href="#" className="underline text-xs ml-4">
              [이용 약관 자세히 보기]
            </a>
          </div>

          {/* AI 하루진단 버튼 */}
          <div className="flex flex-col items-center justify-center w-1/6 space-y-4 mb-12">
            <button
              onClick={handleAnalyze} // 버튼 클릭 시 감정 분석 실행
              className={`bg-violet-400 dark:bg-scampi-600 text-white py-3 px-6 rounded-xl shadow-md hover:bg-scampi-400 dark:hover:bg-scampi-700 transition-colors ${
                isChecked ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isChecked} // 체크박스가 체크되지 않았으면 버튼 비활성화
            >
              AI 하루진단
            </button>
          </div>
        </div>

        {/* 로딩 상태일 때 로딩 애니메이션 표시 */}
        {loading && <DotLoader color="#7551FF" size={70} speedMultiplier={1} />}

        {/* 닫기 버튼 */}
        <button
          onClick={handleDashboard}
          className="absolute right-4 top-4 bg-scampi-500 text-white py-2 px-4 rounded-xl shadow hover:bg-scampi-400 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default MgModal;
