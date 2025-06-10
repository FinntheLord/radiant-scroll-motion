
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Простое глобальное хранилище ответов
const responseStore = new Map<string, { message: string; timestamp: number }>();
const TTL = 120000; // 2 минуты

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('=== RECEIVE-AI-RESPONSE ===');
    console.log('Запрос:', JSON.stringify(body, null, 2));
    
    const { message, chatId, chat_id, action } = body;
    const finalChatId = chatId || chat_id;

    // Если это запрос на получение ответа
    if (action === 'get_response' && finalChatId) {
      console.log('🔍 Поиск ответа для chat ID:', finalChatId);
      console.log('📦 Размер хранилища:', responseStore.size);
      console.log('🔑 Доступные ключи:', Array.from(responseStore.keys()));
      
      const storedData = responseStore.get(finalChatId);
      
      if (storedData) {
        const age = Math.round((Date.now() - storedData.timestamp) / 1000);
        console.log('✅ НАЙДЕН ОТВЕТ для чата:', finalChatId);
        console.log('⏰ Возраст ответа:', age, 'секунд');
        
        // Удаляем ответ после получения
        responseStore.delete(finalChatId);
        console.log('🗑️ Ответ удален из хранилища');
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('❌ ОТВЕТ НЕ НАЙДЕН для чата:', finalChatId);
      return new Response(JSON.stringify({ 
        success: false,
        message: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Если это сохранение ответа от n8n
    if (!message || !finalChatId) {
      console.log('❌ ОТСУТСТВУЮТ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ');
      console.log('message:', !!message, 'chatId/chat_id:', !!finalChatId);
      
      return new Response(JSON.stringify({
        error: 'Missing required fields: message, chatId',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('💾 СОХРАНЕНИЕ ОТВЕТА ОТ N8N');
    console.log('Chat ID:', finalChatId);
    console.log('Длина сообщения:', message.length);
    console.log('Первые 100 символов:', message.substring(0, 100));

    // Очищаем старые записи перед добавлением новой
    const now = Date.now();
    let cleanedCount = 0;
    for (const [key, value] of responseStore.entries()) {
      if (now - value.timestamp > TTL) {
        responseStore.delete(key);
        cleanedCount++;
      }
    }
    if (cleanedCount > 0) {
      console.log('🧹 Очищено старых записей:', cleanedCount);
    }

    // Сохраняем новый ответ
    responseStore.set(finalChatId, {
      message: message,
      timestamp: now
    });

    console.log('✅ ОТВЕТ УСПЕШНО СОХРАНЕН');
    console.log('📊 Размер хранилища:', responseStore.size);
    console.log('🔑 Все ключи:', Array.from(responseStore.keys()));

    return new Response(JSON.stringify({ 
      success: true,
      chatId: finalChatId,
      status: 'response_stored',
      timestamp: new Date().toISOString(),
      storageSize: responseStore.size
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
    console.error('Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
