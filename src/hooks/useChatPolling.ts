
import { useState, useEffect, useCallback } from 'react';
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

  const checkForNewMessages = useCallback(async () => {
    if (!isEnabled || !userId || !chatId) return;

    try {
      console.log('Checking for new messages for chat:', chatId);
      
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

      console.log('Polling response:', data);

      if (data && data.success && data.type === 'ai_response' && data.message) {
        console.log('Received new AI message from polling:', data.message);
        
        const newMessage: ChatMessage = {
          id: data.messageId || `assistant-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          content: data.message,
          role: 'assistant',
          timestamp: new Date()
        };
        
        onNewMessage(newMessage);
      } else {
        console.log('No new messages found');
      }
    } catch (err) {
      console.error('Error in polling:', err);
    }
  }, [userId, chatId, onNewMessage, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    
    // Проверяем сразу
    checkForNewMessages();
    
    // Затем проверяем каждые 2 секунды
    const interval = setInterval(checkForNewMessages, 2000);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [checkForNewMessages, isEnabled]);

  return { isPolling };
};
