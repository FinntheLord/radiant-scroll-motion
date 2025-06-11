
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 Chat API вызван:', req.method, req.url);

  try {
    // Инициализируем Supabase клиент
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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
        
        // Сохраняем ответ от AI в базу данных через Supabase
        const { error: insertError } = await supabase
          .from('chat_messages')
          .insert({
            chat_id: chatId,
            message: message,
            role: 'assistant'
          });

        if (insertError) {
          console.error('❌ Ошибка сохранения в базу:', insertError);
          throw new Error(`Database error: ${insertError.message}`);
        }
        
        console.log('✅ Ответ от n8n сохранен в базу данных');
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Ответ от n8n сохранен' 
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
