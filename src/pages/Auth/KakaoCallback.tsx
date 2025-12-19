import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../hooks/stores/use-auth-store"
import { apiClient } from "../../lib/api-client"
import { LoadingScreen } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"

const KakaoCallback = () => {
  const location = useLocation()
  const { setUser, setToken, setInitialized } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const queryParams = new URLSearchParams(location.search)
      const token = queryParams.get("token")
      const userId = queryParams.get("userId")
      const errorParam = queryParams.get("error")

      if (errorParam) {
        setError("카카오 로그인에 실패했습니다.")
        setTimeout(() => navigate("/mainlogin"), 2000)
        return
      }

      if (!token || !userId) {
        setError("로그인 정보가 없습니다.")
        setTimeout(() => navigate("/mainlogin"), 2000)
        return
      }

      try {
        setToken(token)

        const response = await apiClient.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const userData = response.data.user || response.data

        setUser({
          user_id: Number(userId),
          profile_name: userData.profile_name || "",
          profile_picture: userData.profile_picture || undefined,
          email: userData.email || "",
          isKakaoUser: true,
        })

        setInitialized(true)
        navigate("/")
      } catch (err) {
        console.error("사용자 정보를 가져오는데 실패했습니다:", err)
        setError("사용자 정보를 가져오는데 실패했습니다.")
        setInitialized(true)
        setTimeout(() => navigate("/"), 2000)
      }
    }

    handleKakaoCallback()
  }, [location, setUser, setToken, setInitialized, navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    )
  }

  return <LoadingScreen message="카카오 로그인 처리 중..." />
}

export default KakaoCallback
