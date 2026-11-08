import { supabase, Product } from './supabase';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  birthdate?: string | null;
  gender?: string | null;
  role: 'customer' | 'artisan' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface Artisan {
  id: string;
  owner_id: string;
  shop_name: string;
  specialty: string[];
  rating: number;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface Order {
  id: string;
  customer_id?: string | null;
  artisan_id?: string | null;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    name?: string;
    phone?: string;
    city?: string;
    address?: string;
    notes?: string;
  };
  phone?: string | null;
  notes?: string | null;
  created_at?: string;
  profiles?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  artisans?: {
    shop_name?: string;
  } | null;
}

// ==========================================
// 1. PRODUCTS SERVICES
// ==========================================

export async function fetchLiveProducts(): Promise<{ data: Product[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        artisans (
          id,
          shop_name,
          specialty,
          rating
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts warning:', error.message);
      return { data: [], error };
    }

    return { data: (data as Product[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export async function addProductRecord(newProduct: {
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  description?: string;
  images: string[];
  is_available?: boolean;
  stock_quantity?: number;
  materials?: string[];
  artisan_id?: string;
  rating?: number;
}): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        subcategory: newProduct.subcategory || null,
        description: newProduct.description || null,
        images: newProduct.images || [],
        is_available: newProduct.is_available ?? true,
        stock_quantity: newProduct.stock_quantity ?? 10,
        materials: newProduct.materials || [],
        artisan_id: newProduct.artisan_id || null,
        rating: newProduct.rating ?? 5.0,
      })
      .select()
      .single();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateProductRecord(
  id: string,
  updates: Partial<Product>
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteProductRecord(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

// ==========================================
// 2. ARTISANS SERVICES
// ==========================================

export async function fetchAllArtisans(): Promise<{ data: Artisan[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .order('shop_name', { ascending: true });

    return { data: (data as Artisan[]) || [], error };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export async function fetchArtisanByOwnerId(ownerId: string): Promise<{ data: Artisan | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .eq('owner_id', ownerId)
      .maybeSingle();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function upsertArtisanRecord(artisanData: {
  owner_id: string;
  shop_name: string;
  specialty?: string[];
  rating?: number;
  is_active?: boolean;
}): Promise<{ data: any; error: any }> {
  try {
    // Check if artisan already exists for this owner
    const { data: existing } = await supabase
      .from('artisans')
      .select('id')
      .eq('owner_id', artisanData.owner_id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('artisans')
        .update({
          shop_name: artisanData.shop_name,
          specialty: artisanData.specialty || ['Traditional Crafts'],
          rating: artisanData.rating ?? 5.0,
          is_active: artisanData.is_active ?? true,
        })
        .eq('id', existing.id)
        .select()
        .single();
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from('artisans')
        .insert({
          owner_id: artisanData.owner_id,
          shop_name: artisanData.shop_name,
          specialty: artisanData.specialty || ['Traditional Crafts'],
          rating: artisanData.rating ?? 5.0,
          is_active: artisanData.is_active ?? true,
        })
        .select()
        .single();
      return { data, error };
    }
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteArtisanRecord(ownerId: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('artisans')
      .delete()
      .eq('owner_id', ownerId);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

// ==========================================
// 3. PROFILES & ROLES SERVICES
// ==========================================

export async function fetchAllProfiles(): Promise<{ profiles: UserProfile[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    return { profiles: (data as UserProfile[]) || [], error };
  } catch (err: any) {
    return { profiles: [], error: err };
  }
}

export async function fetchUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    return { profile: data as UserProfile | null, error };
  } catch (err: any) {
    return { profile: null, error: err };
  }
}

export async function updateUserRoleInDb(
  userId: string,
  role: 'customer' | 'artisan' | 'admin'
): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

// ==========================================
// 4. ORDERS SERVICES
// ==========================================

export async function fetchLiveOrders(filters?: {
  customerId?: string;
  status?: string;
}): Promise<{ orders: Order[]; error: any }> {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        profiles (
          name,
          email,
          phone
        ),
        artisans (
          shop_name
        )
      `);

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { orders: (data as Order[]) || [], error };
  } catch (err: any) {
    return { orders: [], error: err };
  }
}

export async function createOrderRecord(orderData: {
  customer_id?: string | null;
  artisan_id?: string | null;
  items: OrderItem[];
  total_amount: number;
  status?: string;
  shipping_address: {
    name?: string;
    phone?: string;
    city?: string;
    address?: string;
    notes?: string;
  };
  phone?: string | null;
  notes?: string | null;
}): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_id: orderData.customer_id || null,
        artisan_id: orderData.artisan_id || null,
        items: orderData.items,
        total_amount: orderData.total_amount,
        status: orderData.status || 'pending',
        shipping_address: orderData.shipping_address,
        phone: orderData.phone || orderData.shipping_address?.phone || null,
        notes: orderData.notes || orderData.shipping_address?.notes || null,
      })
      .select()
      .single();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateOrderStatusInDb(
  orderId: string,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}
