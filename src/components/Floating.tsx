import React, { useState, useEffect } from "react";
import Arrow from "../Icon/Arrow Purple.png";

const Floating: React.FC = () => {
  // 버튼의 가시성 여부를 저장하는 state
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트를 감지하여 배너가 화면에 보이는지 여부를 확인
  useEffect(() => {
    const handleScroll = () => {
      // 'banner' 클래스를 가진 요소를 선택
      const banner = document.querySelector(".banner");
      if (banner) {
        // 배너의 하단 위치를 계산
        const bannerBottom = banner.getBoundingClientRect().bottom;
        // 배너가 화면에 보이지 않으면(isVisible을 true로 설정)
        setIsVisible(bannerBottom < 0);
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 unmount될 때 이벤트 리스너 제거
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 페이지 최상단으로 스크롤 이동 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 버튼이 가시적이지 않을 때 컴포넌트를 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={scrollToTop}
        className="animate-bounce w-12 h-12 bg-white border border-scampi-200 shadow-md rounded-full flex items-center justify-center"
      >
        <img src={Arrow} className="-rotate-90 w-6 h-6" alt="Scroll to top" />
      </button>
    </div>
  );
};

export default Floating;
