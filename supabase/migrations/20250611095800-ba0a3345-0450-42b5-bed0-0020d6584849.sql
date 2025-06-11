
-- Создаем таблицу для хранения сообщений чата
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id TEXT NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Создаем политику для чтения сообщений (можно читать все сообщения)
CREATE POLICY "Anyone can read chat messages" 
  ON public.chat_messages 
  FOR SELECT 
  USING (true);

-- Создаем политику для создания сообщений (можно создавать сообщения)
CREATE POLICY "Anyone can create chat messages" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (true);

-- Настраиваем Realtime для таблицы
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
