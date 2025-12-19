//src/pages/Auth/LoginForm.tsx
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../hooks/stores/use-auth-store"
import { apiClient } from "../../lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, AlertCircle } from "lucide-react"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const loginResponse = await apiClient.post("/login", {
        email,
        password,
      })

      if (
        loginResponse.data &&
        loginResponse.data.token &&
        loginResponse.data.user
      ) {
        const { token, user: userData } = loginResponse.data
        // setAuth로 한 번에 설정하여 동기화 문제 방지
        setAuth(
          {
            user_id: userData.user_id,
            email: userData.email,
            profile_name: userData.profile_name,
            profile_picture: userData.profile_picture || undefined,
            isKakaoUser: false,
          },
          token
        )
        navigate("/")
      } else {
        setError("로그인 응답에 필요한 데이터가 없습니다.")
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.msg || "잘못된 이메일 주소 또는 비밀번호입니다."
        )
      } else {
        setError("서버 오류가 발생했습니다.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col w-full max-w-lg mx-auto p-6 sm:p-8 space-y-6"
    >
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-primary font-semibold">
          이메일주소
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "h-12 text-base",
            "focus-visible:ring-primary"
          )}
          required
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-primary font-semibold">
          비밀번호
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="숫자, 특수문자, 영문 포함 8자 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(
            "h-12 text-base",
            "focus-visible:ring-primary"
          )}
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="violet"
        size="xl"
        className="w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          "매글 로그인 하기"
        )}
      </Button>
    </form>
  )
}

export default LoginForm
