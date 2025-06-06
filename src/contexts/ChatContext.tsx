
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isSidebarChatOpen: boolean;
  openSidebarChat: () => void;
  closeSidebarChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isSidebarChatOpen, setIsSidebarChatOpen] = useState(false);

  const openSidebarChat = () => {
    setIsSidebarChatOpen(true);
  };

  const closeSidebarChat = () => {
    setIsSidebarChatOpen(false);
  };

  return (
    <ChatContext.Provider value={{ 
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
