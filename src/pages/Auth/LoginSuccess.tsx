// src/pages/LoginSuccess.tsx
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../hooks/stores/use-auth-store"
import { apiClient } from "../../lib/api-client"
import { LoadingScreen } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"

const LoginSuccess: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setAuth, logout } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleLoginSuccess = async () => {
      const params = new URLSearchParams(location.search)
      const token = params.get("token")
      const userId = params.get("user_id")

      if (!token) {
        logout()
        navigate("/mainlogin")
        return
      }

      try {
        let userData = null

        if (userId) {
          const response = await apiClient.get(`/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          userData = response.data
        } else {
          const response = await apiClient.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          userData = response.data
        }

        if (userData) {
          // setAuth로 한 번에 설정
          setAuth(
            {
              user_id: userData.user_id,
              email: userData.email,
              profile_name: userData.profile_name,
              profile_picture: userData.profile_picture || undefined,
              isKakaoUser: true,
            },
            token
          )
          navigate("/home")
        } else {
          throw new Error("사용자 정보를 가져올 수 없습니다.")
        }
      } catch (err) {
        console.error("로그인 처리 중 오류:", err)
        setError("로그인 처리 중 오류가 발생했습니다.")
        logout()
        setTimeout(() => navigate("/mainlogin"), 2000)
      }
    }

    handleLoginSuccess()
  }, [location, navigate, setAuth, logout])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return <LoadingScreen message="로그인 중..." />
}

export default LoginSuccess
