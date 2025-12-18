import React, { useState } from "react";
import { Link } from "react-router-dom";

// 체크박스의 상태를 관리하는 타입 선언 (전체, 개인정보, 이용약관, 마케팅 동의)
type CheckedItems = {
  all: boolean;
  personalInfo: boolean;
  usageTerms: boolean;
  marketingConsent: boolean;
};

// 각 동의 항목의 세부 내용 펼치기/접기 상태를 관리하는 타입 선언
type OpenSections = {
  personalInfo: boolean;
  usageTerms: boolean;
  marketingConsent: boolean;
};

// 회원가입 첫 번째 스텝 컴포넌트
const SignupStep1: React.FC = () => {
  // 체크박스 선택 상태를 관리하는 state
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({
    all: false,
    personalInfo: false,
    usageTerms: false,
    marketingConsent: false,
  });

  // 약관 세부 내용을 펼치거나 접는 상태를 관리하는 state
  const [openSections, setOpenSections] = useState<OpenSections>({
    personalInfo: false,
    usageTerms: false,
    marketingConsent: false,
  });

  // 특정 체크박스 선택 상태 변경 시 호출되는 함수
  // 모든 항목이 선택되었을 경우 "전체 동의"도 체크됨
  const handleCheck = (item: keyof CheckedItems, checked: boolean) => {
    setCheckedItems((prevState) => {
      const updatedState = { ...prevState, [item]: checked };

      // 전체 동의 선택 시, 모든 체크박스를 동일한 상태로 설정
      if (item === "all") {
        return {
          all: checked,
          personalInfo: checked,
          usageTerms: checked,
          marketingConsent: checked,
        };
      }

      // 개별 항목의 선택 여부에 따라 전체 동의 상태 업데이트
      const allChecked = updatedState.personalInfo && updatedState.usageTerms;
      return {
        ...updatedState,
        all: allChecked && updatedState.marketingConsent,
      };
    });
  };

  // 약관 세부 항목 펼치기/접기를 토글하는 함수
  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // 필수 약관이 체크되지 않았을 경우 다음 버튼 비활성화
  const isNextButtonDisabled =
    !checkedItems.personalInfo || !checkedItems.usageTerms;

  return (
    <div className="font-plus-jakarta-sans flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5 dark:bg-gray-800 dark:text-white">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
        {/* STEP 1 제목 */}
        <h2 className="text-scampi-700 dark:text-scampi-300 text-xl font-bold mb-4">
          STEP 1
        </h2>

        {/* 상단 장식 라인 */}
        <div className="w-full border-t-8 border-violet-500 pt-4 mt-8 text-center text-scampi-700 dark:text-scampi-300"></div>

        {/* 이용약관 체크하기 제목 */}
        <h3 className="text-scampi-700 dark:text-scampi-300 text-xl font-bold mb-4">
          이용약관 체크하기
        </h3>

        {/* 전체 동의 항목 */}
        <label
          className={`p-4 rounded-full border  mb-2 flex items-center justify-between cursor-pointer ${
            checkedItems.all ? "bg-violet-100 border-violet-500" : "bg-white"
          }`}
        >
          <input
            type="checkbox"
            checked={checkedItems.all} // 전체 동의 체크 여부에 따라 체크박스 상태 업데이트
            onChange={(e) => handleCheck("all", e.target.checked)} // 상태 변경 함수 호출
            className="mr-2 w-6 h-6 cursor-pointer"
          />
          <span className="flex-grow text-gray-800 dark:text-white cursor-pointer">
            이용약관 전체동의(선택 동의 포함)
          </span>
        </label>

        {/* 개별 동의 항목 */}
        {["personalInfo", "usageTerms", "marketingConsent"].map(
          (item, index) => (
            <div key={index}>
              <label
                className={`p-4 rounded-full border   mb-2 flex items-center justify-between cursor-pointer ${
                  checkedItems[item as keyof CheckedItems]
                    ? "bg-violet-100 border-violet-500"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checkedItems[item as keyof CheckedItems]} // 각 항목의 체크박스 상태에 따라 렌더링
                    onChange={(e) =>
                      handleCheck(item as keyof CheckedItems, e.target.checked)
                    } // 상태 변경 함수 호출
                    className="mr-2 w-6 h-6 cursor-pointer"
                  />
                  <span className="text-gray-800 dark:text-white cursor-pointer">
                    {/* 각 항목에 맞는 텍스트 표시 */}
                    {item === "personalInfo" && "(필수) 개인 정보 수집 및 이용"}
                    {item === "usageTerms" && "(필수) 매글 사용 약관"}
                    {item === "marketingConsent" &&
                      "(선택) 매글 마케팅 메시지 수신 동의"}
                  </span>
                </div>

                {/* 세부 약관 펼치기/접기 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 요소의 클릭 이벤트 중지
                    toggleSection(item as keyof OpenSections); // 해당 항목의 세부 내용 펼치기/접기
                  }}
                  className="text-gray-500"
                >
                  {openSections[item as keyof OpenSections] ? "🔼" : "🔽"}
                </button>
              </label>

              {/* 동의 항목 세부 사항 - 조건부 렌더링 */}
              {openSections[item as keyof OpenSections] && (
                <div className="ml-8 mb-4 text-gray-600 dark:text-gray-400">
                  <Link to={"#"}>세부 약관 보기</Link> {/* 세부 약관 링크 */}
                </div>
              )}
            </div>
          )
        )}

        {/* 다음 버튼 */}
        <div className="mt-8">
          {/* 필수 항목이 체크되지 않으면 다음 페이지로 이동 불가 */}
          <Link to={isNextButtonDisabled ? "#" : "/signupstep2"}>
            <button
              disabled={isNextButtonDisabled} // 필수 항목이 체크되지 않으면 비활성화
              className={`w-full px-6 py-4 text-base font-bold text-blue-900 rounded-md ${
                isNextButtonDisabled
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-violet-200 hover:bg-violet-300"
              }`}
            >
              다음 {/* 버튼 텍스트 */}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupStep1;
