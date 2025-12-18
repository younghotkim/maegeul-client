// src/components/Contents.tsx
import React from "react";
import ImageSrc1 from "../Image/01.jpeg";
import ImageSrc2 from "../Image/02.jpeg";
import ImageSrc3 from "../Image/03.jpeg";
import ImageSrc4 from "../Image/04.jpeg";
import ArrowPurple from "../Icon/Arrow Purple.png";
import { Link } from "react-router-dom";

const Contents: React.FC = () => {
  const cardContents = [
    {
      title: "자기 계발",
      text: "더 단단한 나를 만드는 4가지 일상 실천 콘텐츠를 확인해보세요.",
      tag: [
        "독서하기",
        "외국어 배우기",
        "전공 공부하기",
        "버킷리스트 작성하여 실천하기",
        "봉사활동하기",
      ],
      src: ImageSrc1,
    },
    {
      title: "자기 관리",
      text: "더 단단한 나를 만드는 4가지 일상 실천 콘텐츠를 확인해보세요.",
      tag: [
        "일정한 시간에 잠자고 일어나기",
        "감사일기 쓰기",
        "옷,방 정리하기",
        "거울 보면서 웃기",
        "햇빛 쬐기",
        "명상·복식호흡하기",
        "반신욕",
      ],
      src: ImageSrc2,
    },
    {
      title: "취미 활동",
      text: "더 단단한 나를 만드는 4가지 일상 실천 콘텐츠를 확인해보세요.",
      tag: [
        "맛있는 음식 먹기",
        "영화,드라마,예능보기",
        "그림그리기",
        "색칠하기",
        "식물키우기",
        "여행가기",
        "음악,라디오듣기",
        "쇼핑하기",
      ],
      src: ImageSrc3,
    },
    {
      title: "건강",
      text: "더 단단한 나를 만드는 4가지 일상 실천 콘텐츠를 확인해보세요.",
      tag: [
        "스트레칭 하기",
        "운동하기",
        "댄스 춤추기",
        "건강식품 섭취하기",
        "체중조절하기",
      ],
      src: ImageSrc4,
    },
  ];

  // 사용자의 로그인 상태를 확인하기 위해 isLoggedIn 변수를 추가
  const isLoggedIn = !!sessionStorage.getItem("token");

  return (
    <>
      {/* 카드 컨텐츠 섹션 */}
      <section className="py-16 flex justify-center bg-white">
        <div className="max-w-[1140px] w-full">
          <h2
            className="text-center text-blue-950 text-4xl font-extrabold font-plus-jakarta-sans
          dark:text-white  leading-10 mb-4"
          >
            마음돌봄 머글을 위한 루틴추천
          </h2>
          <p className="text-sm text-scampi-500 dark:text-slate-500 mb-8 text-center">
            감정 기록을 바탕으로 요즘 나에게 필요한 감정 돌봄 습관과
            <br />
            자기돌봄 루틴 콘텐츠를 추천해드릴게요.
          </p>
          <div className="grid grid-cols-2 gap-[26px]">
            {cardContents.map((content, index) => (
              <Card
                key={index}
                title={content.title}
                text={content.text}
                tag={content.tag}
                src={content.src}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 매글에서 지금 바로 시작해보세요 섹션 */}
      <section className="w-full flex justify-center items-center py-16 bg-white">
        <div className="Cta2 max-w-[1140px] mx-auto justify-center items-start flex">
          <div className="Contain grow shrink basis-0 h-20 justify-center items-center gap-10 flex">
            <span
              className="text-blue-950 text-4xl font-extrabold font-plus-jakarta-sans 
            dark:text-white leading-10"
            >
              나를 돌보는 하루 5분 마음챙김
              <br />
              매글에서 지금 바로 시작해보세요.
            </span>
            <div className="bg-white grow shrink basis-0 h-14 justify-end items-center gap-4 flex">
              <Link to={isLoggedIn ? "/mainsignup" : "/mainsignup"}>
                <div
                  className="Button flex border border-indigo-600 rounded-xl justify-center items-center gap-2.5 "
                  style={{ width: "171px", height: "56px" }}
                >
                  <div
                    className="Text text-indigo-600 text-sm font-bold font-plus-jakarta-sans 
                  dark:text-white leading-normal "
                  >
                    {isLoggedIn ? "글 쓰러 가기" : "지금 바로 시작하기"}
                  </div>
                </div>
              </Link>
              <Link to={isLoggedIn ? "/dashboard" : "/mainsignup"}>
                <div
                  className="Button bg-indigo-600 rounded-xl flex justify-center items-center gap-2.5"
                  style={{ width: "171px", height: "56px" }}
                >
                  <div className="Text text-white text-sm font-bold font-plus-jakarta-sans leading-normal">
                    {isLoggedIn ? "마이매글" : "회원 가입 하기"}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

interface CardProps {
  title: string;
  text: string;
  tag: string[];
  src: string;
}

const Card: React.FC<CardProps> = ({ title, text, tag, src }) => {
  return (
    <div className="w-[553px] h-[293px] relative group overflow-hidden rounded-md">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-500 group-hover:opacity-0" />
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white transition-opacity duration-500 group-hover:opacity-0">
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm">{text}</p>
        </div>
        <button className="self-start text-lg py-2 px-6 rounded-full mt-4 hover:bg-white hover:text-black transition-colors duration-300">
          Learn more
          <img
            src={ArrowPurple}
            alt="Arrow Icon"
            className="inline-block ml-2 w-4 h-4"
          />
        </button>
      </div>
      <div className="absolute inset-0 flex flex-col justify-between p-6 bg-fecaca text-scampi-900 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {tag.map((t, index) => (
              <span
                key={index}
                className="text-xs bg-white py-1 px-3 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <button className="self-start text-lg py-2 px-6 rounded-lg mt-4 bg-white text-scampi-900 hover:bg-indigo-600 hover:text-white transition-colors duration-300">
          콘텐츠 탐색하기
          <img
            src={ArrowPurple}
            alt="Arrow Icon"
            className="inline-block ml-2 w-4 h-4"
          />
        </button>
      </div>
    </div>
  );
};

export default Contents;
