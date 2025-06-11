
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Простое глобальное хранилище для ответов
const responseStore = new Map<string, { message: string; timestamp: number }>();
const TTL = 120000; // 2 минуты

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== N8N-WEBHOOK ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  try {
    // Очистка старых записей
    const now = Date.now();
    for (const [key, value] of responseStore.entries()) {
      if (now - value.timestamp > TTL) {
        responseStore.delete(key);
        console.log('🗑️ Удален старый ответ:', key);
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { chatId, message, chat_id } = body;
      const finalChatId = chatId || chat_id;

      console.log('📨 Получен ответ от n8n:');
      console.log('Chat ID:', finalChatId);
      console.log('Message:', message?.substring(0, 100) + '...');

      if (!finalChatId || !message) {
        console.log('❌ Отсутствуют обязательные поля');
        return new Response(JSON.stringify({ 
          error: 'Missing chatId or message',
          success: false
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Сохраняем ответ
      responseStore.set(finalChatId, {
        message: message,
        timestamp: now
      });

      console.log('✅ Ответ сохранен, размер хранилища:', responseStore.size);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Response stored successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const chatId = url.searchParams.get('chatId');

      if (!chatId) {
        return new Response(JSON.stringify({ 
          error: 'Missing chatId parameter',
          success: false
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('🔍 Запрос ответа для chat ID:', chatId);

      const storedData = responseStore.get(chatId);
      
      if (storedData) {
        console.log('✅ Ответ найден');
        responseStore.delete(chatId); // Удаляем после получения
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('❌ Ответ не найден');
      return new Response(JSON.stringify({ 
        success: false,
        message: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      error: 'Method not allowed',
      success: false
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Ошибка в n8n-webhook:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
