"use client";

import { Session, User } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/client";

const supabase = createBrowserSupabase();

// ---------- Types ----------
export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  job_title?: string;
  company?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  created_at?: string;
  updated_at?: string;
}

// ---------- Auth Service ----------
export class AuthService {
  // Check if user profile exists in database
  static async checkUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !profile) {
        return null;
      }

      return profile as UserProfile;
    } catch (error) {
      console.error('Error checking user profile:', error);
      return null;
    }
  }

  // Email/Password Login
  static async loginWithEmail(email: string, password: string): Promise<{
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    redirectTo: string;
    error?: string;
  }> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/login',
          error: error.message,
        };
      }

      const { user, session } = authData;

      if (!session || !user) {
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/login',
          error: 'Failed to create session',
        };
      }

      // Check if user profile exists
      const profile = await this.checkUserProfile(user.id);

      // YOUR LOGIC: IF USER HAS PROFILE → FEED, ELSE → ONBOARDING
      return {
        user,
        session,
        profile,
        redirectTo: profile ? '/feed' : '/onboarding',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        user: null,
        session: null,
        profile: null,
        redirectTo: '/login',
        error: 'An unexpected error occurred',
      };
    }
  }

  // Email/Password Signup
  static async signupWithEmail(email: string, password: string, fullName?: string): Promise<{
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    redirectTo: string;
    error?: string;
  }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/sign-up',
          error: error.message,
        };
      }

      const { user, session } = authData;

      if (!user) {
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/sign-up',
          error: 'Failed to create user',
        };
      }

      // YOUR LOGIC: New users always go to onboarding
      return {
        user,
        session,
        profile: null, // New users don't have profiles yet
        redirectTo: '/onboarding',
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        user: null,
        session: null,
        profile: null,
        redirectTo: '/sign-up',
        error: 'An unexpected error occurred',
      };
    }
  }

  // Google OAuth Login
  static async loginWithGoogle(): Promise<void> {
    try {
      // Get the current origin for redirect URL
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectUrl = `${origin}/auth/callback`;

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  // Handle OAuth callback and redirect
  static async handleOAuthCallback(code: string): Promise<{
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    redirectTo: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/login?error=auth_error',
          error: error.message,
        };
      }

      const { user, session } = data;

      if (!session || !user) {
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/login',
          error: 'Failed to create session',
        };
      }

      // Check if user profile exists
      const profile = await this.checkUserProfile(user.id);

      // YOUR LOGIC: IF USER HAS PROFILE → FEED, ELSE → ONBOARDING
      return {
        user,
        session,
        profile,
        redirectTo: profile ? '/feed' : '/onboarding',
      };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return {
        user: null,
        session: null,
        profile: null,
        redirectTo: '/login',
        error: 'An unexpected error occurred',
      };
    }
  }

  // Check if user has a valid session
  static async ensureValidTokens(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && !!session;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, try again
      await supabase.auth.signOut();
    }
  }

  // Get current user session
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}
