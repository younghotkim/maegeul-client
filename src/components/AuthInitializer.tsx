/**
 * 인증 상태는 zustand persist가 localStorage에서 자동 복원
 * 이 컴포넌트는 필요시 토큰 유효성 검증용으로 사용 가능
 */
export function AuthInitializer() {
  // zustand persist가 자동으로 localStorage에서 복원하므로
  // 별도 초기화 로직 불필요
  return null
}
