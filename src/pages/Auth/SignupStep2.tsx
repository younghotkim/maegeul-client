import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import axios from "axios"; // Axios 추가

// 환경 변수에서 BASE_URL을 가져오고, 없으면 동적으로 현재 호스트 사용
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_BASE_URL;
  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl;
  }
  if (import.meta.env.MODE === "production") {
    return "";
  }
  // 개발 환경에서는 현재 호스트의 IP 사용 (외부 접속 가능)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5001`;
};

const BASE_URL = getBaseURL();

const SignupStep2: React.FC = () => {
  const navigate = useNavigate(); // 회원가입 성공 후 페이지 이동을 위한 useNavigate
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
    gender: "",
    age: "",
    birthdate: "",
    profileImage: "",
    profileImageFile: null as File | null, // 실제 파일 저장용
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    name: false,
    nickname: false,
    birthdate: false, // 생년월일 오류 플래그 추가
  });

  const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복 체크 완료 여부
  const [emailCheckMessage, setEmailCheckMessage] = useState(""); // 이메일 중복 체크 메시지
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 에러 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 에러 메시지
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 이메일 중복 체크 함수
  const checkEmailDuplicate = async (email: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/check-email`, {
        email,
      });
      if (response.status === 200) {
        setEmailCheckMessage("사용 가능한 이메일입니다.");
        setEmailChecked(true); // 중복이 아니면 체크 완료
        setErrors({ ...errors, email: false });
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setEmailCheckMessage("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
        setErrors({ ...errors, email: true });
      } else {
        setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
        setEmailChecked(false);
        setErrors({ ...errors, email: true });
      }
    }
  };

  // 파일 선택 시 처리 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(file), // 미리보기 URL 생성
        profileImageFile: file, // 실제 파일 저장
      });
    }
  };

  // 생년월일 형식 검증 함수
  const validateBirthdate = (birthdate: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(birthdate);
  };

  // 이메일 형식 검증 함수
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 필수 입력 항목 체크
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "",
    }));

    // 이메일이 입력될 때마다 중복 체크 상태 초기화
    if (name === "email") {
      setEmailChecked(false); // 이메일 변경 시 중복체크 상태 리셋
      setEmailCheckMessage(""); // 이메일 메시지 리셋
    }

    // 이메일 형식 검증
    if (name === "email") {
      setEmailError(
        validateEmail(value) ? "" : "올바른 이메일 형식이 아닙니다."
      );
    }

    // 비밀번호는 8자 이상이어야 한다는 조건 처리
    if (name === "password") {
      setPasswordError(
        value.length < 8 ? "비밀번호는 최소 8자 이상이어야 합니다." : ""
      );
    }

    // 필수 입력 값 체크 및 생년월일 형식 확인
    if (name === "birthdate") {
      setErrors({ ...errors, birthdate: !validateBirthdate(value) });
    } else if (name in errors) {
      setErrors({ ...errors, [name]: value.trim() === "" });
    }
  };

  // 이메일 중복 체크 버튼 클릭 시 호출
  const handleEmailCheck = () => {
    if (formData.email.trim() !== "") {
      checkEmailDuplicate(formData.email); // 이메일 중복 체크 실행
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await axios.post(`${BASE_URL}/api/upload`, formData);
      setErrorMessage(null); // 성공 시 에러 메시지 초기화
      return response.data.filePath; // 서버에서 반환된 파일 경로
    } catch (error) {
      // 실패 시 경고 메시지를 상태로 설정
      setErrorMessage(
        "프로필 사진 등록에 실패했습니다. 다른 프로필 사진을 업로드하거나 삭제 후 가입해주세요."
      );
      return null;
    }
  };

  // 서버로 데이터를 전송하는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이메일 중복 체크가 완료되지 않았다면 회원가입 막기
    if (!emailChecked) {
      setEmailCheckMessage("이메일 중복 체크를 해주세요.");
      return;
    }

    try {
      let profileImageUrl = "";

      // 파일 업로드 먼저 처리
      if (formData.profileImageFile) {
        profileImageUrl = await uploadFile(formData.profileImageFile);
      }

      // FormData 객체 생성 (사용자 정보)
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("username", formData.name);
      formDataToSend.append("profile_name", formData.nickname);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("birthdate", formData.birthdate);

      // 프로필 이미지 경로 추가
      if (profileImageUrl) {
        formDataToSend.append("profile_picture", profileImageUrl);
      }

      // 서버에 데이터 전송
      const response = await axios.post(
        `${BASE_URL}/api/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("회원가입 성공", response.data);
        navigate("/signupstep3"); // 성공 시 리다이렉트
      }
    } catch (err) {
      console.error("회원가입 실패:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // Form 제출 시 handleSubmit 호출
      className="font-plus-jakarta-sans w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5 dark:bg-gray-800"
    >
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md dark:bg-gray-900 relative">
        <h2 className="text-scampi-700 dark:text-scampi-300 text-xl font-bold mb-4">
          STEP 2
        </h2>
        {/* 상단 장식 라인 */}
        <div className="w-full border-t-8 border-violet-500 pt-4 mt-8 text-center text-scampi-700 dark:text-scampi-300"></div>
        <h3 className="text-scampi-700 dark:text-scampi-300 text-xl font-bold mb-4">
          나의 정보 입력하기
        </h3>

        {/* 이메일 입력 섹션 */}
        <div className="mb-6">
          <div className="text-slate-500 text-lg font-bold font-['DM Sans'] leading-none mb-2">
            이메일
          </div>
          <div
            className={`w-full bg-slate-50 border ${
              errors.email ? "border-red-500" : "border-gray-400"
            } rounded-3xl p-3 flex justify-between items-center`}
          >
            <input
              type="text"
              placeholder="example@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              className=" w-1/3 px-4 py-2 text-base font-bold text-blue-900 bg-violet-200 hover:bg-violet-300 rounded-md hover:shadow-lg"
            >
              중복 확인
            </button>
          </div>
          {emailCheckMessage && (
            <div
              className={`mt-2 ${
                errors.email ? "text-red-500" : "text-green-500"
              }`}
            >
              {emailCheckMessage}
            </div>
          )}

          {errors.email && (
            <div className="text-red-500 text-sm mt-2">
              필수 입력 항목입니다.
            </div>
          )}
          {emailError && (
            <div className="text-red-500 text-sm mt-2">{emailError}</div>
          )}
        </div>

        {/* 비밀번호 입력 섹션 */}
        <div className="mb-6">
          <div className="text-slate-500 text-lg font-bold font-['DM Sans'] leading-none mb-2">
            비밀번호
          </div>
          <div
            className={`w-full bg-slate-50 border ${
              errors.password ? "border-red-500" : "border-gray-400"
            } rounded-3xl p-3 flex justify-between items-center`}
          >
            <input
              type="password"
              placeholder="비밀번호는 최소 8자 이상 포함해주세요."
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
            />
          </div>
          {errors.password && (
            <div className="text-red-500 text-sm mt-2">
              필수 입력 항목입니다.
            </div>
          )}
          {passwordError && (
            <div className="text-red-500 text-sm mt-2">{passwordError}</div>
          )}
        </div>

        {/* 이름 입력 섹션 */}
        <div className="mb-6">
          <div className="text-slate-500 text-lg font-bold font-['DM Sans'] leading-none mb-2">
            이름
          </div>
          <div
            className={`w-full bg-slate-50 border ${
              errors.name ? "border-red-500" : "border-gray-400"
            } rounded-3xl p-3 flex justify-between items-center`}
          >
            <input
              type="text"
              placeholder="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
            />
          </div>
          {errors.name && (
            <div className="text-red-500 text-sm mt-2">
              필수 입력 항목입니다.
            </div>
          )}
        </div>

        {/* 닉네임 입력 섹션 */}
        <div className="mb-6">
          <div className="text-slate-500 text-lg font-bold font-['DM Sans'] leading-none mb-2">
            닉네임
          </div>
          <div
            className={`w-full bg-slate-50 border ${
              errors.nickname ? "border-red-500" : "border-gray-400"
            } rounded-3xl p-3 flex justify-between items-center`}
          >
            <input
              type="text"
              placeholder="닉네임"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
            />
          </div>
          {errors.nickname && (
            <div className="text-red-500 text-sm mt-2">
              필수 입력 항목입니다.
            </div>
          )}
        </div>

        {/* 생년월일 입력 섹션 */}
        <div className="mb-6">
          <div className="text-slate-500 text-lg font-bold font-['DM Sans'] leading-none mb-2">
            생년월일 (YYYY-MM-DD)
          </div>
          <div className="w-full bg-slate-50 border border-gray-400 rounded-3xl p-3 flex justify-between items-center">
            <input
              type="text" // 텍스트 입력으로 생년월일을 입력받음
              placeholder="YYYY-MM-DD"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
            />
          </div>
          {errors.birthdate && (
            <div className="text-red-500 text-sm mt-2">
              생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)
            </div>
          )}
        </div>
        {/* 프로필 이미지 업로드 섹션 */}
        <div className="mb-6">
          <div className="text-slate-500 text-lg font-bold font-['DM Sans'] leading-none mb-2">
            프로필 이미지
          </div>
          <div className="Input w-64 h-72 bg-slate-50 rounded-3xl border border-gray-400 flex items-center justify-center mb-4 relative">
            {formData.profileImage ? (
              <>
                <img
                  src={formData.profileImage}
                  alt="Profile Preview"
                  className="object-cover w-full h-full rounded-3xl"
                />
                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      profileImage: "",
                      profileImageFile: null,
                    })
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  삭제
                </button>
              </>
            ) : (
              <span className="text-gray-400">프로필 사진을 업로드하세요.</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          <p className="text-sm text-gray-500">
            10MB 이하의 이미지만 업로드 가능합니다.
          </p>

          {errorMessage && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>

        {/* 성별 입력 섹션 */}
        <div className="mb-6">
          <div className="text-slate-500 text-lg font-bold font-['DM Sans'] leading-none mb-2">
            성별
          </div>
          <select
            className="w-full bg-slate-50 border border-gray-400 rounded-3xl p-3 text-gray-800"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">선택 안함</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        {/* 완료 버튼 */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full px-6 py-4 text-base font-bold text-blue-900 bg-violet-200 hover:bg-violet-300 rounded-md hover:shadow-lg"
          >
            회원가입 완료
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignupStep2;
