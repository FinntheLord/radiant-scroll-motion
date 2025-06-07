
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isSidebarChatOpen, setIsSidebarChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openSidebarChat = () => {
    setIsSidebarChatOpen(true);
  };

  const closeSidebarChat = () => {
    setIsSidebarChatOpen(false);
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
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
      setIsLoading
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
