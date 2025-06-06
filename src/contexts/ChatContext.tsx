
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  openSidebarChat: () => void;
  isSidebarChatOpen: boolean;
  closeSidebarChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isSidebarChatOpen, setIsSidebarChatOpen] = useState(false);

  const openChat = () => {
    // Открываем Chatra чат
    if (window.Chatra) {
      window.Chatra('openChat', true);
    }
  };

  const closeChat = () => {
    // Закрываем Chatra чат
    if (window.Chatra) {
      window.Chatra('openChat', false);
    }
  };

  const openSidebarChat = () => {
    setIsSidebarChatOpen(true);
  };

  const closeSidebarChat = () => {
    setIsSidebarChatOpen(false);
  };

  return (
    <ChatContext.Provider value={{ 
      isChatOpen: false, // Chatra управляет своим состоянием
      openChat, 
      closeChat,
      isSidebarChatOpen,
      openSidebarChat,
      closeSidebarChat
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

// Добавляем типы для Chatra
declare global {
  interface Window {
    Chatra?: (action: string, value?: boolean) => void;
    ChatraID?: string;
  }
}
