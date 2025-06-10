
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory store for chat responses
const responseStore = new Map<string, string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatId, isResponse, aiResponse } = await req.json();

    // If this is storing an AI response
    if (isResponse && aiResponse && chatId) {
      console.log('Storing AI response for chat:', chatId);
      responseStore.set(chatId, aiResponse);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Response stored'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If this is a user message, simulate AI response
    if (message && chatId && !isResponse) {
      console.log('Processing user message:', message);
      
      // Simulate AI processing with a delay
      setTimeout(() => {
        const aiResponse = `Дякую за ваше повідомлення "${message}". Я AI-помічник Connexi і готовий допомогти вам з питаннями про наші AI-рішення для бізнесу. Чим саме можу бути корисним?`;
        responseStore.set(chatId, aiResponse);
        console.log('AI response stored for chat:', chatId);
      }, 2000);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Message processed'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Invalid request format'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
