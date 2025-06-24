
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

    try 
    {
      console.log('Отправка сообщения:', { message, chatId });
      
      // Отправляем сообщение через новую edge function
      const { error: functionError } = await supabase.functions.invoke('chat-handler', {
        body: { message, chatId }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Ошибка отправки сообщения');
      }

      console.log('Сообщение отправлено успешно');

    } 
    catch (err) 
    {
      console.error('Ошибка отправки сообщения:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
    } 
    finally 
    {
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

    // Создаем канал с уникальным именем для каждого чата
    const channelName = `chat-messages-${chatId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log('🔥 Новое сообщение получено через Realtime:', payload);
          console.log('📄 Данные сообщения:', payload.new);
          
          if (!payload.new) {
            console.error('❌ Payload.new отсутствует');
            return;
          }
          
          const newMessage: ChatMessage = {
            id: payload.new.id,
            content: payload.new.message,
            role: payload.new.role as 'user' | 'assistant',
            timestamp: new Date(payload.new.created_at)
          };
          
          console.log('✅ Преобразованное сообщение:', newMessage);
          
          setMessages(prev => {
            // Проверяем, нет ли уже такого сообщения
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) {
              console.log('⚠️ Сообщение уже существует, пропускаем');
              return prev;
            }
            
            console.log('➕ Добавляем новое сообщение в состояние');
            const updated = [...prev, newMessage].sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            console.log('📋 Обновленный список сообщений:', updated);
            return updated;
          });
        }
      )
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload) => {
          console.log('📡 Получено broadcast сообщение:', payload);
          
          if (!payload.payload) {
            console.error('❌ Broadcast payload отсутствует');
            return;
          }
          
          const broadcastMessage: ChatMessage = {
            id: payload.payload.id,
            content: payload.payload.message,
            role: payload.payload.role as 'user' | 'assistant',
            timestamp: new Date(payload.payload.created_at)
          };
          
          console.log('✅ Broadcast сообщение преобразовано:', broadcastMessage);
          
          setMessages(prev => {
            // Проверяем, нет ли уже такого сообщения
            const exists = prev.some(msg => msg.id === broadcastMessage.id);
            if (exists) {
              console.log('⚠️ Broadcast сообщение уже существует, пропускаем');
              return prev;
            }
            
            console.log('➕ Добавляем broadcast сообщение в состояние');
            const updated = [...prev, broadcastMessage].sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            console.log('📋 Обновленный список сообщений (broadcast):', updated);
            return updated;
          });
        }
      )
      .subscribe((status) => {
        console.log('🔗 Статус подписки Realtime:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime подписка активна');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Ошибка канала Realtime');
          console.error(status);
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Таймаут подписки Realtime');
        } else if (status === 'CLOSED') {
          console.log('🔒 Realtime подписка закрыта');
        }
      });

    channelRef.current = channel;

    // Загружаем существующие сообщения при первом подключении
    const loadExistingMessages = async () => {
      console.log('📥 Загружаем существующие сообщения для chatId:', chatId);
      
      try {
        const { data: existingMessages, error: loadError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (loadError) {
          console.error('❌ Ошибка загрузки существующих сообщений:', loadError);
        } else {
          console.log('📋 Загружены существующие сообщения:', existingMessages);
          if (existingMessages && existingMessages.length > 0) {
            const formattedMessages = existingMessages.map(msg => ({
              id: msg.id,
              content: msg.message,
              role: msg.role as 'user' | 'assistant',
              timestamp: new Date(msg.created_at)
            }));
            console.log('✅ Отформатированные сообщения:', formattedMessages);
            setMessages(formattedMessages);
          } else {
            console.log('📭 Существующих сообщений не найдено');
          }
        }
      } catch (error) {
        console.error('💥 Исключение при загрузке сообщений:', error);
      }
    };

    // Небольшая задержка перед загрузкой существующих сообщений
    const timer = setTimeout(loadExistingMessages, 500);

    return () => {
      console.log('🧹 Очищаем Realtime подписку');
      clearTimeout(timer);
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
