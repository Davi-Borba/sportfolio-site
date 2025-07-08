// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Cole aqui a URL e a Chave que você copiou do Supabase
const supabaseUrl = 'https://zhjwrrxjnbpjmqqyiidr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoandycnhqbmJwam1xcXlpaWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODYxODcsImV4cCI6MjA2NzE2MjE4N30.-yKfE_4H33KcmOylFvJ8_KXV91QtcLcCdlRwFftYB4A';

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
