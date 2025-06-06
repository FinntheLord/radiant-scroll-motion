
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import VideoBackgroundSection from "../components/VideoBackgroundSection";
import AssistantSection from "../components/AssistantSection";
import ServicesSection from "../components/ServicesSection";
import PartnersSection from "../components/PartnersSection";
import CasesSection from "../components/CasesSection";
import ContactsSection from "../components/ContactsSection";
import ScrollAnimation from "../components/ScrollAnimation";
import { Language } from "../lib/translations";

interface IndexProps {
  lang: Language;
}

const Index: React.FC<IndexProps> = ({ lang = 'uk' }) => {
  useEffect(() => {
    console.log('Index component mounted with lang:', lang);
    // Set page title based on language
    const title = lang === 'en' 
      ? "connexi.ai | AI solutions for business in Ukraine"
      : "connexi.ai | AI-рішення для бізнесу в Україні";
    document.title = title;
  }, [lang]);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full">
      <ScrollAnimation />
      <Navbar lang={lang} />
      <HeroSection lang={lang} />
      <AboutSection className="bg-gray-900 text-white" lang={lang} />
      <VideoBackgroundSection lang={lang} />
      <AssistantSection className="bg-gray-900 text-white" lang={lang} />
      <ServicesSection className="bg-white text-gray-900" lang={lang} />
      <PartnersSection className="bg-gray-900 text-white" lang={lang} />
      <CasesSection className="bg-white text-gray-900" lang={lang} />
      <ContactsSection className="bg-gray-900 text-white" lang={lang} />
    </div>
  );
};

export default Index;
