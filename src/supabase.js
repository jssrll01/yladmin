import { createClient } from '@supabase/supabase-js';

// The publishable key is designed to be public (row-level security protects the data).
// Falling back to it means a missing env var can never crash the app at import time.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://adwhomwupgnwxowmutuy.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_20ahxTHpPdtCfyQFq89EJQ_-z4oyrsp';

export const supabase = createClient(url, key);
