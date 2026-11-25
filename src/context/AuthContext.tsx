'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'PHOTOGRAPHER' | 'CUSTOMER' | 'ADMIN';
  username?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  bio?: string | null;
  clabe?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'fototime_session_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage or cookie on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Error restoring session from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      // Also set a document cookie so middleware / server components can read if needed
      document.cookie = `fototime_user=${encodeURIComponent(
        JSON.stringify({ id: userData.id, role: userData.role, email: userData.email })
      )}; path=/; max-age=2592000; SameSite=Lax`;
    } catch (e) {
      console.error('Error saving session:', e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = 'fototime_user=; path=/; max-age=0';
    } catch (e) {
      console.error('Error removing session:', e);
    }
  };

  const updateUser = (updatedData: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating session:', e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
