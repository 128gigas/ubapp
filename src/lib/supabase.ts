import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvryetnyubhxopwrcwlg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cnlldG55dWJoeG9wd3Jjd2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNDQzNTAsImV4cCI6MjA0ODcyMDM1MH0.v6nN86qB5smxt-W_SzcFye-clsGtxzfCC4WeO9_Eo84';

export const supabase = createClient(supabaseUrl, supabaseKey);