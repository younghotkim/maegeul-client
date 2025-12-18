import { apiClient } from '../lib/api-client'

export interface User {
  user_id: number
  email: string
  profile_name: string
  profile_picture?: string
  isKakaoUser: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  profile_name: string
  profile_picture?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CheckEmailResponse {
  exists: boolean
}

export const authService = {
  // 이메일/비밀번호 로그인
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/login', credentials)
    return data
  },

  // 회원가입
  signup: async (signupData: SignupData): Promise<any> => {
    const { data } = await apiClient.post('/signup', signupData)
    return data
  },

  // 이메일 중복 확인
  checkEmail: async (email: string): Promise<boolean> => {
    const { data } = await apiClient.post<CheckEmailResponse>('/check-email', { email })
    return data.exists
  },

  // 사용자 정보 가져오기
  getUser: async (userId: number): Promise<User> => {
    const { data } = await apiClient.get(`/user/${userId}`)
    return data
  },

  // 로그아웃 (클라이언트 측에서 토큰 제거)
  logout: () => {
    localStorage.removeItem('token')
  },
}
