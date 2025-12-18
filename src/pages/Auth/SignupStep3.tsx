import React from "react";
import { Link } from "react-router-dom";

const SignupStep3: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5 dark:bg-gray-800">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md dark:bg-gray-900 relative">
        {/* Step 3 Header */}
        <h2 className="text-scampi-700 dark:text-scampi-300 text-xl font-bold mb-4">
          STEP 3
        </h2>
        {/*  구분선 */}
        <div className="w-full border-t-8 border-violet-500 pt-4 mt-8 text-center text-scampi-700 dark:text-scampi-300"></div>
        <h3 className="text-scampi-700 dark:text-scampi-300 text-xl font-bold mb-4">
          회원가입 완료
        </h3>

        {/* 텍스트 섹션 */}
        <div className="mt-20 mb-20">
          <div className="text-lg text-center text-blue-900 font-bold font-['DM Sans'] leading-tight">
            회원가입이 완료되었습니다.
            <br />
            글쓰기를 통해 나를 알아갈 준비가 되셨나요? 🧐
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          <Link to="/home">
            <button
              className="w-full h-10 text-base font-bold text-blue-900 border border-violet-500 
            rounded-md hover:bg-violet-100 hover:shadow-md"
            >
              홈으로 가기
            </button>
          </Link>

          <Link to="/mainlogin">
            <button className="w-full h-10 text-base font-bold text-blue-900 bg-violet-200 hover:bg-violet-300 rounded-md hover:shadow-lg">
              {" "}
              로그인 화면으로 가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupStep3;
