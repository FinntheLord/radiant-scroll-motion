
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Простое хранилище сообщений в памяти
const messageStore = new Map<string, string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chatId, message, isResponse } = await req.json();

    if (isResponse && message && chatId) {
      // Сохраняем ответ от n8n
      console.log('Saving AI response for chat:', chatId);
      messageStore.set(chatId, message);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Response saved'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (chatId && !isResponse) {
      // Проверяем, есть ли ответ для этого чата
      const savedMessage = messageStore.get(chatId);
      
      if (savedMessage) {
        console.log('Found response for chat:', chatId);
        messageStore.delete(chatId); // Удаляем после получения
        
        return new Response(JSON.stringify({ 
          success: true,
          message: savedMessage
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false,
          message: null
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ 
      error: 'Invalid request'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in receive-chat-response:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
