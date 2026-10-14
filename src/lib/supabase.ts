import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pnnnfezroxwbldgbeakh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubm5mZXpyb3h3YmxkZ2JlYWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjY5NjYsImV4cCI6MjEwNDIwMjk2Nn0.6jU83LUMjK9EtRrX43q6OwhSoiZy9LfTe55HTT0z_k4';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    !supabaseUrl.includes('your-supabase-project') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
