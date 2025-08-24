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

  // Check if email already exists by attempting sign in with a dummy password
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      // Try to sign in with a dummy password
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-that-wont-match-123!@#',
      });

      if (!error) {
        // This should never happen with a dummy password, but if it does, email exists
        return true;
      }

      // Check the error message to determine if email exists
      if (error.message.includes('Invalid login credentials') ||
          error.message.includes('Wrong password') ||
          error.message.includes('Invalid credentials') ||
          error.message.includes('Too many requests')) {
        // These errors indicate the email exists but password is wrong
        return true;
      }

      if (error.message.includes('User not found') ||
          error.message.includes('Email not found') ||
          error.message.includes('Invalid email')) {
        // These errors indicate email doesn't exist
        return false;
      }

      // For any other error, assume email might exist (safer approach)
      console.warn('Unknown auth error when checking email:', error.message);
      return false; // Default to allowing signup attempt
    } catch (error) {
      console.error('Error checking email existence:', error);
      // On error, allow signup attempt
      return false;
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
      console.log('Starting signup with email:', email);

      // First, check if email already exists
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        console.log('Email already exists in system');
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/sign-up',
          error: 'An account with this email already exists. Please sign in instead.',
        };
      }

      console.log('EmailRedirectTo:', `${window.location.origin}/auth/callback`);
      
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

      console.log('Signup response:', { authData, error });

      if (error) {
        console.error('Signup error:', error);
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/sign-up',
          error: error.message,
        };
      }

      const { user, session } = authData;

      // Check for the case where Supabase doesn't throw an error but user creation failed
      if (!user) {
        console.error('No user returned from signup');
        return {
          user: null,
          session: null,
          profile: null,
          redirectTo: '/sign-up',
          error: 'Failed to create user account',
        };
      }

      console.log('User created:', user.id, 'Session:', session ? 'exists' : 'null');

      // If email confirmation is required, session will be null
      if (!session) {
        console.log('Email confirmation required - no session yet');
        return {
          user,
          session: null,
          profile: null,
          redirectTo: '/sign-up', // Stay on sign-up page to show email sent message
        };
      }

      // If session exists, user is immediately logged in (email confirmation disabled)
      console.log('User logged in immediately - email confirmation disabled');
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
