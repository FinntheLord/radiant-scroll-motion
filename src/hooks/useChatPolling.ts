
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseChatPollingProps {
  chatId: string;
  onNewMessage: (message: string) => void;
  onTimeout: () => void;
  isEnabled: boolean;
}

export const useChatPolling = ({ chatId, onNewMessage, onTimeout, isEnabled }: UseChatPollingProps) => {
  const [isPolling, setIsPolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const TIMEOUT_DURATION = 60000; // 1 минута в миллисекундах

  const checkForResponse = useCallback(async () => {
    if (!isEnabled || !chatId) return;

    // Проверяем, не истекло ли время ожидания
    const currentTime = Date.now();
    if (currentTime - startTimeRef.current >= TIMEOUT_DURATION) {
      console.log('=== TIMEOUT: ПРЕВЫШЕН ЛИМИТ ОЖИДАНИЯ (60 секунд) ===');
      setIsPolling(false);
      pollCountRef.current = 0;
      onTimeout();
      return;
    }

    pollCountRef.current++;

    try {
      console.log(`=== ПРОВЕРКА ОТВЕТА (попытка ${pollCountRef.current}) ===`);
      console.log('Chat ID для проверки:', chatId);
      console.log('Время ожидания:', Math.round((currentTime - startTimeRef.current) / 1000), 'секунд');
      
      const requestBody = { chatId: chatId };
      console.log('Тело запроса к Supabase:', JSON.stringify(requestBody, null, 2));

      const { data, error } = await supabase.functions.invoke('receive-chat-response', {
        body: requestBody
      });

      console.log('Ответ от Supabase функции:');
      console.log('- data:', data);
      console.log('- error:', error);

      if (error) {
        console.error('=== ОШИБКА ПРИ ПРОВЕРКЕ ОТВЕТА ===');
        console.error('Полная ошибка:', error);
        console.error('Сообщение ошибки:', error.message);
        
        // Планируем следующую попытку даже при ошибке (если не истек timeout)
        timeoutRef.current = setTimeout(checkForResponse, 3000);
        return;
      }

      if (data && data.success && data.message) {
        console.log('=== ПОЛУЧЕН ОТВЕТ ОТ AI ===');
        console.log('Сообщение от AI:', data.message);
        onNewMessage(data.message);
        
        // Останавливаем опрос после получения ответа
        setIsPolling(false);
        pollCountRef.current = 0;
        return;
      }

      console.log('Ответ еще не готов, планируем следующую проверку через 3 секунды');
      // Планируем следующую проверку через 3 секунды
      timeoutRef.current = setTimeout(checkForResponse, 3000);
      
    } catch (err) {
      console.error('=== КРИТИЧЕСКАЯ ОШИБКА ПРИ ОПРОСЕ ===');
      console.error('Полная ошибка:', err);
      
      // В случае ошибки тоже планируем следующую попытку
      timeoutRef.current = setTimeout(checkForResponse, 3000);
    }
  }, [chatId, onNewMessage, onTimeout, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      console.log('=== ОСТАНОВКА ОПРОСА ===');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsPolling(false);
      pollCountRef.current = 0;
      return;
    }

    console.log('=== НАЧАЛО ОПРОСА ===');
    console.log('Chat ID:', chatId);
    setIsPolling(true);
    pollCountRef.current = 0;
    startTimeRef.current = Date.now();
    
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
