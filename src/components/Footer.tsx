// src/components/Footer.tsx
import React from "react";
import Maegeul from "../Icon/Brand Logo_web ver. (v.1.0) (24.09.22) 1.png";

const Footer: React.FC = () => {
  return (
    <section className="w-full flex justify-center items-center py-16 bg-white">
      <div className="max-w-[1150px] mx-auto justify-center items-center flex flex-col ">
        <div className="Frame1000005143 justify-start items-center gap-2 inline-flex">
          <button className="flex justify-center items-center bg-transparent  text-indigo-950 text-l font-extrabold font-['Ubuntu Sans'] dark:text-scampi-200 rounded-full dark:hover:bg-scampi-700 cursor-pointer transition-colors font-bold w-36 h-12 justify-center">
            <img src={Maegeul} />
          </button>
        </div>
        <div className="Frame2 flex-col justify-start items-center gap-6 flex">
          <div className="MenuCategories justify-center items-center gap-12 inline-flex">
            <div className="text-center text-slate-500 text-sm font-medium font-plus-jakarta-sans leading-normal">
              Address. 서울특별시 강남구 역삼로 160
            </div>
            <div className="text-center text-slate-500 text-sm font-medium font-plus-jakarta-sans leading-normal">
              Tel. 070-4112-2308
            </div>
          </div>
          <div className=" text-center text-slate-500 text-sm font-medium font-plus-jakarta-sans leading-loose">
            Copyright © Litme Team. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
