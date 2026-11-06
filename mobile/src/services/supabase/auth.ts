import { supabase } from './client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID, SUPABASE_URL, SUPABASE_ANON_KEY } from '../../config/env';
import type { Tables } from './client';

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  scopes: ['profile', 'email'],
});

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
  role?: 'customer' | 'artisan' | 'admin';
  email_confirmed_at?: string;
}

export type Profile = Tables['profiles']['Row'];

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return { user: data.user as User, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user as User, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signInWithOtp = async (email: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This will send a 6-digit code if the provider is configured for it, 
        // or a magic link by default.
        shouldCreateUser: true,
      },
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const verifyOtp = async (email: string, token: string, type: 'magiclink' | 'signup' | 'recovery' | 'email_change' = 'magiclink'): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    if (error) throw error;
    return { user: data.user as User, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    await GoogleSignin.hasPlayServices();
    // Sign out first to always force the account chooser screen
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    
    if (userInfo.data?.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });
      if (error) throw error;
      return { user: data.user as User, error: null };
    } else {
      throw new Error('No ID token present!');
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return { user: null, error: new Error('User cancelled the login flow') };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return { user: null, error: new Error('Sign in is in progress already') };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { user: null, error: new Error('Play services not available or outdated') };
    } else {
      return { user: null, error: error as Error };
    }
  }
};

export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    // Try to sign out from Google — wrapped in its own try/catch
    // so any GoogleSignin error NEVER blocks the Supabase signout below
    try {
      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      if (isSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch (googleError) {
      // Non-critical — log and continue
      console.warn('[LOGOUT] Google sign-out step failed (non-critical):', googleError);
    }

    // Always sign out from Supabase regardless of Google result
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    if (!SUPABASE_URL || SUPABASE_URL.includes('your-project') || SUPABASE_ANON_KEY === 'your-anon-key') {
      return { user: null, error: null };
    }
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return { user: null, error };
    }
    return { user: (data?.user as User) || null, error: null };
  } catch (error) {
    return { user: null, error: null };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    callback(session?.user as User || null);
  });
};

// Profile Management Functions
export const getProfile = async (userId: string): Promise<{ profile: Profile | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error: error as Error };
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<{ profile: Profile | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error: error as Error };
  }
};

export const uploadAvatar = async (userId: string, fileUri: string): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const fileName = `avatars/${userId}/${Date.now()}`;
    
    // For React Native, we need to fetch the file first
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
};
