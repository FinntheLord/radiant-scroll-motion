
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string, 
    chatId: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Отправка сообщения через edge function:', { message, chatId });
      
      // Отправляем сообщение через edge function в n8n
      const { data, error } = await supabase.functions.invoke('send-to-n8n', {
        body: { message, chatId }
      });

      if (error) {
        console.error('Ошибка отправки через edge function:', error);
        throw new Error(error.message || 'Ошибка отправки сообщения');
      }

      console.log('Сообщение успешно отправлено:', data);

    } catch (err) {
      console.error('Ошибка отправки:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка при отправке сообщения';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
