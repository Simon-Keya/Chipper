'use client';

import { getToken, removeToken, setToken } from '@/lib/auth';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  userId: number;
  username: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token: string): User | null => {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decoded = JSON.parse(atob(payload));
      return {
        userId: decoded.userId || decoded.id || 0,
        username: decoded.username || decoded.sub || decoded.name || 'User',
        role: decoded.role || 'user',
        email: decoded.email || undefined,
      };
    } catch (error) {
      console.warn('Invalid token format:', error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = getToken();
        if (token) {
          const decoded = decodeToken(token);
          if (decoded) {
            setUser(decoded);
          } else {
            // Invalid token — remove it
            removeToken();
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string) => {
    setToken(token);
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};