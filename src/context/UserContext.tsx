import React, { createContext, useState, useContext, ReactNode } from "react";

// 사용자 정보 타입 정의
interface User {
  user_id: number | null;
  email: string | null;
  profile_name: string | null;
  profile_picture?: string | null; // 프로필 이미지 경로 추가
  isKakaoUser: boolean;
}

// Context의 타입 정의
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// UserContext 생성 (초기값 null로 설정)
const UserContext = createContext<UserContextType | null>(null);

// UserProvider 컴포넌트
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // 사용자 상태 관리

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 커스텀 Hook으로 UserContext 사용
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
