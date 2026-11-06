import { supabase } from './client';
import RNFS from 'react-native-fs';
import { decode } from 'base64-arraybuffer';

export interface UserProfile {
  id: string; // This is the auth.uid()
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  birthdate: string | null;
  gender: string | null;
  role: 'customer' | 'artisan' | 'admin';
  updated_at?: string;
}

/**
 * Fetch the profile for the currently logged-in user.
 */
export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data ?? null;
};

/**
 * Upsert (create or update) the user's profile.
 */
export const upsertProfile = async (profile: Partial<UserProfile> & { id: string }): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' });

  if (error) throw error;
};

/**
 * Upload a profile avatar to Supabase Storage and return the public URL.
 * The file path should be a local `file://` URI.
 */
export const uploadAvatar = async (
  userId: string,
  localUri: string
): Promise<string> => {
  const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${userId}/avatar.${ext}`;

  const cleanUri = localUri.replace('file://', '');
  
  // Read file as base64
  const base64Str = await RNFS.readFile(cleanUri, 'base64');
  const arrayBuffer = decode(base64Str);

  // Map jpg to jpeg for proper MIME type support in Supabase bucket restrictions
  const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, { upsert: true, contentType: mimeType });

  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
  return data.publicUrl;
};
