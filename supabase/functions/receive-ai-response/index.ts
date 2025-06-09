
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageId, userId, chatId, message, language } = await req.json();

    if (!message || !userId || !chatId) {
      throw new Error('Missing required fields: message, userId, chatId');
    }

    console.log('Received AI response from n8n:', { 
      messageId, 
      userId, 
      chatId, 
      message: message.substring(0, 100) + '...' 
    });

    // Пересылаем ответ обратно в chat-with-openai как готовый ответ
    const chatResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/chat-with-openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({
        isResponse: true,
        aiResponse: message,
        userId: userId,
        chatId: chatId,
        messageId: messageId,
        language: language
      })
    });

    if (!chatResponse.ok) {
      console.error('Failed to forward response to chat function:', await chatResponse.text());
      throw new Error('Failed to forward response to chat function');
    }

    console.log('Successfully forwarded AI response to chat function');

    return new Response(JSON.stringify({ 
      success: true,
      messageId: messageId,
      status: 'response_delivered',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in receive-ai-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
