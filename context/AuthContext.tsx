"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

// Import centralized types and utilities
import supabase from '@/lib/supabase';
import { 
  User, 
  UserRole, 
  AuthContextType,
  mapSupabaseUser
} from '@/lib/auth-types';
import { 
  persistSession, 
  getPersistedSession, 
  clearPersistedSession,
  setupSessionRefresh,
  getSessionExpiryTime,
  isStorageAvailable
} from '@/utils/session-persistence';
import { 
  isMockAuthEnabled,
  authRoutes,
  authErrors
} from '@/config/auth';

// Mock users for testing (only used if isMockAuthEnabled is true)
const mockUsers = [
  {
    id: '71ee08d2-ee66-443b-a86e-b3803d949d53',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    username: 'admin',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User'
  },
  {
    id: '45f7b4f5-464f-48f0-b2b2-b76ed02036b6',
    email: 'employee1@example.com',
    password: 'password123',
    role: UserRole.JOBSEEKER,
    username: 'employee1',
    avatarUrl: 'https://ui-avatars.com/api/?name=Employee+One'
  },
  {
    id: '22a5ca99-76ed-4c7e-aad9-b39e1df28b16',
    email: 'employer1@example.com',
    password: 'password123',
    role: UserRole.EMPLOYER,
    username: 'employer1',
    avatarUrl: 'https://ui-avatars.com/api/?name=Employer+One'
  }
];

// Create the Authentication Context
export const AuthContext = createContext<AuthContextType | null>(null);

