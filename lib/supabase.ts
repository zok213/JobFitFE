import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User type definition to ensure consistent types
export type JobFitUser = {
  id: string;
  email: string;
  username?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
};

// Function to get the current authenticated user with role data
export const getCurrentUser = async (): Promise<JobFitUser | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return null;
  
  // Get user profile data including role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  return {
    id: session.user.id,
    email: session.user.email || '', // Ensure email is not undefined
    role: profile?.role || null,
    username: profile?.username || null,
    avatarUrl: profile?.avatar_url || null
  };
};

export const createServerSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return createClient(supabaseUrl, supabaseKey);
}; 