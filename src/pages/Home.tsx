// src/pages/Home.tsx
import React from "react";
import Header from "../components/Header";
import Contents from "../components/Contents";
import Banner from "../components/Banner";
import How from "../components/How";
import Feature from "../components/Feature";
import Numbers from "../components/Numbers";
import Footer from "../components/Footer";
import Floating from "../components/Floating";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Banner className="banner" />
      <Numbers />
      <Feature />
      <How />
      <Contents />
      <Footer />
      <Floating />
    </>
  );
};

export default Home;
