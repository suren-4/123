import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqxqvxvbxvxvxvxvxvxv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeHF2eHZieHZ4dnhieHZ4dnhidiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE5NjQ0NjQ0LCJleHAiOjE5MzUyMjA2NDR9.7Q7H7H8H8H8H8H8H8H8H8H8H8H8H8H8H8H8H8H8H8H8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 