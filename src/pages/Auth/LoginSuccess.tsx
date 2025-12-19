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
  const { setToken, setUser, setInitialized } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleLoginSuccess = async () => {
      const params = new URLSearchParams(location.search)
      const token = params.get("token")
      const userId = params.get("user_id")

      if (!token) {
        navigate("/mainlogin")
        return
      }

      try {
        setToken(token)

        if (userId) {
          const response = await apiClient.get(`/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.data) {
            setUser({
              user_id: response.data.user_id,
              email: response.data.email,
              profile_name: response.data.profile_name,
              profile_picture: response.data.profile_picture || undefined,
              isKakaoUser: true,
            })
          }
        } else {
          const response = await apiClient.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.data) {
            setUser({
              user_id: response.data.user_id,
              email: response.data.email,
              profile_name: response.data.profile_name,
              profile_picture: response.data.profile_picture || undefined,
              isKakaoUser: true,
            })
          }
        }

        setInitialized(true)
        navigate("/home")
      } catch (err) {
        console.error("로그인 처리 중 오류:", err)
        setError("로그인 처리 중 오류가 발생했습니다.")
        setInitialized(true)
        navigate("/home")
      }
    }

    handleLoginSuccess()
  }, [location, navigate, setToken, setUser, setInitialized])

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
