import { supabase } from './client';
import type { Tables } from './client';

export type Product = Tables['products']['Row'];
export type ProductInsert = Tables['products']['Insert'];
export type ProductUpdate = Tables['products']['Update'];
export type Category = Tables['categories']['Row'];

export interface ProductResponse {
  products: Product[];
  error: Error | null;
}

export interface SingleProductResponse {
  product: Product | null;
  error: Error | null;
}

export const getProducts = async (filters?: {
  category?: string;
  artisanId?: string;
  subcategory?: string;
  materials?: string[];
  available?: boolean;
  customizable?: boolean;
  limit?: number;
  offset?: number;
}): Promise<ProductResponse> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        artisans (
          id,
          shop_name,
          logo_url,
          rating,
          profiles:owner_id (
            name,
            avatar_url
          )
        )

      `);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }

    if (filters?.artisanId) {
      query = query.eq('artisan_id', filters.artisanId);
    }

    if (filters?.materials && filters.materials.length > 0) {
      query = query.contains('materials', filters.materials);
    }

    if (filters?.available !== undefined) {
      query = query.eq('is_available', filters.available);
    }

    if (filters?.customizable !== undefined) {
      query = query.eq('is_customizable', filters.customizable);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { products: data || [], error: null };
  } catch (error) {
    return { products: [], error: error as Error };
  }
};

export const getProductById = async (id: string): Promise<SingleProductResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        artisans (
          id,
          shop_name,
          logo_url,
          rating,
          address,
          phone,
          profiles:owner_id (
            name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { product: data, error: null };
  } catch (error) {
    return { product: null, error: error as Error };
  }
};

export const createProduct = async (product: ProductInsert): Promise<SingleProductResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;

    return { product: data, error: null };
  } catch (error) {
    return { product: null, error: error as Error };
  }
};

export const updateProduct = async (id: string, updates: ProductUpdate): Promise<SingleProductResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { product: data, error: null };
  } catch (error) {
    return { product: null, error: error as Error };
  }
};

export const deleteProduct = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getArtisanProducts = async (artisanId: string): Promise<ProductResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('artisan_id', artisanId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { products: data || [], error: null };
  } catch (error) {
    return { products: [], error: error as Error };
  }
};

export const searchProducts = async (searchTerm: string, filters?: {
  category?: string;
  materials?: string[];
  limit?: number;
}): Promise<ProductResponse> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        artisans (
          id,
          shop_name,
          logo_url,
          rating
        )
      `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('is_available', true);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.materials && filters.materials.length > 0) {
      query = query.contains('materials', filters.materials);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('rating', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { products: data || [], error: null };
  } catch (error) {
    return { products: [], error: error as Error };
  }
};

// Category Management Functions
export const getCategories = async (): Promise<{ categories: Category[]; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return { categories: data || [], error: null };
  } catch (error) {
    return { categories: [], error: error as Error };
  }
};

// Real-time subscription for products
export const subscribeToProducts = (callback: (payload: any) => void, filters?: {
  artisanId?: string;
  category?: string;
}) => {
  let channel = supabase.channel('products-changes');

  if (filters?.artisanId || filters?.category) {
    channel = channel.on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'products',
        filter: filters?.artisanId ? `artisan_id=eq.${filters.artisanId}` : 
               filters?.category ? `category=eq.${filters.category}` : undefined
      }, 
      callback
    );
  } else {
    channel = channel.on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, 
      callback
    );
  }

  return channel.subscribe();
};

// Image upload for products
export const uploadProductImages = async (productId: string, imageUris: string[]): Promise<{ urls: string[]; error: Error | null }> => {
  try {
    const urls: string[] = [];
    
    for (let i = 0; i < imageUris.length; i++) {
      const fileName = `products/${productId}/${Date.now()}_${i}.jpg`;
      
      const response = await fetch(imageUris[i]);
      const blob = await response.blob();
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
      
      urls.push(publicUrl);
    }
    
    return { urls, error: null };
  } catch (error) {
    return { urls: [], error: error as Error };
  }
};
