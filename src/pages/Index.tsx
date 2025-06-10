
import React, { useEffect, memo } from "react";
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
import ChatSidebar from "../components/ChatSidebar";
import { ChatProvider, useChat } from "../contexts/ChatContext";
import { Language } from "../lib/translations";

interface IndexProps {
  lang: Language;
}

// Мемоизированные компоненты для предотвращения лишних ререндеров
const MemoizedNavbar = memo(Navbar);
const MemoizedHeroSection = memo(HeroSection);
const MemoizedAboutSection = memo(AboutSection);
const MemoizedVideoBackgroundSection = memo(VideoBackgroundSection);
const MemoizedAssistantSection = memo(AssistantSection);
const MemoizedServicesSection = memo(ServicesSection);
const MemoizedPartnersSection = memo(PartnersSection);
const MemoizedCasesSection = memo(CasesSection);
const MemoizedContactsSection = memo(ContactsSection);

const IndexContent: React.FC<IndexProps> = memo(({ lang = 'uk' }) => {
  const { isSidebarChatOpen, closeSidebarChat } = useChat();

  useEffect(() => {
    try {
      const title = lang === 'en' 
        ? "connexi.ai | AI solutions for business in Ukraine"
        : "connexi.ai | AI-рішення для бізнесу в Україні";
      document.title = title;
    } catch (error) {
      console.error('Error setting page title:', error);
    }
  }, [lang]);

  try {
    return (
      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full">
        <ScrollAnimation />
        <MemoizedNavbar lang={lang} />
        <MemoizedHeroSection lang={lang} />
        <MemoizedAboutSection className="bg-gray-900 text-white" lang={lang} />
        <MemoizedVideoBackgroundSection lang={lang} />
        <MemoizedAssistantSection className="bg-gray-900 text-white" lang={lang} />
        <MemoizedServicesSection className="bg-white text-gray-900" lang={lang} />
        <MemoizedPartnersSection className="bg-gray-900 text-white" lang={lang} />
        <MemoizedCasesSection className="bg-white text-gray-900" lang={lang} />
        <MemoizedContactsSection className="bg-gray-900 text-white" lang={lang} />
        
        <ChatSidebar 
          isOpen={isSidebarChatOpen} 
          onClose={closeSidebarChat}
          lang={lang}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering Index component:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error loading page. Check console for details.
      </div>
    );
  }
});

IndexContent.displayName = 'IndexContent';

const Index: React.FC<IndexProps> = memo(({ lang }) => {
  return (
    <ChatProvider>
      <IndexContent lang={lang} />
    </ChatProvider>
  );
});

Index.displayName = 'Index';

export default Index;
