
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<number>(0);
  const pollCountRef = useRef<number>(0);
  const maxPollsRef = useRef<number>(6); // Максимум 6 попыток (30 секунд)

  const checkForNewMessages = useCallback(async () => {
    if (!isEnabled || !userId || !chatId) return;

    // Ограничиваем количество попыток
    if (pollCountRef.current >= maxPollsRef.current) {
      console.log('Достигнут лимит попыток опроса, останавливаем');
      setIsPolling(false);
      return;
    }

    // Увеличиваем интервал между запросами с каждой попыткой
    const now = Date.now();
    const minInterval = Math.min(5000 + (pollCountRef.current * 2000), 15000); // От 5 до 15 секунд
    
    if (now - lastCheckRef.current < minInterval) return;
    lastCheckRef.current = now;
    pollCountRef.current++;

    try {
      console.log(`Проверка сообщений (попытка ${pollCountRef.current}/${maxPollsRef.current})`);
      
      const { data, error } = await supabase.functions.invoke('chat-with-openai', {
        body: { 
          checkMessages: true,
          userId: userId,
          chatId: chatId
        }
      });

      if (error) {
        console.error('Ошибка при проверке сообщений:', error);
        return;
      }

      if (data && data.success && data.type === 'ai_response' && data.message) {
        const newMessage: ChatMessage = {
          id: data.messageId || `assistant-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          content: data.message,
          role: 'assistant',
          timestamp: new Date()
        };
        
        console.log('Получено новое сообщение от AI');
        onNewMessage(newMessage);
        
        // Останавливаем опрос после получения сообщения
        setIsPolling(false);
        pollCountRef.current = 0;
        return;
      }

      // Планируем следующую проверку с увеличивающимся интервалом
      const nextInterval = Math.min(5000 + (pollCountRef.current * 2000), 15000);
      timeoutRef.current = setTimeout(checkForNewMessages, nextInterval);
      
    } catch (err) {
      console.error('Ошибка при опросе:', err);
      // В случае ошибки тоже увеличиваем интервал
      const nextInterval = Math.min(8000 + (pollCountRef.current * 2000), 20000);
      timeoutRef.current = setTimeout(checkForNewMessages, nextInterval);
    }
  }, [userId, chatId, onNewMessage, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsPolling(false);
      pollCountRef.current = 0;
      return;
    }

    setIsPolling(true);
    pollCountRef.current = 0;
    
    // Начинаем с первой проверки через 3 секунды
    timeoutRef.current = setTimeout(checkForNewMessages, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsPolling(false);
      pollCountRef.current = 0;
    };
  }, [checkForNewMessages, isEnabled]);

  return { isPolling };
};
