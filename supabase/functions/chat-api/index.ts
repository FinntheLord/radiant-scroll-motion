
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Простое хранилище для сообщений
const messageStore = new Map<string, string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 Chat API вызван:', req.method, req.url);

  try {
    if (req.method === 'POST') {
      const body = await req.json();
      console.log('📨 POST данные:', body);
      
      const { action, chatId, message, userMessage } = body;
      
      if (action === 'send') {
        // Отправляем сообщение пользователя на n8n
        console.log('📤 Отправка на n8n:', userMessage);
        
        const n8nResponse = await fetch('https://n8n.srv838454.hstgr.cloud/webhook/84ac1eaf-efe6-4517-bc28-5b239286b274', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message: userMessage
          })
        });
        
        if (!n8nResponse.ok) {
          throw new Error(`N8N error: ${n8nResponse.status}`);
        }
        
        console.log('✅ Отправлено на n8n');
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Сообщение отправлено' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Проверяем если это webhook от n8n (без action)
      if (!action && chatId && message) {
        console.log('🔄 Webhook от n8n - сохранение ответа для chatId:', chatId);
        console.log('📝 Сообщение от AI:', message);
        
        messageStore.set(chatId, message);
        console.log('✅ Ответ от n8n сохранен');
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Ответ от n8n сохранен' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const chatId = url.searchParams.get('chatId');
      
      console.log('🔍 GET запрос для chatId:', chatId);
      
      if (!chatId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Missing chatId' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const message = messageStore.get(chatId);
      
      if (message) {
        console.log('✅ Найдено сообщение:', message.substring(0, 50) + '...');
        messageStore.delete(chatId); // Удаляем после получения
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: message 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        console.log('❌ Сообщение не найдено');
        return new Response(JSON.stringify({ 
          success: false, 
          message: null 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response(JSON.stringify({ 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('💥 Ошибка в chat-api:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
