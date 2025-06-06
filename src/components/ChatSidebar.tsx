
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssistantChat from "./AssistantChat";
import { Language } from "../lib/translations";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-gray-900 border-l border-gray-800 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img
              src="/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"
              alt="AI Assistant"
              className="h-8 w-8 rounded-full opacity-90"
            />
            <div>
              <h2 className="text-lg font-semibold text-white">
                {lang === 'en' ? 'AI Assistant' : 'AI-Помічник'}
              </h2>
              <p className="text-sm text-white/60">
                {lang === 'en' ? 'Ask questions about our AI solutions' : 'Запитайте про наші AI-рішення'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Content */}
        <div className="h-[calc(100%-80px)] p-4">
          <div className="h-full">
            <AssistantChat lang={lang} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
