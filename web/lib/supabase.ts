import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hypsawmgxqxsgaqfgzfk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zcTvi5bpcT51ec9j6LnA6w_5iA5RGIJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  description?: string;
  images: string[];
  is_available?: boolean;
  stock_quantity?: number;
  materials?: string[];
  rating?: number;
  artisan_id?: string;
  artisan_name?: string;
  created_at?: string;
  artisans?: {
    id?: string;
    shop_name?: string;
    specialty?: string[] | string;
    rating?: number;
  };
}
