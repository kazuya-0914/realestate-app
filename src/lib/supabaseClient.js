import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Publishable key（旧anon key相当）はブラウザに埋め込まれる前提の公開キーであり、
// アクセス制御はSupabase側のRow Level Securityで行う。
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
