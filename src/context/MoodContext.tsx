import React, { createContext, useContext, useState, ReactNode } from "react";

// Context 타입 정의
interface MoodContextType {
  pleasantness: number;
  energy: number;
  setPleasantness: (value: number) => void;
  setEnergy: (value: number) => void;
}

// 기본값 설정
const MoodContext = createContext<MoodContextType | undefined>(undefined);

// 커스텀 훅: MoodContext 값을 가져오기 위한 훅
export const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMoodContext must be used within a MoodProvider");
  }
  return context;
};

// Provider 컴포넌트
export const MoodProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pleasantness, setPleasantness] = useState<number>(1); // 기본값 1
  const [energy, setEnergy] = useState<number>(1); // 기본값 1

  return (
    <MoodContext.Provider
      value={{
        pleasantness,
        energy,
        setPleasantness,
        setEnergy,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};
