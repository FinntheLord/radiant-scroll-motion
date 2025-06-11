
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Глобальное хранилище для ответов
const responseStore = new Map<string, { message: string; timestamp: number }>();
const TTL = 300000; // 5 минут

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
      console.log('📨 Получено тело запроса:', JSON.stringify(body, null, 2));
      
      // Извлекаем данные из разных возможных форматов
      const chatId = body.chatId || body.chat_id || body.id;
      const message = body.message || body.text || body.content;

      console.log('📝 Извлеченные данные:');
      console.log('- Chat ID:', chatId);
      console.log('- Message:', message?.substring(0, 100) + '...');

      if (!chatId || !message) {
        console.log('❌ Отсутствуют обязательные поля');
        return new Response(JSON.stringify({ 
          error: 'Missing chatId or message',
          success: false,
          received: body
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Сохраняем ответ
      responseStore.set(chatId, {
        message: message,
        timestamp: now
      });

      console.log('✅ Ответ сохранен для chatId:', chatId);
      console.log('📊 Текущее содержимое хранилища:');
      for (const [key, value] of responseStore.entries()) {
        console.log(`- ${key}: ${value.message.substring(0, 50)}...`);
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Response stored successfully',
        chatId: chatId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const chatId = url.searchParams.get('chatId');
      
      console.log('🔍 GET запрос для chatId:', chatId);
      console.log('📋 Все chatId в хранилище:', Array.from(responseStore.keys()));
      
      if (!chatId) {
        console.log('❌ Отсутствует chatId в параметрах');
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Missing chatId parameter'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const storedData = responseStore.get(chatId);
      
      if (storedData) {
        console.log('✅ Найдено сообщение для chatId:', chatId);
        console.log('📤 Возвращаем сообщение:', storedData.message.substring(0, 100) + '...');
        
        // Удаляем сообщение после получения
        responseStore.delete(chatId);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        console.log('❌ Сообщение не найдено для chatId:', chatId);
        return new Response(JSON.stringify({ 
          success: false,
          message: null
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
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
      success: false,
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
