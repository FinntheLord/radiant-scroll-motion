
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../lib/translations';

interface SimpleChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const SimpleChatContext = createContext<SimpleChatContextType | undefined>(undefined);

interface SimpleChatProviderProps {
  children: ReactNode;
}

export const SimpleChatProvider: React.FC<SimpleChatProviderProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <SimpleChatContext.Provider value={{ 
      isChatOpen,
      openChat,
      closeChat
    }}>
      {children}
    </SimpleChatContext.Provider>
  );
};

export const useSimpleChatContext = () => {
  const context = useContext(SimpleChatContext);
  if (context === undefined) {
    throw new Error('useSimpleChatContext must be used within a SimpleChatProvider');
  }
  return context;
};