// Create a Provider for components to consume and subscribe to changes
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const refreshTimerRef = useRef<{ cancel: () => void } | null>(null);
  
  // State management - use stable object to reduce re-renders
  const [authState, setAuthState] = useState<{
    user: User;
    session: Session | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
  }>({
    user: null,
    session: null,
    isLoading: true,
    isInitialized: false,
    error: null
  });
  
  // Extract state values for easier access
  const { user, session, isLoading, isInitialized, error } = authState;

  // Helper function to update state partially
  const updateAuthState = useCallback((newState: Partial<typeof authState>) => {
    setAuthState(prevState => ({ ...prevState, ...newState }));
  }, []);

  // Helper function to show toast notifications
  const showToast = useCallback((title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    toast({
      title,
      description,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  }, [toast]);

  // Initialize authentication
  const initializeAuth = useCallback(async () => {
    try {
      updateAuthState({ isLoading: true });
      
      // Try to get session from Supabase
      const { data: { session: supaSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error retrieving session:', sessionError);
        updateAuthState({ isLoading: false, error: sessionError.message });
        return;
      }
      
      if (supaSession) {
        // We have an active session
        updateAuthState({ session: supaSession });
        
        // Get user details
        const { data: { user: supaUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error retrieving user:', userError);
          updateAuthState({ isLoading: false, error: userError.message });
          return;
        }
        
        if (supaUser) {
          // Map Supabase user to our app's User type
          const appUser = mapSupabaseUser(supaUser);
          updateAuthState({ user: appUser });
          
          // Setup session refresh
          setupSessionRefresher();
        }
      } else if (isMockAuthEnabled) {
        // For development/testing - check if we have a stored mock user
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          updateAuthState({ user: {
            id: parsedUser.id,
            email: parsedUser.email,
            role: parsedUser.role,
            username: parsedUser.username,
            avatarUrl: parsedUser.avatarUrl,
            emailConfirmed: true
          } });
        }
      }
      
      updateAuthState({ isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('Error during auth initialization:', error);
      updateAuthState({ isLoading: false, error: 'Failed to initialize authentication' });
    }
  }, []);

  // Setup session refresh timer
  const setupSessionRefresher = useCallback(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      refreshTimerRef.current.cancel();
    }
    
    // Setup a new timer
    refreshTimerRef.current = setupSessionRefresh(async () => {
      await refreshSession();
    });
  }, []);

  // Redirect based on user role
  const redirectToRolePage = useCallback((user: User) => {
    if (!user) return;
    
    // Get the role and redirect accordingly
    if (user.role === UserRole.ADMIN) {
      router.push('/admin/dashboard');
    } else if (user.role === UserRole.EMPLOYER) {
      router.push('/employer/dashboard');
    } else {
      // Default for jobseeker or unspecified role
      router.push('/dashboard');
    }
  }, [router]);

  // Login function
  const login = useCallback(async (email: string, password: string, preferredRole?: UserRole) => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      // Check if we're using mock auth for testing/development
      if (isMockAuthEnabled) {
        const mockUser = mockUsers.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
        );
        
        if (mockUser) {
          // Store the mock user
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          
          // Set user state
          const userWithRole = {
            id: mockUser.id,
            email: mockUser.email,
            role: preferredRole || mockUser.role,
            username: mockUser.username || email.split('@')[0],
            avatarUrl: mockUser.avatarUrl,
            emailConfirmed: true
          };
          
          updateAuthState({ user: userWithRole });
          
          updateAuthState({ isLoading: false });
          showToast('Login successful', 'Welcome back!', 'success');
          
          // Redirect based on role
          redirectToRolePage(userWithRole);
          
          // For test/dev only
          return { success: true };
        } else {
          updateAuthState({ error: authErrors.invalidCredentials, isLoading: false });
          showToast('Login failed', authErrors.invalidCredentials, 'error');
          return { success: false, error: authErrors.invalidCredentials };
        }
      }
      
      // Normal auth with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        updateAuthState({ error: error.message, isLoading: false });
        showToast('Login failed', error.message, 'error');
        return { success: false, error: error.message };
      }
      
      // Check if we have a session and user
      if (data.session && data.user) {
        // Store the session
        updateAuthState({ session: data.session });
        persistSession(data.session);
        
        // Detect if this is a new user (first login after registration)
        const isNewUser = data.user.user_metadata?.is_new_user === true;
        
        // Apply preferred role if this is a new user and role was specified
        if (isNewUser && preferredRole) {
          await supabase.auth.updateUser({
            data: { role: preferredRole }
          });
          
          // Refresh user data with the new role
          const { data: refreshData } = await supabase.auth.getUser();
          if (refreshData.user) {
            data.user = refreshData.user;
          }
        }
        
        // Map Supabase user to our app's User type
        const appUser = mapSupabaseUser(data.user);
        updateAuthState({ user: appUser });
        
        // Setup session refresh
        setupSessionRefresher();
        
        updateAuthState({ isLoading: false });
        showToast('Login successful', 'Welcome back!', 'success');
        
        // Redirect based on role
        redirectToRolePage(appUser);
        
        return { 
          success: true, 
          isNewUser
        };
      } else {
        updateAuthState({ error: 'Login successful but no session was created', isLoading: false });
        return { success: false, error: 'Authentication failed' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during login';
      updateAuthState({ error: errorMessage, isLoading: false });
      showToast('Login failed', errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState, showToast, redirectToRolePage]);

  // Register a new user
  const register = async (
    email: string, 
    password: string,
    role?: UserRole
  ): Promise<{success: boolean, error?: string}> => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      // For development/testing
      if (isMockAuthEnabled) {
        const mockUser = {
          id: Math.random().toString(36).substring(2),
          email,
          password,
          role: role || UserRole.JOBSEEKER
        };
        
        // Store mock user and auth state
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        const username = email.split('@')[0];
        
        updateAuthState({ 
          user: { 
            id: mockUser.id, 
            email: mockUser.email, 
            role: mockUser.role,
            username,
            avatarUrl: `https://ui-avatars.com/api/?name=${username.replace(' ', '+')}`,
            emailConfirmed: true,
            isNewUser: true
          } 
        });
        
        updateAuthState({ isLoading: false });
        
        showToast('Registration successful', 'Your account has been created!', 'success');
        
        // Redirect based on role
        redirectToRolePage({ 
          id: mockUser.id, 
          email: mockUser.email, 
          role: mockUser.role,
          username,
          emailConfirmed: true
        });
        
        return { success: true };
      }
      
      // Actual registration with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split('@')[0],
            role: role || UserRole.JOBSEEKER,
            is_new_user: true
          }
        }
      });
      
      if (error) {
        updateAuthState({ error: error.message, isLoading: false });
        showToast('Registration failed', error.message, 'error');
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // If email confirmation is required
        if (!data.user.email_confirmed_at) {
          showToast(
            'Verification required',
            'Please check your email to verify your account before logging in.',
            'info'
          );
          updateAuthState({ isLoading: false });
          
          // Redirect to confirmation page
          router.push('/confirmation');
          return { success: true };
        }
        
        // If user is immediately confirmed (development/testing)
        if (data.session) {
          updateAuthState({ session: data.session });
          persistSession(data.session);
          
          const appUser = mapSupabaseUser(data.user);
          updateAuthState({ user: appUser });
          
          setupSessionRefresher();
          
          updateAuthState({ isLoading: false });
          showToast('Registration successful', 'Your account has been created!', 'success');
          
          // Redirect based on role
          redirectToRolePage(appUser);
          
          return { success: true };
        }
      }
      
      // Default case
      updateAuthState({ isLoading: false });
      return { success: true };
      
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during registration';
      updateAuthState({ error: errorMessage, isLoading: false });
      showToast('Registration failed', errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  };

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      if (isMockAuthEnabled) {
        // Mock implementation - just return success
        updateAuthState({ isLoading: false });
        showToast(
          'Password reset email sent', 
          'Please check your email for instructions to reset your password', 
          'success'
        );
        return { success: true };
      }
      
      // Real implementation with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${authRoutes.resetPassword}`
      });
      
      if (error) {
        updateAuthState({ error: error.message, isLoading: false });
        showToast('Password reset failed', error.message, 'error');
        return { success: false, error: error.message };
      }
      
      updateAuthState({ isLoading: false });
      showToast(
        'Password reset email sent', 
        'Please check your email for instructions to reset your password', 
        'success'
      );
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      updateAuthState({ error: errorMessage, isLoading: false });
      showToast('Password reset failed', errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState, showToast]);

  // Update password function
  const updatePassword = useCallback(async (password: string) => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      if (isMockAuthEnabled) {
        // Mock implementation - just return success
        updateAuthState({ isLoading: false });
        showToast('Password updated', 'Your password has been updated successfully', 'success');
        return { success: true };
      }
      
      // Real implementation with Supabase
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        updateAuthState({ error: error.message, isLoading: false });
        showToast('Password update failed', error.message, 'error');
        return { success: false, error: error.message };
      }
      
      updateAuthState({ isLoading: false });
      showToast('Password updated', 'Your password has been updated successfully', 'success');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      updateAuthState({ error: errorMessage, isLoading: false });
      showToast('Password update failed', errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState, showToast]);

  // Set user role function
  const setUserRole = useCallback(async (role: UserRole) => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      if (!user) {
        updateAuthState({ error: 'User not authenticated', isLoading: false });
        showToast('Role update failed', 'User not authenticated', 'error');
        return { success: false, error: 'User not authenticated' };
      }
      
      if (isMockAuthEnabled) {
        // Mock implementation - update local user state
        const updatedUser = { ...user, role };
        updateAuthState({ user: updatedUser });
        
        updateAuthState({ isLoading: false });
        showToast('Role updated', `Your role has been set to ${role}`, 'success');
        return { success: true };
      }
      
      // Real implementation with Supabase
      const { error } = await supabase.auth.updateUser({
        data: { role }
      });
      
      if (error) {
        updateAuthState({ error: error.message, isLoading: false });
        showToast('Role update failed', error.message, 'error');
        return { success: false, error: error.message };
      }
      
      // Update local user state
      const updatedUser = { ...user, role };
      updateAuthState({ user: updatedUser });
      
      updateAuthState({ isLoading: false });
      showToast('Role updated', `Your role has been set to ${role}`, 'success');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      updateAuthState({ error: errorMessage, isLoading: false });
      showToast('Role update failed', errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  }, [updateAuthState, user, isMockAuthEnabled]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      updateAuthState({ isLoading: true });
      
      // Clear refresh timer
      if (refreshTimerRef.current) {
        refreshTimerRef.current.cancel();
        refreshTimerRef.current = null;
      }
      
      if (isMockAuthEnabled) {
        // Mock implementation - just clear local state
        localStorage.removeItem('mock_user');
      } else {
        // Real implementation with Supabase
        await supabase.auth.signOut();
      }
      
      // Clear session and user state
      clearPersistedSession();
      updateAuthState({ user: null, session: null });
      
      updateAuthState({ isLoading: false });
      showToast('Logged out', 'You have been logged out successfully', 'success');
      
      // Redirect to home
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      updateAuthState({ isLoading: false });
      showToast('Logout failed', 'Failed to log out, please try again', 'error');
    }
  }, [updateAuthState, router, isMockAuthEnabled]);

  // Check if user has required role(s)
  const checkRole = useCallback((requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const userRole = user.role;
    if (!userRole) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }
    
    return userRole === requiredRoles;
  }, [user]);

  // Function to refresh the session
  const refreshSession = async (): Promise<{success: boolean, error?: string}> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return { success: false, error: error.message };
      }
      
      if (data && data.session) {
        updateAuthState({ session: data.session });
        
        if (data.user) {
          const appUser = mapSupabaseUser(data.user);
          updateAuthState({ user: appUser });
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'No session data returned' };
    } catch (error: any) {
      console.error('Error in refreshSession:', error);
      return { success: false, error: error.message || 'Failed to refresh session' };
    }
  };

  // Setup auth state listener
  useEffect(() => {
    // Initialize auth
    initializeAuth();
    
    // Set up auth change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        if (session) {
          updateAuthState({ session });
          persistSession(session);
          
          // Get user data
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          
          if (supaUser) {
            const appUser = mapSupabaseUser(supaUser);
            updateAuthState({ user: appUser });
            
            // Setup session refresh
            setupSessionRefresher();
          }
        }
      } else if (event === 'SIGNED_OUT') {
        updateAuthState({ user: null, session: null });
        
        // Clear refresh timer
        if (refreshTimerRef.current) {
          refreshTimerRef.current.cancel();
          refreshTimerRef.current = null;
        }
      } else if (event === 'USER_UPDATED') {
        if (session) {
          updateAuthState({ session });
          
          // Get updated user data
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          
          if (supaUser) {
            const updatedUser = mapSupabaseUser(supaUser);
            updateAuthState({ user: updatedUser });
          }
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        updateAuthState({ session });
        persistSession(session);
      }
    });
    
    // Refresh session on window focus
    const handleFocus = async () => {
      await refreshSession();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      // Clean up auth listener and window event listener
      authListener.subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
      
      // Clear refresh timer
      if (refreshTimerRef.current) {
        refreshTimerRef.current.cancel();
      }
    };
  }, [initializeAuth, setupSessionRefresher, updateAuthState, refreshSession]);

  // Set the current user - used for external updates
  const setUser = (newUser: User) => {
    updateAuthState({ user });
  };

  // Computed property for authentication status
  const isAuthenticated = !!user;

  // Create the context value object with all required properties
  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    resetPassword,
    updatePassword,
    logout,
    setUser,
    isAuthenticated,
    refreshSession
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Export the useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 