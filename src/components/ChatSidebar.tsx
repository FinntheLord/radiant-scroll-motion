
import React, { useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { Language } from "../lib/translations";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose, lang }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: lang === 'en' 
        ? 'Hello! I\'m here to help you with AI solutions for your business. What questions do you have?'
        : 'Привіт! Я тут, щоб допомогти вам з AI-рішеннями для вашого бізнесу. Які у вас питання?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Симуляція API відповіді
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: lang === 'en' 
            ? 'Thank you for your question! Our AI specialists will help you implement artificial intelligence solutions to optimize your business processes. Would you like to schedule a consultation?'
            : 'Дякую за ваше питання! Наші AI-спеціалісти допоможуть вам впровадити рішення штучного інтелекту для оптимізації бізнес-процесів. Хочете записатися на консультацію?',
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
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
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-connexi-orange to-connexi-pink flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
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

        {/* Chat Content */}
        <div className="h-[calc(100vh-80px)] md:h-[calc(100%-80px)] flex flex-col relative z-10">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ChatMessageList smooth>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.role === 'user' ? 'sent' : 'received'}
                >
                  {message.role === 'assistant' && (
                    <ChatBubbleAvatar 
                      fallback="AI"
                      className="bg-gradient-to-br from-connexi-orange to-connexi-pink"
                    />
                  )}
                  <ChatBubbleMessage variant={message.role === 'user' ? 'sent' : 'received'}>
                    {message.content}
                  </ChatBubbleMessage>
                  {message.role === 'user' && (
                    <ChatBubbleAvatar 
                      fallback="Ви" 
                      className="bg-blue-600"
                    />
                  )}
                </ChatBubble>
              ))}
              {isLoading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar 
                    fallback="AI"
                    className="bg-gradient-to-br from-connexi-orange to-connexi-pink"
                  />
                  <ChatBubbleMessage variant="received" isLoading />
                </ChatBubble>
              )}
            </ChatMessageList>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-connexi-orange transition-colors">
                <ChatInput
                  placeholder={lang === 'en' ? 'Ask about AI solutions...' : 'Запитайте про AI-рішення...'}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onSend={handleSendMessage}
                  disabled={isLoading}
                  className="text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="contact-button h-12 w-12 rounded-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
