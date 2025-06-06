
import React from "react";
import { Language } from "../lib/translations";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import AssistantSection from "../components/AssistantSection";
import ServicesSection from "../components/ServicesSection";
import PartnersSection from "../components/PartnersSection";
import CasesSection from "../components/CasesSection";
import ContactsSection from "../components/ContactsSection";
import VideoBackgroundSection from "../components/VideoBackgroundSection";
import { useEffect } from "react";
import { useSiteChat } from "../contexts/SiteChatContext";
import SiteChatDrawer from "../components/SiteChatDrawer";

interface IndexProps {
  lang: Language;
}

const Index: React.FC<IndexProps> = ({ lang }) => {
  const { isChatOpen, closeChat } = useSiteChat();

  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        const isVisible = 
          (elementTop >= 0 && elementTop <= window.innerHeight * 0.8) || 
          (elementBottom >= window.innerHeight * 0.2 && elementBottom <= window.innerHeight);

        if (isVisible) {
          element.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style jsx>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .reveal-on-scroll.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <Navbar lang={lang} />
      <VideoBackgroundSection lang={lang} />
      <div className="relative z-10">
        <HeroSection lang={lang} />
        <AboutSection lang={lang} />
        <AssistantSection lang={lang} />
        <ServicesSection lang={lang} />
        <PartnersSection lang={lang} />
        <CasesSection lang={lang} />
        <ContactsSection lang={lang} />
      </div>
      
      <SiteChatDrawer 
        isOpen={isChatOpen}
        onClose={closeChat}
        lang={lang}
      />
    </div>
  );
};

export default Index;
