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
  // Check if user profile exists AND is complete in database
  static async checkUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('=== PROFILE CHECK START ===');
      console.log('Checking profile for user ID:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID length:', userId ? userId.length : 'null');
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId);

      console.log('Profile query result:', { 
        profiles_count: profiles ? profiles.length : 0,
        error: error ? error.message : 'No error',
        profiles: profiles
      });

      if (error || !profiles || profiles.length === 0) {
        console.log('No profile found or error occurred');
        return null;
      }

      // If multiple profiles, take the first one (or most recent)
      const profile = profiles[0];
      console.log('Using profile:', {
        profile_user_id: profile.user_id,
        profile_id: profile.id,
        total_profiles: profiles.length
      });

      // Check if profile is complete (simplified check with full_name and company)
      const fullName = profile.full_name;
      const company = profile.company;
      
      console.log('Profile field values:', {
        full_name: fullName,
        full_name_type: typeof fullName,
        full_name_length: fullName ? fullName.length : 'null',
        company: company,
        company_type: typeof company,
        company_length: company ? company.length : 'null'
      });

      // Simple check - just full_name and company
      const isComplete = fullName && 
                        fullName.toString().trim().length > 0 &&
                        company && 
                        company.toString().trim().length > 0;

      console.log('Profile completeness check:', {
        full_name_valid: fullName && fullName.toString().trim().length > 0,
        company_valid: company && company.toString().trim().length > 0,
        isComplete
      });

      // Only return profile if it's complete
      const result = isComplete ? (profile as UserProfile) : null;
      console.log('Final result:', result ? 'Profile is complete - returning profile' : 'Profile is incomplete - returning null');
      console.log('=== PROFILE CHECK END ===');
      
      return result;
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

      // Check if user profile exists and is complete
      const profile = await this.checkUserProfile(user.id);

      // YOUR LOGIC: IF USER HAS COMPLETE PROFILE → FEED, ELSE → ONBOARDING
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
      console.log('Starting signup with email:', email);
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
      // Since you have a trigger that creates profiles, check if it's complete
      console.log('User logged in immediately - checking profile completeness');
      const profile = await this.checkUserProfile(user.id);
      
      return {
        user,
        session,
        profile,
        redirectTo: profile ? '/feed' : '/onboarding',
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

      // Check if user profile exists and is complete
      const profile = await this.checkUserProfile(user.id);

      // YOUR LOGIC: IF USER HAS COMPLETE PROFILE → FEED, ELSE → ONBOARDING
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
