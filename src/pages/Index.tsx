
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ScrollAnimation from "../components/ScrollAnimation";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "Ask IT | Системные ИТ-Решения";
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <ScrollAnimation />
      <Navbar />
      <HeroSection />
      <AboutSection />
      
      {/* More sections will be added here */}
      <div id="services" className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl text-white reveal-on-scroll">
          Услуги <span className="orange-highlight">(Будет добавлено позже)</span>
        </h2>
      </div>
    </div>
  );
};

export default Index;
