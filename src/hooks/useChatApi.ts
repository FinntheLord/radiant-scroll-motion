
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
      console.log('=== ОТПРАВКА СООБЩЕНИЯ НА N8N ===');
      console.log('Сообщение:', message);
      console.log('Chat ID:', chatId);

      // Генерируем user id (можно заменить на реальный ID пользователя)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      const requestBody = {
        message: message,
        chat_id: chatId,
        user_id: userId
      };

      console.log('Тело запроса к n8n:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://n8n.srv838454.hstgr.cloud/webhook-test/84ac1eaf-efe6-4517-bc28-5b239286b274', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Ответ от n8n:', data);
      console.log('=== СООБЩЕНИЕ ОТПРАВЛЕНО УСПЕШНО ===');

    } catch (err) {
      console.error('=== ОШИБКА ОТПРАВКИ НА N8N ===');
      console.error('Полная ошибка:', err);
      
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
