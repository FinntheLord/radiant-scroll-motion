
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Глобальное хранилище ответов (в реальном проекте используйте базу данных)
const responseStore = new Map<string, string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chat_id, message, user_id } = await req.json();

    console.log('Получен ответ от n8n:');
    console.log('Chat ID:', chat_id);
    console.log('User ID:', user_id);
    console.log('Message:', message);

    if (!chat_id || !message) {
      return new Response(JSON.stringify({ 
        error: 'Missing chat_id or message'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Сохраняем ответ для данного chat_id
    responseStore.set(chat_id, message);
    console.log('Ответ сохранен для чата:', chat_id);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Response stored successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in receive-n8n-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
