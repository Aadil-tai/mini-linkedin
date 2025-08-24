"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { AuthService, UserProfile } from '@/lib/auth/authService';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasProfile: boolean;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    redirectTo: string;
    error?: string;
  }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh user profile from database
  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await AuthService.checkUserProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setProfile(null);
    }
  }, [user]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const currentSession = await AuthService.getCurrentSession();
        const currentUser = await AuthService.getCurrentUser();
        
        setSession(currentSession);
        setUser(currentUser);

        // If user exists, get their profile
        if (currentUser) {
          const userProfile = await AuthService.checkUserProfile(currentUser.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in, get their profile
        const userProfile = await AuthService.checkUserProfile(session.user.id);
        setProfile(userProfile);
      } else if (event === 'SIGNED_OUT') {
        // User signed out, clear profile
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refreshed, update session but keep profile
        console.log('Token refreshed successfully');
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-refresh tokens when they're about to expire
  useEffect(() => {
    const interval = setInterval(async () => {
      if (session) {
        await AuthService.ensureValidTokens();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [session]);

  // Login with email and password
  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await AuthService.loginWithEmail(email, password);
      
      if (result.error) {
        return {
          success: false,
          redirectTo: '/login',
          error: result.error,
        };
      }

      // Update local state
      setUser(result.user);
      setSession(result.session);
      setProfile(result.profile);

      return {
        success: true,
        redirectTo: result.redirectTo,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        redirectTo: '/login',
        error: 'An unexpected error occurred',
      };
    }
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    return AuthService.loginWithGoogle();
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Refresh tokens manually
  const refreshTokens = useCallback(async () => {
    return AuthService.refreshTokens();
  }, []);

  const isAuthenticated = !!user && !!session;
  const hasProfile = !!profile;

  return {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    hasProfile,
    login,
    loginWithGoogle,
    logout,
    refreshTokens,
    refreshProfile,
  };
}
