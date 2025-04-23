"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, getCurrentUser, JobFitUser } from "../lib/supabase";
import { useRouter } from "next/navigation";

// Use the JobFitUser type from supabase.ts
type User = JobFitUser;

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  setUserRole: (role: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  setUserRole: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for user session on initial load
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          // Cập nhật thông tin từ profiles cũng
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Lấy thông tin người dùng và role sau khi đăng nhập thành công
      const userData = await getCurrentUser();
      setUser(userData);

      // Chuyển hướng dựa trên role
      if (userData) {
        if (userData.role === 'admin') {
          router.push('/admin');
        } else if (userData.role === 'employee') {
          router.push('/employee');
        } else if (userData.role === 'employer') {
          router.push('/employer');
        } else {
          // Nếu user chưa có role, chuyển đến trang chọn role
          router.push('/choose-role');
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create profile record with role and username
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            role: null, // Role to be selected after registration
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          throw profileError;
        }
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const setUserRole = async (role: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local user state
      setUser({ ...user, role });

      // Redirect based on role
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'employee') {
        router.push('/employee');
      } else if (role === 'employer') {
        router.push('/employer');
      }
    } catch (error) {
      console.error("Error setting user role:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      // Prepare data for Supabase format
      const profileData = {
        ...(data.username && { username: data.username }),
        ...(data.avatarUrl && { avatar_url: data.avatarUrl }),
      };

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local user state
      setUser({ ...user, ...data });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // User will be set to null by the auth state change listener
      router.push('/login');
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        setUserRole,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 