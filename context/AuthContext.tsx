"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  username?: string;
  role?: "employee" | "employer";
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  setUserRole: (role: "employee" | "employer") => void;
  logout: () => void;
};

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  setUserRole: () => {},
  logout: () => {},
});

// Demo users for testing
const DEMO_USERS = [
  { 
    id: "1", 
    email: "test@example.com", 
    password: "password123", 
    username: "testuser",
    avatarUrl: "/img/avatars/user1.jpg" 
  },
  { 
    id: "2", 
    email: "employer@example.com", 
    password: "employer123", 
    username: "employeruser",
    avatarUrl: "/img/avatars/user2.jpg" 
  },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("jobfit_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find the user with matching credentials
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }

    // Omit password from user object
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Set the user in state and localStorage
    setUser(userWithoutPassword);
    localStorage.setItem("jobfit_user", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const register = async (email: string, username: string, password: string) => {
    // Simulate API call delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (DEMO_USERS.some(u => u.email === email)) {
      setIsLoading(false);
      throw new Error("Email already in use");
    }

    // Create a new user (in a real app this would be stored in a database)
    const newUser = {
      id: String(DEMO_USERS.length + 1),
      email,
      username,
    };

    // Set the user in state and localStorage
    setUser(newUser);
    localStorage.setItem("jobfit_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const setUserRole = (role: "employee" | "employer") => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("jobfit_user", JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jobfit_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 