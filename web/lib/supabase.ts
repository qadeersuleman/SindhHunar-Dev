import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hypsawmgxqxsgaqfgzfk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zcTvi5bpcT51ec9j6LnA6w_5iA5RGIJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  images: string[];
  is_available?: boolean;
  rating?: number;
  artisan_name?: string;
  artisans?: {
    shop_name?: string;
    specialty?: string;
    rating?: number;
  };
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '52f8b1dd-3f77-4630-bcb2-73b053133ff1',
    name: 'Authentic Sindhi Ajrak',
    category: 'Ajrak Printing',
    price: 3500,
    description: 'Authentic handcrafted traditional block-printed Ajrak with natural mineral and vegetable dyes. A heritage of the Indus Valley civilization.',
    rating: 5.0,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/ajrak.jpg'],
    artisans: { shop_name: 'Ustad Ismail Ajrak' },
  },
  {
    id: '82ebc489-4e0a-4b05-9fe6-bbcfc6bc15a1',
    name: 'Royal Embroidered Sindhi Topi',
    category: 'Sindhi Topi',
    price: 2200,
    description: 'Traditional crown-shaped Sindhi Topi with intricate mirror-work and gold thread embroidery, hand-crafted by master artisans.',
    rating: 4.9,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_topi.jpg'],
    artisans: { shop_name: 'Bhit Shah Cap House' },
  },
  {
    id: 'b7ed0065-442d-4eb7-be5d-a4d6ca8a5735',
    name: 'Handcrafted Sindhi Ralli Quilt',
    category: 'Rilli Work',
    price: 8500,
    description: 'Vibrant geometric patchwork quilt stitched meticulously with cotton scraps and detailed applique borders.',
    rating: 5.0,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_quilt.jpg'],
    artisans: { shop_name: 'Sindhi Ralli Artisans' },
  },
  {
    id: '8f69d20c-cbf5-4921-8a01-367dfa8fcff9',
    name: 'Hand-Embroidered Sindhi Kurta',
    category: 'Mirror Work',
    price: 6500,
    description: 'Luxurious Sindhi cotton Kurta featuring traditional Gajj mirror work and floral neck motif embroidery.',
    rating: 4.8,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/traditional_dress.jpg'],
    artisans: { shop_name: 'Ghotki Crafts Hub' },
  },
  {
    id: '64b2b987-ff67-4850-812d-71159076e6b7',
    name: 'Sindhi Cultural Female Dress',
    category: 'Mirror Work',
    price: 7800,
    description: 'Exquisite two-piece cultural dress adorned with traditional mirror embroidery, Sindhi laces, and vibrant color patterns.',
    rating: 4.9,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/female_dress.jpg'],
    artisans: { shop_name: 'Hunar Embroidery Center' },
  },
  {
    id: 'ab7de6a5-b236-482b-b0db-40fcf0cf6ca7',
    name: 'Handmade Sindhi Tote Bag',
    category: 'Block Printing',
    price: 1800,
    description: 'Durable multi-utility tote bag handcrafted with authentic Ajrak pattern and heavy-duty brass zippers.',
    rating: 4.8,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/embroidered_bag.jpg'],
    artisans: { shop_name: 'Hunar Handicrafts' },
  },
  {
    id: '64bf4185-6202-4e89-9d4d-0ceaa9bcc1dd',
    name: 'Sindhi Heritage & Crafts Book',
    category: 'Block Printing',
    price: 1200,
    description: 'Comprehensive illustrated book delving into the timeless history, folk crafts, and artisanal legacy of Sindh.',
    rating: 4.7,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_art_book.jpg'],
    artisans: { shop_name: 'Sindh Literature Society' },
  },
  {
    id: '0fc8be5c-008d-4c27-8df9-ee21f6b84372',
    name: 'Handmade Sindhi Keychain',
    category: 'Mirror Work',
    price: 450,
    description: 'Charming mini cultural keepsake crafted with vibrant threads, tiny beads, and authentic Sindhi mirror work.',
    rating: 4.9,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/handmade_keychain.jpg'],
    artisans: { shop_name: 'Local Hunar Artisans' },
  },
];
