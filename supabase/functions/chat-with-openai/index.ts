
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    const { message, language } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Received message:', message, 'Language:', language);

    const systemPrompt = language === 'uk' 
      ? 'Ви - AI-помічник компанії Connexi, яка спеціалізується на впровадженні рішень штучного інтелекту для бізнесу. Відповідайте українською мовою. Ваша мета - допомогти клієнтам зрозуміти, як AI може покращити їхній бізнес, та запропонувати консультацію з нашими спеціалістами.'
      : 'You are an AI assistant for Connexi, a company specializing in implementing artificial intelligence solutions for businesses. Respond in English. Your goal is to help clients understand how AI can improve their business and suggest consultation with our specialists.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const generatedText = data.choices[0].message.content;
    console.log('Generated response:', generatedText);

    return new Response(JSON.stringify({ message: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-openai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      details: 'Please check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
