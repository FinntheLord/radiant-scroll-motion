
import { useState, useCallback } from 'react';

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
      console.log('Отправка сообщения (заглушка):', { message, chatId });
      
      // Временная заглушка - все API вызовы удалены
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Сообщение отправлено (заглушка)');

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
