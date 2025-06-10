
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Улучшенное глобальное хранилище с детальным логированием
const responseStore = new Map<string, { 
  message: string; 
  timestamp: number;
  userId?: string;
}>();

const TTL = 180000; // 3 минуты для надежности

// Функция очистки старых записей
const cleanupOldEntries = () => {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [key, value] of responseStore.entries()) {
    if (now - value.timestamp > TTL) {
      responseStore.delete(key);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`🧹 Очищено старых записей: ${cleanedCount}`);
  }
  return cleanedCount;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('=== RECEIVE-AI-RESPONSE ===');
    console.log('📨 Входящий запрос:', JSON.stringify(body, null, 2));
    
    const { message, chatId, chat_id, userId, action } = body;
    const finalChatId = chatId || chat_id;

    // Очистка старых записей при каждом запросе
    cleanupOldEntries();

    // Если это запрос на получение ответа (от клиента)
    if (action === 'get_response' && finalChatId) {
      console.log('🔍 ПОИСК ОТВЕТА');
      console.log('Chat ID для поиска:', finalChatId);
      console.log('📦 Текущий размер хранилища:', responseStore.size);
      console.log('🔑 Все ключи в хранилище:', Array.from(responseStore.keys()));
      
      const storedData = responseStore.get(finalChatId);
      
      if (storedData) {
        const age = Math.round((Date.now() - storedData.timestamp) / 1000);
        console.log('✅ ОТВЕТ НАЙДЕН!');
        console.log('📝 Сообщение:', storedData.message.substring(0, 100) + '...');
        console.log('⏰ Возраст ответа:', age, 'секунд');
        console.log('👤 User ID:', storedData.userId);
        
        // Удаляем ответ после получения
        responseStore.delete(finalChatId);
        console.log('🗑️ Ответ удален из хранилища');
        console.log('📦 Новый размер хранилища:', responseStore.size);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message,
          retrievedAt: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('❌ ОТВЕТ НЕ НАЙДЕН');
      console.log('🔍 Искали ключ:', finalChatId);
      console.log('📋 Доступные ключи:', Array.from(responseStore.keys()));
      
      return new Response(JSON.stringify({ 
        success: false,
        message: null,
        searchedKey: finalChatId,
        availableKeys: Array.from(responseStore.keys()),
        storageSize: responseStore.size
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Если это сохранение ответа от n8n
    if (message && finalChatId) {
      console.log('💾 СОХРАНЕНИЕ ОТВЕТА ОТ N8N');
      console.log('Chat ID:', finalChatId);
      console.log('User ID:', userId);
      console.log('Длина сообщения:', message.length);
      console.log('Первые 100 символов:', message.substring(0, 100));

      const now = Date.now();
      
      // Сохраняем новый ответ
      responseStore.set(finalChatId, {
        message: message,
        timestamp: now,
        userId: userId
      });

      console.log('✅ ОТВЕТ УСПЕШНО СОХРАНЕН');
      console.log('📊 Размер хранилища после сохранения:', responseStore.size);
      console.log('🔑 Все ключи после сохранения:', Array.from(responseStore.keys()));
      console.log('⏰ Timestamp сохранения:', new Date(now).toISOString());

      return new Response(JSON.stringify({ 
        success: true,
        chatId: finalChatId,
        userId: userId,
        status: 'response_stored',
        timestamp: new Date().toISOString(),
        storageSize: responseStore.size,
        storedKeys: Array.from(responseStore.keys())
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Если не хватает обязательных полей
    console.log('❌ ОТСУТСТВУЮТ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ');
    console.log('message присутствует:', !!message);
    console.log('chatId присутствует:', !!finalChatId);
    console.log('action:', action);
    
    return new Response(JSON.stringify({
      error: 'Missing required fields. For storage: message + chatId. For retrieval: action=get_response + chatId',
      success: false,
      received: {
        message: !!message,
        chatId: !!finalChatId,
        action: action
      }
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
    console.error('Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
