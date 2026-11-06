import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, upsertProfile, uploadAvatar, UserProfile } from '../services/supabase/profile';

export const PROFILE_QUERY_KEY = 'user_profile';

// ─── Fetch Profile ────────────────────────────────────────────────────────────
export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY, userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,          // only runs when userId is available
    staleTime: 1000 * 60 * 5,  // consider data fresh for 5 minutes
  });
};

// ─── Save Profile (upsert + optional avatar upload) ──────────────────────────
interface SaveProfileArgs {
  id: string;
  profile: Partial<Omit<UserProfile, 'id' | 'updated_at'>>;
  localAvatarUri?: string;      // if set, upload this file first
}

export const useSaveProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profile, localAvatarUri }: SaveProfileArgs) => {
      let avatarUrl = profile.avatar_url;

      // Upload new avatar if a local file URI was provided
      if (localAvatarUri && localAvatarUri.startsWith('file://')) {
        avatarUrl = await uploadAvatar(id, localAvatarUri);
      }

      await upsertProfile({
        id,
        ...profile,
        avatar_url: avatarUrl || null,
      });

      return avatarUrl;
    },
    onSuccess: (_result, variables) => {
      // Invalidate the cache so the profile re-fetches fresh data
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY, variables.id] });
    },
  });
};
