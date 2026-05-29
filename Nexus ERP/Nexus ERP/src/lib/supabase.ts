import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseSession() {
  return supabase.auth.getSession();
}

export function onSupabaseAuthChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export function signInWithSupabase(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUpWithSupabase(email: string, password: string, displayName?: string) {
  // Use window.location.origin to dynamically redirect back to the correct domain (Vercel or localhost)
  const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName,
      },
      emailRedirectTo: redirectTo,
    },
  });
}

export function signOutFromSupabase() {
  return supabase.auth.signOut();
}
