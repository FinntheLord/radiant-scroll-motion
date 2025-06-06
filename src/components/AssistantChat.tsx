
import React from "react";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Language } from "../lib/translations";
import { useSiteChat } from "../contexts/SiteChatContext";

interface AssistantChatProps {
  lang: Language;
}

const AssistantChat: React.FC<AssistantChatProps> = ({ lang }) => {
  const { openChat } = useSiteChat();

  return (
    <div className="h-[500px] border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-lg flex flex-col overflow-hidden shadow-xl reveal-on-scroll">
      <div className="flex items-center gap-2 p-3 border-b border-gray-800">
        <div className="size-3 rounded-full bg-red-500"></div>
        <div className="size-3 rounded-full bg-yellow-500"></div>
        <div className="size-3 rounded-full bg-green-500"></div>
        <div className="ml-2 text-sm font-medium text-white/70 flex items-center gap-2">
          <img
            src="/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"
            alt="AI Animation"
            className="h-4 w-4 rounded opacity-90"
          />
          Connexi AI Assistant
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <img
          src="/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"
          alt="AI Assistant"
          className="w-24 h-24 mb-6"
        />
        <h3 className="text-xl font-bold mb-4 text-center">
          {lang === 'uk' ? 'Спілкуйтеся з нашим AI-помічником' : 'Talk to our AI Assistant'}
        </h3>
        <p className="text-center text-gray-400 mb-6 max-w-sm">
          {lang === 'uk' 
            ? 'Отримайте миттєві відповіді на ваші питання про AI-рішення та як вони можуть допомогти вашому бізнесу'
            : 'Get instant answers to your questions about AI solutions and how they can help your business'}
        </p>
        <Button 
          onClick={openChat} 
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 ml-auto gap-1.5 text-white"
        >
          {lang === 'uk' ? 'Почати спілкування' : 'Start Chatting'}
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default AssistantChat;
