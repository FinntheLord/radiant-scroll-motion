
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseChatPollingProps {
  chatId: string;
  onNewMessage: (message: string) => void;
  isEnabled: boolean;
}

export const useChatPolling = ({ chatId, onNewMessage, isEnabled }: UseChatPollingProps) => {
  const [isPolling, setIsPolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef<number>(0);
  const maxPollsRef = useRef<number>(12); // Максимум 12 попыток (60 секунд)

  const checkForResponse = useCallback(async () => {
    if (!isEnabled || !chatId) return;

    // Ограничиваем количество попыток
    if (pollCountRef.current >= maxPollsRef.current) {
      console.log('Достигнут лимит попыток опроса, останавливаем');
      setIsPolling(false);
      return;
    }

    pollCountRef.current++;

    try {
      console.log(`Проверка ответа (попытка ${pollCountRef.current}/${maxPollsRef.current})`);
      
      const { data, error } = await supabase.functions.invoke('receive-chat-response', {
        body: { 
          chatId: chatId
        }
      });

      if (error) {
        console.error('Ошибка при проверке ответа:', error);
        return;
      }

      if (data && data.success && data.message) {
        console.log('Получен ответ от AI');
        onNewMessage(data.message);
        
        // Останавливаем опрос после получения ответа
        setIsPolling(false);
        pollCountRef.current = 0;
        return;
      }

      // Планируем следующую проверку через 5 секунд
      timeoutRef.current = setTimeout(checkForResponse, 5000);
      
    } catch (err) {
      console.error('Ошибка при опросе:', err);
      // В случае ошибки тоже планируем следующую попытку
      timeoutRef.current = setTimeout(checkForResponse, 5000);
    }
  }, [chatId, onNewMessage, isEnabled]);

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
    timeoutRef.current = setTimeout(checkForResponse, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsPolling(false);
      pollCountRef.current = 0;
    };
  }, [checkForResponse, isEnabled]);

  return { isPolling };
};
