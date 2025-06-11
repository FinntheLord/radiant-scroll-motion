
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewChat } from './NewChat';
import { Language } from '@/lib/translations';

interface NewChatButtonProps {
  lang: Language;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({ lang }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full contact-button shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <NewChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        lang={lang}
      />
    </>
  );
};
