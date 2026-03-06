import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthState } from '@/types';
import { authService } from '@/services/auth.api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isSuperAdmin: boolean;
  isUniversityAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Sync with storage on mount
    const storedUser = localStorage.getItem('routemate_user') || sessionStorage.getItem('routemate_user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setAuthState({
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        logout();
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await authService.login(credentials);
      
      // FIX: Match your backend structure: { status, token, data: { user } }
      const { token, data } = response;
      const userWithToken = { ...data.user, token };

      if (credentials.rememberMe) {
        localStorage.setItem('routemate_user', JSON.stringify(userWithToken));
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('routemate_user', JSON.stringify(userWithToken));
        localStorage.setItem('token', token); // Token usually needs to stay for refresh
      }

      setAuthState({
        user: userWithToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Throw so the Modal's catch block can show the toast
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await authService.register(data);
      
      // FIX: Match your backend structure
      const { token, data: responseData } = response;
      const userWithToken = { ...responseData.user, token };

      localStorage.setItem('routemate_user', JSON.stringify(userWithToken));
      localStorage.setItem('token', token);

      setAuthState({
        user: userWithToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('routemate_user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('routemate_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('routemate_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  const isSuperAdmin = authState.user?.role === 'SUPER_ADMIN';
  const isUniversityAdmin = authState.user?.role === 'UNIVERSITY_ADMIN';

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile,
      isSuperAdmin,
      isUniversityAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}