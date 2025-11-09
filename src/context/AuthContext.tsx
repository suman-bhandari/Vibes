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

  const createDefaultUser = () => {
    const defaultUser: User = {
      id: 'user_default',
      email: 'user@example.com',
      name: 'Alex',
      trustability: 78,
      reputation: 4.2, // 0-5 normalized reputation (visible to all)
      karma: 1245, // karma points (only visible to user, can be redeemed)
      totalReviews: 23,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    };
    localStorage.setItem('venueTracker_user', JSON.stringify(defaultUser));
    setUser(defaultUser);
  };

  // Load user from localStorage on mount, or create default user
  useEffect(() => {
    const savedUser = localStorage.getItem('venueTracker_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Normalize reputation if it's the old format (0-100 or large number)
        let normalizedReputation = parsed.reputation !== undefined ? parsed.reputation : 0;
        if (normalizedReputation > 5) {
          // Old format - convert from trustability or large number to 0-5
          normalizedReputation = Math.min(5, Math.max(0, (parsed.trustability || 0) / 100 * 5));
        }
        
        setUser({ 
          ...parsed, 
          createdAt: new Date(parsed.createdAt),
          reputation: normalizedReputation, // 0-5 normalized
          karma: parsed.karma !== undefined ? parsed.karma : (parsed.reputation && parsed.reputation > 5 ? parsed.reputation : 0), // karma points (migrate old reputation to karma if needed)
        });
      } catch (e) {
        console.error('Error loading user from localStorage:', e);
        // Create default user if loading fails
        createDefaultUser();
      }
    } else {
      // Create default signed-in user
      createDefaultUser();
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
      reputation: 0, // 0-5 normalized
      karma: 0, // karma points
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

