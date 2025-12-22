//src/pages/Auth/LoginForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/stores/use-auth-store";
import { apiClient } from "../../lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, Mail, Lock } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginResponse = await apiClient.post("/login", {
        email,
        password,
      });

      if (
        loginResponse.data &&
        loginResponse.data.token &&
        loginResponse.data.user
      ) {
        const { token, user: userData } = loginResponse.data;
        setAuth(
          {
            user_id: userData.user_id,
            email: userData.email,
            profile_name: userData.profile_name,
            profile_picture: userData.profile_picture || undefined,
            isKakaoUser: false,
          },
          token
        );
        navigate("/");
      } else {
        setError("로그인 응답에 필요한 데이터가 없습니다.");
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.msg || "잘못된 이메일 주소 또는 비밀번호입니다."
        );
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col w-full space-y-5">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600 dark:text-red-400">
            {error}
          </span>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          이메일 주소
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "h-12 pl-12 text-base rounded-xl",
              "border-gray-200 dark:border-gray-700",
              "focus-visible:ring-violet-500 focus-visible:border-violet-500",
              "transition-all duration-200"
            )}
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          비밀번호
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "h-12 pl-12 text-base rounded-xl",
              "border-gray-200 dark:border-gray-700",
              "focus-visible:ring-violet-500 focus-visible:border-violet-500",
              "transition-all duration-200"
            )}
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="violet"
        size="xl"
        className="w-full mt-2 rounded-xl font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            로그인 중...
          </>
        ) : (
          "로그인"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
