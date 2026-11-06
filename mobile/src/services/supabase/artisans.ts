import { supabase } from './client';
import type { Tables } from './client';

export type Artisan = Tables['artisans']['Row'];
export type ArtisanInsert = Tables['artisans']['Insert'];
export type ArtisanUpdate = Tables['artisans']['Update'];

export interface ArtisanResponse {
  artisans: Artisan[];
  error: Error | null;
}

export interface SingleArtisanResponse {
  artisan: Artisan | null;
  error: Error | null;
}

// Artisan/Shop Management Functions
export const getArtisans = async (filters?: {
  active?: boolean;
  specialty?: string;
  limit?: number;
  offset?: number;
}): Promise<ArtisanResponse> => {
  try {
    let query = supabase
      .from('artisans')
      .select(`
        *,
        profiles!artisans_owner_id_fkey (
          name,
          email,
          phone,
          avatar_url
        ),
        products (
          id,
          name,
          price,
          images,
          is_available,
          rating,
          category
        )
      `);

    if (filters?.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }

    if (filters?.specialty) {
      query = query.contains('specialty', [filters.specialty]);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    query = query.order('rating', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { artisans: data || [], error: null };
  } catch (error) {
    return { artisans: [], error: error as Error };
  }
};

export const getArtisanById = async (id: string): Promise<SingleArtisanResponse> => {
  try {
    const { data, error } = await supabase
      .from('artisans')
      .select(`
        *,
        profiles!artisans_owner_id_fkey (
          name,
          email,
          phone,
          avatar_url
        ),
        products (
          id,
          name,
          price,
          images,
          is_available,
          rating,
          category,
          description,
          materials,
          production_time
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { artisan: data, error: null };
  } catch (error) {
    return { artisan: null, error: error as Error };
  }
};

export const createArtisan = async (artisan: ArtisanInsert): Promise<SingleArtisanResponse> => {
  try {
    const { data, error } = await supabase
      .from('artisans')
      .insert(artisan)
      .select()
      .single();

    if (error) throw error;
    return { artisan: data, error: null };
  } catch (error) {
    return { artisan: null, error: error as Error };
  }
};

export const updateArtisan = async (id: string, updates: ArtisanUpdate): Promise<SingleArtisanResponse> => {
  try {
    const { data, error } = await supabase
      .from('artisans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { artisan: data, error: null };
  } catch (error) {
    return { artisan: null, error: error as Error };
  }
};

export const getMyArtisanShop = async (ownerId: string): Promise<SingleArtisanResponse> => {
  try {
    const { data, error } = await supabase
      .from('artisans')
      .select(`
        *,
        products (
          id,
          name,
          price,
          images,
          is_available,
          rating,
          category,
          stock_quantity,
          materials,
          production_time
        )
      `)
      .eq('owner_id', ownerId)
      .single();

    if (error) throw error;
    return { artisan: data, error: null };
  } catch (error) {
    return { artisan: null, error: error as Error };
  }
};

export const searchArtisans = async (searchTerm: string, filters?: {
  specialty?: string;
  limit?: number;
}): Promise<ArtisanResponse> => {
  try {
    let query = supabase
      .from('artisans')
      .select(`
        *,
        profiles!artisans_owner_id_fkey (
          name,
          email,
          phone
        )
      `)
      .or(`shop_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('is_active', true);

    if (filters?.specialty) {
      query = query.contains('specialty', [filters.specialty]);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('rating', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { artisans: data || [], error: null };
  } catch (error) {
    return { artisans: [], error: error as Error };
  }
};

// Real-time subscription for artisans
export const subscribeToArtisans = (callback: (payload: any) => void) => {
  const channel = supabase.channel('artisans-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'artisans' 
      }, 
      callback
    )
    .subscribe();

  return channel;
};

// Artisan image upload functions
export const uploadArtisanLogo = async (artisanId: string, imageUri: string): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const fileName = `artisans/${artisanId}/logo_${Date.now()}.jpg`;
    
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('artisans')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('artisans')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
};

export const uploadArtisanCover = async (artisanId: string, imageUri: string): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const fileName = `artisans/${artisanId}/cover_${Date.now()}.jpg`;
    
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('artisans')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('artisans')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
};
