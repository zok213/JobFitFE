// Auth types for the application
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// User roles in the application
export enum UserRole {
  ADMIN = 'admin',
  JOBSEEKER = 'jobseeker',
  EMPLOYER = 'employer'
}

// User type for our application
export type User = {
  id: string;
  email: string;
  role: UserRole;
  username?: string;
  avatarUrl?: string;
  emailConfirmed?: boolean;
  isNewUser?: boolean;
} | null;

// Auth context type
export interface AuthContextType {
  user: User;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string, preferredRole?: UserRole) => Promise<{success: boolean, error?: string}>;
  register: (email: string, password: string, role?: UserRole) => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{success: boolean, error?: string}>;
  updatePassword: (newPassword: string) => Promise<{success: boolean, error?: string}>;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  refreshSession: () => Promise<{success: boolean, error?: string}>;
}

// Map Supabase user to our User type
export const mapSupabaseUser = (user: SupabaseUser): User => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    role: (user.user_metadata?.role as UserRole) || UserRole.JOBSEEKER,
    username: user.user_metadata?.username || user.email?.split('@')[0] || '',
    avatarUrl: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email?.split('@')[0]}`,
    emailConfirmed: user.email_confirmed_at != null,
    isNewUser: user.user_metadata?.is_new_user === true,
  };
}; 