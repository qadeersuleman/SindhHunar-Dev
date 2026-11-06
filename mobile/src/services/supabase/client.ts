import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../config/env';

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types for Handcraft E-commerce
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          phone: string | null;
          role: 'customer' | 'artisan' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      artisans: {
        Row: {
          id: string;
          owner_id: string;
          shop_name: string;
          description: string | null;
          logo_url: string | null;
          cover_url: string | null;
          address: string | null;
          phone: string | null;
          specialty: string[];
          rating: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['artisans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['artisans']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          artisan_id: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          subcategory: string | null;
          materials: string[];
          dimensions: { length: number; width: number; height: number; unit: string } | null;
          weight: number | null;
          colors: string[];
          images: string[];
          is_available: boolean;
          is_customizable: boolean;
          production_time: number | null;
          stock_quantity: number;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          artisan_id: string;
          items: {
            product_id: string;
            quantity: number;
            price: number;
          }[];
          total_amount: number;
          status: 'pending' | 'confirmed' | 'crafting' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address: { street: string; city: string; state: string; postal_code: string; country: string };
          phone: string;
          notes: string | null;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
    };
  };
}

export type Tables = Database['public']['Tables'];

export default supabase;
