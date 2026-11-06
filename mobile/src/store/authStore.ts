import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, signIn, signUp, signOut, signInWithOtp, verifyOtp, signInWithGoogle } from '../services/supabase/auth';
import { useAppDispatch, useAppSelector } from './hooks';
import { setAuth, clearAuth, setInitialLoading } from './slices/authSlice';
import { useEffect } from 'react';

// Module-level flag — shared across ALL useAuth() instances (AppNavigator, screens, etc.)
// A per-hook useRef would give each component its own copy, breaking the logout guard
let isLoggingOut = false;

export const useAuth = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialLoading } = useAppSelector((state) => state.auth);

  // Server State: Get current user
  const {
    data: userData,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Sync React Query user with Redux auth state
  useEffect(() => {
    console.log('[AUTH useEffect] fired →', {
      isLoggingOut: isLoggingOut,
      hasUser: !!userData?.user,
      userId: userData?.user?.id,
      email_confirmed_at: userData?.user?.email_confirmed_at,
      isQueryLoading,
    });

    // Guard: if logout is in progress, ignore any query updates
    if (isLoggingOut) {
      console.log('[AUTH useEffect] Skipped — logout in progress');
      return;
    }

    // Only auto-login if user is confirmed and has a real session
    if (userData?.user?.email_confirmed_at && userData?.user?.id) {
      console.log('[AUTH useEffect] Dispatching setAuth ✅');
      dispatch(setAuth({ 
        token: 'session-token', 
        role: (userData.user as any).role || 'customer' 
      }));
    } else if (!isQueryLoading) {
      // No user found and not loading — mark as not authenticated
      console.log('[AUTH useEffect] No user found → setInitialLoading(false)');
      dispatch(setInitialLoading(false));
    }
  }, [userData, isQueryLoading, dispatch]);

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await signIn(email, password);
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
        dispatch(setAuth({ 
          token: 'session-token', 
          role: (data.user as any).user_metadata?.role || 'customer' 
        }));
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const data = await signUp(email, password, name);
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
      }
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log('[LOGOUT] mutationFn start — setting isLoggingOut = true');
      isLoggingOut = true;
      const result = await signOut();
      console.log('[LOGOUT] signOut() completed, error:', result.error);
      return result;
    },
    onSuccess: () => {
      console.log('[LOGOUT] onSuccess → dispatching clearAuth');
      dispatch(clearAuth());
      console.log('[LOGOUT] onSuccess → removing queries');
      queryClient.removeQueries({ queryKey: ['auth', 'user'] });
      setTimeout(() => {
        console.log('[LOGOUT] Guard reset after 500ms');
        isLoggingOut = false;
      }, 500);
    },
    onError: (err) => {
      console.log('[LOGOUT] onError →', err);
      isLoggingOut = false;
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const data = await signInWithOtp(email);
      if (data.error) throw data.error;
      return data;
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, token, type }: { email: string; token: string; type?: 'magiclink' | 'signup' | 'recovery' | 'email_change' }) => {
      const data = await verifyOtp(email, token, type);
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
        dispatch(setAuth({ 
          token: 'session-token', 
          role: (data.user as any).user_metadata?.role || 'customer' 
        }));
      }
    },
  });

  const signInWithGoogleMutation = useMutation({
    mutationFn: async () => {
      const data = await signInWithGoogle();
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
        // Invalidate profile cache so AppNavigator always fetches
        // the REAL role from the profiles table (not user_metadata)
        queryClient.invalidateQueries({ queryKey: ['user_profile', data.user.id] });
        console.log('[GOOGLE LOGIN] Profile cache invalidated for user:', data.user.id);
        dispatch(setAuth({
          token: 'session-token',
          role: (data.user as any).user_metadata?.role || 'customer',
        }));
      }
    },
  });

  return {
    user: userData?.user || null,
    isAuthenticated,
    isInitialized: !isInitialLoading && !isQueryLoading,
    loading: signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending || sendOtpMutation.isPending || verifyOtpMutation.isPending || signInWithGoogleMutation.isPending,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    logout: signOutMutation.mutateAsync,
    sendOtp: sendOtpMutation.mutateAsync,
    verifyOtp: verifyOtpMutation.mutateAsync,
    signInWithGoogle: signInWithGoogleMutation.mutateAsync,
    refetch,
  };
};




