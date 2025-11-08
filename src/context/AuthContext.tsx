import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('venueTracker_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ ...parsed, createdAt: new Date(parsed.createdAt) });
      } catch (e) {
        console.error('Error loading user from localStorage:', e);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    const savedUser = localStorage.getItem('venueTracker_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.email === email) {
        setUser({ ...parsed, createdAt: new Date(parsed.createdAt) });
        return;
      }
    }
    throw new Error('Invalid credentials');
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup - in production, this would call an API
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      trustability: 0,
      totalReviews: 0,
      createdAt: new Date(),
    };
    localStorage.setItem('venueTracker_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('venueTracker_user');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('venueTracker_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

