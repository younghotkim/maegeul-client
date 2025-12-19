import { useEffect } from 'react'
import { useAuthStore } from '../hooks/stores/use-auth-store'
import { apiClient } from '../lib/api-client'

/**
 * 앱 초기화 시 인증 상태를 복원하는 컴포넌트
 * - persist된 토큰이 있으면 서버에서 사용자 정보를 검증/갱신
 * - 토큰이 만료되었거나 유효하지 않으면 로그아웃 처리
 */
export function AuthInitializer() {
  const { token, user, setUser, setInitialized, logout } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      // 토큰이 없으면 초기화 완료
      if (!token) {
        setInitialized(true)
        return
      }

      // 이미 user 정보가 있으면 토큰 유효성만 검증
      if (user) {
        try {
          // 토큰 유효성 검증 (사용자 정보 갱신)
          const response = await apiClient.get(`/user/${user.user_id}`)
          if (response.data) {
            setUser({
              user_id: response.data.user_id,
              email: response.data.email,
              profile_name: response.data.profile_name,
              profile_picture: response.data.profile_picture || undefined,
              isKakaoUser: response.data.isKakaoUser || user.isKakaoUser,
            })
          }
        } catch (error: any) {
          // 401 에러면 토큰 만료 - 로그아웃 처리
          if (error.response?.status === 401) {
            console.log('토큰이 만료되었습니다. 로그아웃 처리합니다.')
            logout()
          }
          // 다른 에러는 기존 user 정보 유지 (네트워크 오류 등)
        }
        setInitialized(true)
        return
      }

      // 토큰은 있지만 user 정보가 없는 경우 (비정상 상태)
      // 토큰에서 user_id를 추출할 수 없으므로 로그아웃 처리
      console.log('토큰은 있지만 사용자 정보가 없습니다. 로그아웃 처리합니다.')
      logout()
      setInitialized(true)
    }

    initializeAuth()
  }, []) // 앱 마운트 시 한 번만 실행

  return null
}
