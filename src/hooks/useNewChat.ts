
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useNewChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  // Генерируем уникальный chatId
  const [chatId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Отправка сообщения:', { message, chatId });
      
      // Отправляем сообщение через новую edge function
      const { error: functionError } = await supabase.functions.invoke('chat-handler', {
        body: { message, chatId }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Ошибка отправки сообщения');
      }

      console.log('Сообщение отправлено успешно');

    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  // Подписка на realtime обновления
  useEffect(() => {
    console.log('Настройка realtime подписки для chatId:', chatId);
    
    if (channelRef.current) {
      console.log('Канал уже существует, пропускаем');
      return;
    }

    const channel = supabase
      .channel('new-chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log('Новое сообщение получено:', payload.new);
          const newMessage: ChatMessage = {
            id: payload.new.id,
            content: payload.new.message,
            role: payload.new.role as 'user' | 'assistant',
            timestamp: new Date(payload.new.created_at)
          };
          
          setMessages(prev => {
            // Проверяем, нет ли уже такого сообщения
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
    chatId
  };
};
