'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchUserProfile, UserProfile, updateUserRoleInDb } from '@/lib/services';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'customer' | 'artisan' | 'admin';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isArtisan: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: any; user: User | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setDevRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(true);

  // Sync profile from Supabase profiles table
  const loadProfile = useCallback(async (currentUserId: string, currentUserEmail?: string, currentUserName?: string) => {
    try {
      const { profile: dbProfile, error } = await fetchUserProfile(currentUserId);
      
      if (dbProfile) {
        setProfile(dbProfile);
        setRole(dbProfile.role || 'customer');
      } else {
        // If row doesn't exist yet, insert a basic profile row
        const newProfile: UserProfile = {
          id: currentUserId,
          email: currentUserEmail || '',
          name: currentUserName || 'Sindh Craft Lover',
          phone: '',
          avatar_url: null,
          role: 'customer',
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .upsert(newProfile, { onConflict: 'id' });

        if (!insertError) {
          setProfile(newProfile);
          setRole('customer');
        } else {
          // Fallback in-memory profile if database policy restricts
          setProfile(newProfile);
          setRole('customer');
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setRole('customer');
    }
  }, []);

  // Initialize Auth
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          setUser(session.user);
          await loadProfile(
            session.user.id, 
            session.user.email, 
            session.user.user_metadata?.name
          );
        } else if (mounted) {
          setUser(null);
          setProfile(null);
          setRole('customer');
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await loadProfile(
          session.user.id, 
          session.user.email, 
          session.user.user_metadata?.name
        );
      } else {
        setUser(null);
        setProfile(null);
        setRole('customer');
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id, user.email, user.user_metadata?.name);
    }
  }, [user, loadProfile]);

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await loadProfile(data.user.id, data.user.email, data.user.user_metadata?.name);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string, name: string, initialRole: UserRole = 'customer') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: initialRole,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Try creating profile record immediately
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            name,
            role: initialRole,
          }, { onConflict: 'id' });
        } catch (e) {
          console.warn('Profile upsert warning:', e);
        }

        setUser(data.user);
        await loadProfile(data.user.id, email, name);
      }

      return { error: null, user: data.user };
    } catch (err: any) {
      return { error: err, user: null };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    } finally {
      setUser(null);
      setProfile(null);
      setRole('customer');
    }
  };

  // Dev / Testing Helper: switch role or update active role in profiles table
  const setDevRole = async (newRole: UserRole) => {
    setRole(newRole);
    if (user && profile) {
      await updateUserRoleInDb(user.id, newRole);
      setProfile({ ...profile, role: newRole });
    }
  };

  const isAdmin = role === 'admin';
  const isArtisan = role === 'artisan';
  const isCustomer = role === 'customer';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isArtisan,
        isCustomer,
        isAuthenticated,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        setDevRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
