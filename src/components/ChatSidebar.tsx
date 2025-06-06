
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
  return (
    <>
      {/* Overlay with smooth fade */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar with smooth slide animation */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-gray-900 border-l border-gray-800 z-50 transform transition-all duration-700 ease-in-out ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-connexi-orange/20 to-connexi-pink/20 blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-gradient-to-br from-connexi-pink/15 to-connexi-orange/15 blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-72 right-16 w-16 h-16 rounded-full bg-gradient-to-br from-connexi-orange/25 to-connexi-pink/25 blur-md animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
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
            className="text-white/70 hover:text-white hover:bg-gray-800 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Content with improved mobile layout */}
        <div className="h-[calc(100vh-80px)] md:h-[calc(100%-80px)] p-4 overflow-hidden relative z-10">
          <div className="h-full overflow-hidden">
            <AssistantChat lang={lang} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
