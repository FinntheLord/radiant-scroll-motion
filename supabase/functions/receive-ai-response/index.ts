
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Единое хранилище ответов с TTL
const responseStore = new Map<string, { message: string; timestamp: number }>();
const TTL = 300000; // 5 минут

// Очистка старых записей каждую минуту
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [key, value] of responseStore.entries()) {
    if (now - value.timestamp > TTL) {
      responseStore.delete(key);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`Очищено ${cleanedCount} устаревших записей`);
  }
}, 60000);

serve(async (req) => {
  // Обработка CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('=== RECEIVE-AI-RESPONSE ===');
    console.log('Получен запрос:', JSON.stringify(body, null, 2));
    
    const { message, chatId, userId, action } = body;

    // Если это запрос на получение ответа
    if (action === 'get_response' && chatId) {
      console.log('Запрос на получение ответа для chat ID:', chatId);
      console.log('Текущий размер хранилища:', responseStore.size);
      
      const storedData = responseStore.get(chatId);
      
      if (storedData) {
        console.log('✅ НАЙДЕН ОТВЕТ для чата:', chatId);
        console.log('Время хранения:', Math.round((Date.now() - storedData.timestamp) / 1000), 'секунд');
        
        // Удаляем ответ после получения
        responseStore.delete(chatId);
        console.log('Ответ удален из хранилища');
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('❌ ОТВЕТ НЕ НАЙДЕН для чата:', chatId);
      console.log('Доступные ключи в хранилище:', Array.from(responseStore.keys()));
      
      return new Response(JSON.stringify({ 
        success: false,
        message: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Если это сохранение ответа от n8n
    if (!message || !chatId) {
      console.log('❌ ОТСУТСТВУЮТ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ');
      console.log('message:', !!message, 'chatId:', !!chatId);
      
      return new Response(JSON.stringify({
        error: 'Missing required fields: message, chatId',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('💾 СОХРАНЕНИЕ ОТВЕТА ОТ N8N');
    console.log('Chat ID:', chatId);
    console.log('User ID:', userId);
    console.log('Длина сообщения:', message.length, 'символов');
    console.log('Сообщение (первые 200 символов):', message.substring(0, 200) + '...');

    // Сохраняем ответ с timestamp
    responseStore.set(chatId, {
      message: message,
      timestamp: Date.now()
    });

    console.log('✅ ОТВЕТ УСПЕШНО СОХРАНЕН');
    console.log('Новый размер хранилища:', responseStore.size);
    console.log('Все ключи в хранилище:', Array.from(responseStore.keys()));

    return new Response(JSON.stringify({ 
      success: true,
      chatId: chatId,
      status: 'response_stored',
      timestamp: new Date().toISOString(),
      storageSize: responseStore.size
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА в receive-ai-response:', error);
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
