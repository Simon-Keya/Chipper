'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { isAuthenticated, getUserFromToken, logout } from '@/lib/auth';
import { User } from '@/lib/types';

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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated()) {
      const decodedUser = getUserFromToken();
      setUser(decodedUser || null);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decodedUser = getUserFromToken();
    setUser(decodedUser || null);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout: handleLogout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};