import React from "react";
import { useNavigate } from "react-router-dom";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // 대시보드로 이동
  const goToDashboard = () => {
    navigate("/dashboard");
    onClose();
  };

  // 홈으로 이동
  const goToHome = () => {
    navigate("/home");
    onClose();
  };

  if (!isOpen) return null; // 모달이 열리지 않은 경우 렌더링하지 않음

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[600px] h-[300px] p-6 rounded-lg shadow-lg relative">
        {/* 닫기 버튼 (오른쪽 위) */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>

        {/* 모달 제목 */}
        <h2
          className="text-2xl font-extrabold mb-4 text-center mt-10"
          style={{ color: "#7551FF" }}
        >
          AI무디타의 편지가 저장되었습니다!
        </h2>

        {/* 모달 본문 */}
        <p className="text-xl text-gray-700 mb-6 font-bold text-center">
          매글과 함께 마음지도를 채워가보세요 ✨
        </p>

        {/* 버튼 그룹 */}
        <div className="flex justify-center space-x-4 mt-12">
          {/* 홈으로 이동 버튼 */}
          <button
            onClick={goToHome}
            className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            style={{ backgroundColor: "#7551FF" }}
          >
            홈
          </button>

          {/* 대시보드로 이동 버튼 */}
          <button
            onClick={goToDashboard}
            className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            style={{ backgroundColor: "#7551FF" }}
          >
            마이매글
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;

export {};
