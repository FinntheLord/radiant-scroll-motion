
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
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
  initializeWelcomeMessage: (lang: Language) => void;
  userId: string;
  chatId: string;
  setUserId: (id: string) => void;
  setChatId: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

// Функция для генерации уникального ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isSidebarChatOpen, setIsSidebarChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(() => `user_${generateId()}`);
  const [chatId, setChatId] = useState(() => `chat_${generateId()}`);
  const welcomeMessageInitialized = useRef(false);

  const openSidebarChat = () => {
    setIsSidebarChatOpen(true);
  };

  const closeSidebarChat = () => {
    setIsSidebarChatOpen(false);
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => {
      // Проверяем, нет ли уже сообщения с таким же содержимым и ролью
      const isDuplicate = prev.some(existingMessage => 
        existingMessage.content === message.content && 
        existingMessage.role === message.role &&
        Math.abs(existingMessage.timestamp.getTime() - message.timestamp.getTime()) < 1000
      );
      
      if (isDuplicate) {
        console.log('Duplicate message detected, skipping:', message.content);
        return prev;
      }
      
      console.log('Adding new message:', message);
      return [...prev, message];
    });
  };

  const clearMessages = () => {
    setMessages([]);
    welcomeMessageInitialized.current = false;
    // Генерируем новые ID для нового чата
    setUserId(`user_${generateId()}`);
    setChatId(`chat_${generateId()}`);
  };

  const initializeWelcomeMessage = (lang: Language) => {
    if (!welcomeMessageInitialized.current && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome-message',
        content: lang === 'en' 
          ? 'Hello! I\'m here to help you with AI solutions for your business. What questions do you have?'
          : 'Привіт! Я тут, щоб допомогти вам з AI-рішеннями для вашого бізнесу. Які у вас питання?',
        role: 'assistant',
        timestamp: new Date()
      };
      addMessage(welcomeMessage);
      welcomeMessageInitialized.current = true;
    }
  };

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
      initializeWelcomeMessage,
      userId,
      chatId,
      setUserId,
      setChatId
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
