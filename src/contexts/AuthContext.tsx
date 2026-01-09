/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, fetchUserAttributes } from 'aws-amplify/auth';
import { User } from '@/types';
import { mockUsers } from '@/services/mockData';

/**
 * Authentication context type definition
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ isSignUpComplete: boolean; userId: string }>;
  confirmSignup: (email: string, code: string) => Promise<void>;
}

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider with AWS Cognito Integration
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isCognitoConfigured = Boolean(
    import.meta.env.VITE_COGNITO_USER_POOL_ID && import.meta.env.VITE_COGNITO_CLIENT_ID
  );
  const mockStorageKey = 'mockAuthUser';
  const adminEmails = ['admin@library.com'];

  const readMockUser = (): User | null => {
    try {
      const raw = localStorage.getItem(mockStorageKey);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  };

  const writeMockUser = (nextUser: User | null) => {
    if (!nextUser) {
      localStorage.removeItem(mockStorageKey);
      return;
    }
    localStorage.setItem(mockStorageKey, JSON.stringify(nextUser));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isCognitoConfigured) {
          setUser(readMockUser());
          return;
        }
        const cognitoUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setUser({
          id: cognitoUser.userId,
          email: attributes.email || '',
          name: attributes.name || cognitoUser.username,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!isCognitoConfigured) {
        const normalizedEmail = email.trim().toLowerCase();
        const matchingMock = mockUsers.find((mockUser) => mockUser.email === email);
        const isAdmin = adminEmails.includes(normalizedEmail);
        const mockUser: User = matchingMock || {
          id: email,
          email,
          name: email.split('@')[0] || 'User',
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };
        setUser(mockUser);
        writeMockUser(mockUser);
        return;
      }
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        const cognitoUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setUser({
          id: cognitoUser.userId,
          email: attributes.email || email,
          name: attributes.name || cognitoUser.username,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (!isCognitoConfigured) {
        setUser(null);
        writeMockUser(null);
        return;
      }
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      if (!isCognitoConfigured) {
        const normalizedEmail = email.trim().toLowerCase();
        const isAdmin = adminEmails.includes(normalizedEmail);
        const mockUser: User = {
          id: email,
          email,
          name: name || email.split('@')[0] || 'User',
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };
        setUser(mockUser);
        writeMockUser(mockUser);
        return { isSignUpComplete: true, userId: mockUser.id };
      }
      const { isSignUpComplete, userId } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name
          }
        }
      });
      return { isSignUpComplete, userId: userId || '' };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignup = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      if (!isCognitoConfigured) {
        return;
      }
      await confirmSignUp({ username: email, confirmationCode: code });
    } catch (error) {
      console.error('Confirm signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    confirmSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
