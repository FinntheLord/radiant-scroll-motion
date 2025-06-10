
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '../types/chat';

interface UseChatPollingProps {
  userId: string;
  chatId: string;
  onNewMessage: (message: ChatMessage) => void;
  isEnabled: boolean;
}

export const useChatPolling = ({ userId, chatId, onNewMessage, isEnabled }: UseChatPollingProps) => {
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<number>(0);

  const checkForNewMessages = useCallback(async () => {
    if (!isEnabled || !userId || !chatId) return;

    // Throttle requests - minimum 3 seconds between checks
    const now = Date.now();
    if (now - lastCheckRef.current < 3000) return;
    lastCheckRef.current = now;

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-openai', {
        body: { 
          checkMessages: true,
          userId: userId,
          chatId: chatId
        }
      });

      if (error) {
        console.error('Error checking for messages:', error);
        return;
      }

      if (data && data.success && data.type === 'ai_response' && data.message) {
        const newMessage: ChatMessage = {
          id: data.messageId || `assistant-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          content: data.message,
          role: 'assistant',
          timestamp: new Date()
        };
        
        onNewMessage(newMessage);
      }
    } catch (err) {
      console.error('Error in polling:', err);
    }
  }, [userId, chatId, onNewMessage, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    
    // Check immediately
    checkForNewMessages();
    
    // Then check every 5 seconds (reduced from 2 seconds)
    intervalRef.current = setInterval(checkForNewMessages, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
    };
  }, [checkForNewMessages, isEnabled]);

  return { isPolling };
};
