
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language } from '../lib/translations';

interface SiteChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  language: Language;
}

const SiteChatContext = createContext<SiteChatContextType | undefined>(undefined);

interface SiteChatProviderProps {
  children: ReactNode;
  language: Language;
}

export const SiteChatProvider: React.FC<SiteChatProviderProps> = ({ children, language }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen(prev => !prev);

  return (
    <SiteChatContext.Provider value={{ isChatOpen, openChat, closeChat, toggleChat, language }}>
      {children}
    </SiteChatContext.Provider>
  );
};

export const useSiteChat = (): SiteChatContextType => {
  const context = useContext(SiteChatContext);
  if (!context) {
    throw new Error('useSiteChat must be used within a SiteChatProvider');
  }
  return context;
};
