import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ConnectionState {
	status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error'
	lastConnected: Date | null
	retryCount: number
}

const MAX_RETRY_ATTEMPTS = 5
const RETRY_DELAY_BASE = 1000 // 1 second base delay
const SESSION_STORAGE_KEY = 'conexy_chat_session'
const HEARTBEAT_INTERVAL = 30000 // 30 seconds

export const useNewChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>({
		status: 'connecting',
		lastConnected: null,
		retryCount: 0,
	})
  const channelRef = useRef<any>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
	const isUnmountedRef = useRef(false)


  // Step 1: generate a unique chatId
  // Enhanced chatId with session persistence
	const [chatId] = useState(() => {
		// Try to restore from session storage
		const savedSession = localStorage.getItem(SESSION_STORAGE_KEY)
		if (savedSession) {
			try {
				const parsed = JSON.parse(savedSession)
				if (
					parsed.chatId &&
					parsed.timestamp &&
					Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000
				) {
					console.log('🔄 Restored chat session:', parsed.chatId)
					return parsed.chatId
				}
			} catch (e) {
				console.warn('Failed to parse saved session')
			}
		}

		// Generate new chatId
		const newChatId = `chat_${Date.now()}_${Math.random()
			.toString(36)
			.substring(2, 8)}`

		// Save to session storage
		localStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({
				chatId: newChatId,
				timestamp: Date.now(),
			})
		)

		console.log('🆕 Generated new chat session:', newChatId)
		return newChatId
	})

  // Step 2: Send a message to the chat and to Supabase Edge Function
  // Send message to chat and to Supabase Edge Function
  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    try 
    {
      console.log('Отправка сообщения:', { message, chatId });
      
      // Add user message immediately to chat
			const userMessage: ChatMessage = 
      {
					id: `user-${Date.now()}-${Math.random().toString(36).substring(2)}`,
					content: message,
					role: 'user',
					timestamp: new Date(),
      };

			setMessages(prev => [...prev, userMessage])

      // Отправляем сообщение через edge function2
      const { error: functionError } = await supabase.functions.invoke('chat-handler', {
        body: { message, chatId }
      });

				// Reset connection state on successful send
				setConnectionState(prev => ({
					...prev,
					status: 'connected',
					lastConnected: new Date(),
					retryCount: 0,
				}))

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
  }, [chatId, connectionState.status]);

  // Подписка на канал Realtime
  const subscribeToChannel = useCallback((chatId: string) => {
  if (channelRef.current) {
    console.log('Канал уже существует, пропускаем');
    return;
  }

  const channelName = `chat-messages-${chatId}`;
  const channel = supabase.channel(channelName)
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
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.error('❌ Ошибка канала Realtime');
          scheduleReconnect();
        }
    });

  channelRef.current = channel;

  // Загрузка существующих сообщений
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
  setTimeout(loadExistingMessages, 500);
  }, [chatId]);

  // Enhanced connection establishment
	const establishConnection = useCallback(
		async (isReconnect = false) => {
			if (isUnmountedRef.current) return

			console.log(
				`🔗 ${
					isReconnect ? 'Переподключение' : 'Подключение'
				} демо чату для chatId:`,
				chatId
			)

      // UI trick: show loading state
			// Update connection state for UI
			setConnectionState(prev => ({
				...prev,
				status: isReconnect ? 'reconnecting' : 'connecting',
			}))

			try {
        // UI trick: show loading state
				// Simulate connection delay
				await new Promise(resolve => setTimeout(resolve, 1000))

        // UI trick: show loading state
				// Set connected state for UI
				setConnectionState({
					status: 'connected',
					lastConnected: new Date(),
					retryCount: 0,
				})

				console.log('✅ Демо чат підключено')

				// Start heartbeat
				startHeartbeat()

        // Подписка на канал после успешного подключения
        subscribeToChannel(chatId);

				// Add welcome message for new chats
				if (!isReconnect && messages.length === 0) {
					setTimeout(() => {
						const welcomeMessage: ChatMessage = {
							id: `welcome-${Date.now()}`,
							content:
								'Привіт! Я AI-асистент Connexi. Готовий відповісти на ваші питання про наші послуги. Як справи?',
							role: 'assistant',
							timestamp: new Date(),
						}
						setMessages([welcomeMessage])
					}, 500)
				}
			} catch (error) {
				console.error("💥 Помилка встановлення з'єднання:", error)
				setConnectionState(prev => ({ ...prev, status: 'error' }))
				scheduleReconnect()
			}
		}, [chatId, messages.length, subscribeToChannel]
	);

  // Heartbeat to detect connection issues
	const startHeartbeat = useCallback(() => {
		if (heartbeatRef.current) {
			clearInterval(heartbeatRef.current)
		}

		heartbeatRef.current = setInterval(() => {
			if (isUnmountedRef.current) return

			const now = new Date()
			setConnectionState(prev => {
				if (
					prev.lastConnected &&
					now.getTime() - prev.lastConnected.getTime() > HEARTBEAT_INTERVAL * 2
				) {
					console.warn('⚠️ Heartbeat timeout detected, reconnecting...')
					scheduleReconnect()
					return { ...prev, status: 'disconnected' }
				}
				return prev
			})
		}, HEARTBEAT_INTERVAL)
	}, [])

  // Schedule reconnection with exponential backoff
	const scheduleReconnect = useCallback(() => {
		if (isUnmountedRef.current) return

		setConnectionState(prev => {
			if (prev.retryCount >= MAX_RETRY_ATTEMPTS) {
				console.error(
					'🚫 Максимальна кількість спроб перепідключення досягнута'
				)
				setError("Не вдалося відновити з'єднання. Перезавантажте сторінку.")
				return { ...prev, status: 'error' }
			}

			const delay = RETRY_DELAY_BASE * Math.pow(2, prev.retryCount)
			console.log(
				`🔄 Плануємо перепідключення через ${delay}ms (спроба ${
					prev.retryCount + 1
				})`
			)

			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current)
			}

			retryTimeoutRef.current = setTimeout(() => {
				if (!isUnmountedRef.current) {
					establishConnection(true)
				}
			}, delay)

			return {
				...prev,
				retryCount: prev.retryCount + 1,
				status: 'reconnecting',
			}
		})
	}, [establishConnection])

  useEffect(() => {
  establishConnection(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // Cleanup effect (объединённый)
	useEffect(() => {
		return () => {
			console.log('🧹 Очищення ресурсів чату и realtime подписки')
			isUnmountedRef.current = true

			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current)
			}

			if (heartbeatRef.current) {
				clearInterval(heartbeatRef.current)
			}

			if (channelRef.current) {
				supabase.removeChannel(channelRef.current)
				channelRef.current = null
			}
		}
	}, [])

  // Auto-reconnect on window focus
	useEffect(() => {
		const handleFocus = () => {
			if (
				connectionState.status === 'disconnected' ||
				connectionState.status === 'error'
			) {
				console.log('👁️ Вікно отримало фокус, пробуємо перепідключитися')
				setConnectionState(prev => ({ ...prev, retryCount: 0 }))
        establishConnection(true)
			}
		}

		window.addEventListener('focus', handleFocus)
		return () => window.removeEventListener('focus', handleFocus)
	}, [connectionState.status, establishConnection])

	const clearError = useCallback(() => {
		setError(null)
	}, [])

  // Manual reconnect function
	const reconnect = useCallback(() => {
		console.log('🔄 Виконуємо ручне перепідключення...')
    setConnectionState(prev => ({ ...prev, retryCount: 0 }))
		establishConnection(true)
	}, [establishConnection])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
    chatId,
    connectionState,
    reconnect
  };
};