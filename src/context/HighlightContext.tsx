import React, { createContext, useContext, useState, ReactNode } from "react";

// Context에서 관리할 상태 타입 정의
interface HighlightContextType {
  highlightedLabels: string[];
  setHighlightedLabels: (labels: string[]) => void;
  highlightedColor: string | null;
  setHighlightedColor: (color: string | null) => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(
  undefined
);

export const useHighlightContext = () => {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error(
      "useHighlightContext must be used within a HighlightProvider"
    );
  }
  return context;
};

export const HighlightProvider = ({ children }: { children: ReactNode }) => {
  const [highlightedLabels, setHighlightedLabels] = useState<string[]>([]);
  const [highlightedColor, setHighlightedColor] = useState<string | null>(null); // highlightedColor 추가

  return (
    <HighlightContext.Provider
      value={{
        highlightedLabels,
        setHighlightedLabels,
        highlightedColor,
        setHighlightedColor,
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
};
