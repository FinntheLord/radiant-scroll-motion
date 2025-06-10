
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Более надежное хранилище с TTL
const responseStore = new Map<string, { message: string; timestamp: number }>();
const TTL = 300000; // 5 минут

// Очистка старых записей
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of responseStore.entries()) {
    if (now - value.timestamp > TTL) {
      responseStore.delete(key);
      console.log('Удален устаревший ответ для chat:', key);
    }
  }
}, 60000); // Очистка каждую минуту

serve(async (req) => {
  // Обработка CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Получен запрос:', JSON.stringify(body, null, 2));
    
    const { message, chatId, userId, action } = body;

    // Если это запрос на получение ответа
    if (action === 'get_response' && chatId) {
      console.log('Запрос на получение ответа для chat ID:', chatId);
      
      const storedData = responseStore.get(chatId);
      
      if (storedData) {
        console.log('Найден ответ для чата:', chatId);
        
        // Удаляем ответ после получения
        responseStore.delete(chatId);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Ответ не найден для чата:', chatId);
      return new Response(JSON.stringify({ 
        success: false,
        message: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Если это сохранение ответа от n8n
    if (!message || !chatId) {
      console.log('Отсутствуют обязательные поля:', { message: !!message, chatId: !!chatId });
      return new Response(JSON.stringify({
        error: 'Missing required fields: message, chatId',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Сохранение ответа от n8n для чата:', chatId);
    console.log('Сообщение (первые 100 символов):', message.substring(0, 100) + '...');

    // Сохраняем ответ с timestamp
    responseStore.set(chatId, {
      message: message,
      timestamp: Date.now()
    });

    console.log('Ответ успешно сохранен для чата:', chatId);
    console.log('Текущий размер хранилища:', responseStore.size);

    return new Response(JSON.stringify({ 
      success: true,
      chatId: chatId,
      status: 'response_stored',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Ошибка в receive-ai-response функции:', error);
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
