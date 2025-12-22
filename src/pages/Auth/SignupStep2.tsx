import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Mail,
  Lock,
  User,
  AtSign,
  Calendar,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const getAPIURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes("YOUR_SERVER_IP") && envUrl.startsWith("http")) {
    return envUrl.replace(/\/api$/, "");
  }
  throw new Error("VITE_API_URL 환경 변수가 필요합니다.");
};

const API_URL = getAPIURL();

const SignupStep2: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
    gender: "",
    birthdate: "",
    profileImage: "",
    profileImageFile: null as File | null,
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    name: false,
    nickname: false,
    birthdate: false,
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkEmailDuplicate = async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/check-email`, { email });
      if (response.status === 200) {
        setEmailCheckMessage("사용 가능한 이메일입니다.");
        setEmailChecked(true);
        setErrors({ ...errors, email: false });
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setEmailCheckMessage("이미 사용 중인 이메일입니다.");
      } else {
        setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
      }
      setEmailChecked(false);
      setErrors({ ...errors, email: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(file),
        profileImageFile: file,
      });
    }
  };

  const validateBirthdate = (birthdate: string) => /^\d{4}-\d{2}-\d{2}$/.test(birthdate);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: value.trim() === "" }));

    if (name === "email") {
      setEmailChecked(false);
      setEmailCheckMessage("");
      setEmailError(validateEmail(value) ? "" : "올바른 이메일 형식이 아닙니다.");
    }
    if (name === "password") {
      setPasswordError(value.length < 8 ? "비밀번호는 최소 8자 이상이어야 합니다." : "");
    }
    if (name === "birthdate") {
      setErrors((prev) => ({ ...prev, birthdate: !validateBirthdate(value) }));
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData);
      setErrorMessage(null);
      return response.data.filePath;
    } catch {
      setErrorMessage("프로필 사진 업로드에 실패했습니다.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailChecked) {
      setEmailCheckMessage("이메일 중복 체크를 해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      let profileImageUrl = "";
      if (formData.profileImageFile) {
        profileImageUrl = await uploadFile(formData.profileImageFile);
      }

      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("username", formData.name);
      formDataToSend.append("profile_name", formData.nickname);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("birthdate", formData.birthdate);
      if (profileImageUrl) formDataToSend.append("profile_picture", profileImageUrl);

      const response = await axios.post(`${API_URL}/api/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        navigate("/signupstep3");
      }
    } catch (err) {
      console.error("회원가입 실패:", err);
      setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-600 flex items-center justify-center text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">약관 동의</span>
          </div>
          <div className="w-12 h-0.5 bg-violet-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              정보 입력
            </span>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            회원 정보 입력
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            매글 서비스 이용을 위한 정보를 입력해주세요
          </p>

          {errorMessage && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600 dark:text-red-400">{errorMessage}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* 이메일 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                이메일 <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "h-12 pl-12 rounded-xl",
                      errors.email && "border-red-500"
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="violet-outline"
                  onClick={() => checkEmailDuplicate(formData.email)}
                  className="h-12 px-4 rounded-xl whitespace-nowrap"
                >
                  중복 확인
                </Button>
              </div>
              {emailCheckMessage && (
                <p className={cn("text-sm", emailChecked ? "text-green-600" : "text-red-500")}>
                  {emailCheckMessage}
                </p>
              )}
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  placeholder="8자 이상 입력해주세요"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn("h-12 pl-12 rounded-xl", errors.password && "border-red-500")}
                />
              </div>
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>

            {/* 이름 & 닉네임 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="이름"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn("h-12 pl-12 rounded-xl", errors.name && "border-red-500")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  닉네임 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={formData.nickname}
                    onChange={handleChange}
                    className={cn("h-12 pl-12 rounded-xl", errors.nickname && "border-red-500")}
                  />
                </div>
              </div>
            </div>

            {/* 생년월일 & 성별 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  생년월일
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="birthdate"
                    placeholder="YYYY-MM-DD"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className={cn("h-12 pl-12 rounded-xl", errors.birthdate && "border-red-500")}
                  />
                </div>
                {errors.birthdate && (
                  <p className="text-xs text-red-500">형식: YYYY-MM-DD</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  성별
                </Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">선택 안함</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
            </div>

            {/* 프로필 이미지 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                프로필 이미지
              </Label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                  {formData.profileImage ? (
                    <>
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, profileImage: "", profileImageFile: null })
                        }
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <span className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
                      이미지 업로드
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">10MB 이하 이미지</p>
                </div>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            variant="violet"
            size="xl"
            className="w-full mt-8 rounded-xl font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                처리 중...
              </>
            ) : (
              "회원가입 완료"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignupStep2;
