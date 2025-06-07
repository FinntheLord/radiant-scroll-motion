
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { Language } from '../lib/translations';

interface ChatContextType {
  isSidebarChatOpen: boolean;
  openSidebarChat: () => void;
  closeSidebarChat: () => void;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isInitialized: boolean;
  initializeChat: (lang: Language) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isSidebarChatOpen, setIsSidebarChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const openSidebarChat = () => {
    setIsSidebarChatOpen(true);
  };

  const closeSidebarChat = () => {
    setIsSidebarChatOpen(false);
  };

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = () => {
    setMessages([]);
    setIsInitialized(false);
  };

  const initializeChat = useCallback((lang: Language) => {
    if (isInitialized) return;
    
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      content: lang === 'en' 
        ? 'Hello! I\'m here to help you with AI solutions for your business. What questions do you have?'
        : 'Привіт! Я тут, щоб допомогти вам з AI-рішеннями для вашого бізнесу. Які у вас питання?',
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setIsInitialized(true);
  }, [isInitialized]);

  return (
    <ChatContext.Provider value={{ 
      isSidebarChatOpen,
      openSidebarChat,
      closeSidebarChat,
      messages,
      addMessage,
      clearMessages,
      isLoading,
      setIsLoading,
      isInitialized,
      initializeChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
