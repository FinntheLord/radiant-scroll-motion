
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
      console.log('=== ОТПРАВКА СООБЩЕНИЯ ===');
      console.log('Сообщение:', message);
      console.log('Chat ID:', chatId);
      console.log('URL webhook:', 'https://n8n.srv838454.hstgr.cloud/webhook-test/84ac1eaf-efe6-4517-bc28-5b239286b274');

      const requestBody = {
        messages: message,
        chatId: chatId,
        timestamp: Date.now()
      };

      console.log('Тело запроса:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://n8n.srv838454.hstgr.cloud/webhook-test/84ac1eaf-efe6-4517-bc28-5b239286b274', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Статус ответа:', response.status);
      console.log('Статус OK:', response.ok);
      console.log('Headers ответа:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Текст ошибки от сервера:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.text();
      console.log('Ответ от webhook:', responseData);
      console.log('=== СООБЩЕНИЕ ОТПРАВЛЕНО УСПЕШНО ===');

    } catch (err) {
      console.error('=== ОШИБКА ОТПРАВКИ ===');
      console.error('Полная ошибка:', err);
      console.error('Тип ошибки:', typeof err);
      console.error('Имя ошибки:', err instanceof Error ? err.name : 'Unknown');
      console.error('Сообщение ошибки:', err instanceof Error ? err.message : String(err));
      console.error('Stack trace:', err instanceof Error ? err.stack : 'No stack');
      
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
