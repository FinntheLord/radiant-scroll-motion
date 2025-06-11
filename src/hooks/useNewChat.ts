
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useNewChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: `${role}-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      content,
      role,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const sendMessage = useCallback(async (message: string, chatId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Отправка сообщения:', { message, chatId });

      // Сохраняем сообщение пользователя в базу данных
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          message: message,
          role: 'user'
        });

      if (insertError) {
        throw new Error(`Ошибка сохранения сообщения: ${insertError.message}`);
      }

      // Отправляем сообщение на n8n
      const { data: sendData, error: sendError } = await supabase.functions.invoke('chat-api', {
        body: {
          action: 'send',
          chatId: chatId,
          userMessage: message
        }
      });

      if (sendError) {
        throw new Error(`Ошибка отправки: ${sendError.message}`);
      }

      console.log('✅ Сообщение отправлено:', sendData);

    } catch (err) {
      console.error('💥 Ошибка:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      addMessage(`Ошибка: ${errorMessage}`, 'assistant');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Подписка на realtime обновления для получения ответов от AI
  useEffect(() => {
    const channel = supabase
      .channel('chat-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('📥 Получено новое сообщение через realtime:', payload);
          
          const newMessage = payload.new as any;
          if (newMessage.role === 'assistant') {
            // Добавляем сообщение от AI в чат
            addMessage(newMessage.message, 'assistant');
          } else if (newMessage.role === 'user') {
            // Добавляем сообщение пользователя в чат
            addMessage(newMessage.message, 'user');
          }
        }
      )
      .subscribe();

    console.log('🔔 Подписка на realtime активирована');

    return () => {
      console.log('🔕 Отписка от realtime');
      supabase.removeChannel(channel);
    };
  }, [addMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage,
    clearMessages,
    clearError: () => setError(null)
  };
};
