
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
      console.log('Sending message to n8n webhook:', { message, chatId });

      const response = await fetch('https://n8n.srv838454.hstgr.cloud/webhook-test/84ac1eaf-efe6-4517-bc28-5b239286b274', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: message,
          chatId: chatId,
          timestamp: Date.now()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Message sent successfully to n8n');
    } catch (err) {
      console.error('Error sending message to n8n:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
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
