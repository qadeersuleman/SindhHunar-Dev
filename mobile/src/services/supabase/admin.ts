import { supabase } from './client';
import { UserProfile } from './profile';
import { Artisan } from './artisans';

/**
 * Fetch all user profiles for admin management
 */
export const getAllProfiles = async (): Promise<{ profiles: UserProfile[]; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return { profiles: data || [], error };
};

/**
 * Update a user's role
 */
export const updateUserRole = async (userId: string, role: 'customer' | 'artisan' | 'admin'): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  return { error };
};

/**
 * Create or update an artisan record for a user
 */
export const upsertArtisanRecord = async (artisanData: Partial<Artisan>): Promise<{ data: any; error: any }> => {
  // Check if artisan already exists
  const { data: existing } = await supabase
    .from('artisans')
    .select('id')
    .eq('owner_id', artisanData.owner_id)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('artisans')
      .update(artisanData)
      .eq('id', existing.id)
      .select()
      .single();
    return { data, error };
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('artisans')
      .insert(artisanData)
      .select()
      .single();
    return { data, error };
  }
};

/**
 * Delete an artisan record if a user is downgraded from artisan role
 */
export const deleteArtisanRecord = async (ownerId: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('artisans')
    .delete()
    .eq('owner_id', ownerId);

  return { error };
};
