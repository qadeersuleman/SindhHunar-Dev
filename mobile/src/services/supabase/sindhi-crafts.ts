import { supabase } from './client';
import type { Tables } from './client';

export type SindhiProduct = Tables['products']['Row'];
export type SindhiArtisan = Tables['artisans']['Row'];

// Sindhi Cultural Categories
export const SINDHI_CATEGORIES = {
  RILLI_WORK: 'Rilli Work',
  SINDHI_TOPI: 'Sindhi Topi', 
  AJRAK_PRINTING: 'Ajrak Printing',
  BLUE_POTTERY: 'Blue Pottery',
  MIRROR_WORK: 'Mirror Work',
  BLOCK_PRINTING: 'Block Printing',
  TRADITIONAL_CRAFTS: 'Traditional Crafts'
} as const;

// Sindhi Materials
export const SINDHI_MATERIALS = [
  'cotton', 'natural dyes', 'clay', 'thread', 'mirror', 
  'velvet', 'silk thread', 'cobalt', 'natural glaze',
  'wool', 'beads', 'sequins', 'natural pigments'
] as const;

// Sindhi Colors with Cultural Significance
export const SINDHI_COLORS = [
  { name: 'deep red', meaning: 'Love and passion' },
  { name: 'indigo blue', meaning: 'Royalty and spirituality' },
  { name: 'white', meaning: 'Purity and peace' },
  { name: 'yellow', meaning: 'Happiness and prosperity' },
  { name: 'green', meaning: 'Nature and fertility' },
  { name: 'black', meaning: 'Strength and protection' },
  { name: 'orange', meaning: 'Energy and enthusiasm' },
  { name: 'maroon', meaning: 'Tradition and heritage' }
] as const;

// Sindhi Artisan Specialties
export const SINDHI_SPECIALTIES = [
  'Rilli Work',
  'Ajrak Printing', 
  'Sindhi Topi Making',
  'Blue Pottery',
  'Mirror Work',
  'Block Printing',
  'Traditional Embroidery',
  'Clay Crafts',
  'Natural Dye Making',
  'Hand Weaving'
] as const;

// Get Sindhi Cultural Products
export const getSindhiProducts = async (filters?: {
  category?: keyof typeof SINDHI_CATEGORIES;
  materials?: string[];
  colors?: string[];
  priceRange?: { min?: number; max?: number };
  customizable?: boolean;
  inStock?: boolean;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        artisans (
          id,
          shop_name,
          specialty,
          rating,
          profiles:owner_id (
            name,
            avatar_url
          )
        )

      `);

    // Filter by Sindhi categories
    if (filters?.category) {
      query = query.eq('category', SINDHI_CATEGORIES[filters.category]);
    }

    // Filter by materials
    if (filters?.materials && filters.materials.length > 0) {
      query = query.contains('materials', filters.materials);
    }

    // Filter by colors
    if (filters?.colors && filters.colors.length > 0) {
      query = query.contains('colors', filters.colors);
    }

    // Filter by price range
    if (filters?.priceRange?.min) {
      query = query.gte('price', filters.priceRange.min);
    }
    if (filters?.priceRange?.max) {
      query = query.lte('price', filters.priceRange.max);
    }

    // Filter by customization
    if (filters?.customizable !== undefined) {
      query = query.eq('is_customizable', filters.customizable);
    }

    // Filter by stock
    if (filters?.inStock !== undefined) {
      query = query.eq('is_available', filters.inStock);
    }

    // Limit results
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    // query = query.order('rating', { ascending: false });
    
    console.log('Attempting fetch from products table...');
    const { data, error } = await query;

    console.log('getSindhiProducts raw result:', { data, error });
    console.log('getSindhiProducts result summary:', { count: data?.length, error });

    if (error) throw error;
    return { products: data || [], error: null };
  } catch (error) {
    console.error('getSindhiProducts error:', error);
    return { products: [], error: error as Error };
  }
};

// Get Sindhi Artisans by Specialty
export const getSindhiArtisans = async (filters?: {
  specialty?: string;
  region?: string;
  rating?: number;
  active?: boolean;
  limit?: number;
}) => {
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
          rating,
          images
        )
      `);

    // Filter by specialty
    if (filters?.specialty) {
      query = query.contains('specialty', [filters.specialty]);
    }

    // Filter by rating
    if (filters?.rating) {
      query = query.gte('rating', filters.rating);
    }

    // Filter by active status
    if (filters?.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }

    // Limit results
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

// Search Sindhi Cultural Products
export const searchSindhiCrafts = async (searchTerm: string, filters?: {
  category?: keyof typeof SINDHI_CATEGORIES;
  materials?: string[];
  priceRange?: { min?: number; max?: number };
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        artisans (
          shop_name,
          specialty,
          rating
        )
      `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .eq('is_available', true);

    // Filter by Sindhi category
    if (filters?.category) {
      query = query.eq('category', SINDHI_CATEGORIES[filters.category]);
    }

    // Filter by materials
    if (filters?.materials && filters.materials.length > 0) {
      query = query.contains('materials', filters.materials);
    }

    // Filter by price range
    if (filters?.priceRange?.min) {
      query = query.gte('price', filters.priceRange.min);
    }
    if (filters?.priceRange?.max) {
      query = query.lte('price', filters.priceRange.max);
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

// Get Cultural Information
export const getCulturalInfo = async (category: keyof typeof SINDHI_CATEGORIES) => {
  const culturalData = {
    [SINDHI_CATEGORIES.RILLI_WORK]: {
      description: 'Traditional Sindhi patchwork textile art featuring geometric patterns and vibrant colors',
      significance: 'Symbol of Sindhi heritage and family traditions, often passed down through generations',
      materials: ['cotton', 'thread', 'mirrors', 'beads'],
      productionTime: '7-20 days depending on complexity',
      culturalUse: 'Weddings, festivals, home decoration'
    },
    [SINDHI_CATEGORIES.SINDHI_TOPI]: {
      description: 'Traditional Sindhi cap with intricate embroidery and mirror work',
      significance: 'Part of traditional Sindhi dress, symbol of Sindhi pride and cultural identity',
      materials: ['velvet', 'silk thread', 'mirrors', 'beads'],
      productionTime: '3-7 days',
      culturalUse: 'Cultural events, festivals, traditional ceremonies'
    },
    [SINDHI_CATEGORIES.AJRAK_PRINTING]: {
      description: 'Ancient Sindhi block printing technique with natural dyes and distinctive patterns',
      significance: 'National identity symbol of Sindh, worn by Sindhi people for centuries',
      materials: ['cotton', 'natural dyes', 'wooden blocks'],
      productionTime: '5-15 days',
      culturalUse: 'Traditional garments, festivals, cultural ceremonies'
    },
    [SINDHI_CATEGORIES.BLUE_POTTERY]: {
      description: 'Traditional clay pottery with distinctive blue glaze and hand-painted designs',
      significance: 'Ancient technique dating back to Indus Valley, represents Sindhi craftsmanship',
      materials: ['clay', 'natural glazes', 'cobalt oxide'],
      productionTime: '7-21 days including firing and drying',
      culturalUse: 'Home decoration, kitchenware, traditional architecture'
    },
    [SINDHI_CATEGORIES.MIRROR_WORK]: {
      description: 'Traditional embroidery incorporating small mirrors for decorative effect',
      significance: 'Adds sparkle and beauty to textiles, represents celebration and joy',
      materials: ['fabric', 'thread', 'mirrors', 'sequins'],
      productionTime: '4-12 days',
      culturalUse: 'Festive clothing, home decoration, wedding items'
    },
    [SINDHI_CATEGORIES.BLOCK_PRINTING]: {
      description: 'Hand-block printing on fabric using carved wooden blocks',
      significance: 'Preserves traditional patterns and natural dye techniques',
      materials: ['cotton fabric', 'natural dyes', 'carved wooden blocks'],
      productionTime: '3-10 days',
      culturalUse: 'Bedsheets, tablecloths, curtains, garments'
    },
    [SINDHI_CATEGORIES.TRADITIONAL_CRAFTS]: {
      description: 'Various traditional Sindhi handicrafts preserving cultural heritage',
      significance: 'Represents diverse cultural heritage and traditional skills',
      materials: ['various traditional materials'],
      productionTime: 'Varies by craft',
      culturalUse: 'Cultural preservation, education, decoration'
    }
  };

  return culturalData[SINDHI_CATEGORIES[category]] || null;
};

// Get Featured Sindhi Products
export const getFeaturedSindhiProducts = async (limit: number = 6) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        artisans (
          shop_name,
          specialty,
          rating
        )
      `)
      .in('category', Object.values(SINDHI_CATEGORIES))
      .eq('is_available', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { products: data || [], error: null };
  } catch (error) {
    return { products: [], error: error as Error };
  }
};

// Subscribe to Sindhi Product Updates
export const subscribeToSindhiProducts = (callback: (payload: any) => void, filters?: {
  category?: keyof typeof SINDHI_CATEGORIES;
  artisanId?: string;
}) => {
  // Use a unique channel name to avoid collisions and "already subscribed" errors
  const channelId = `sindhi-products-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  let channel = supabase.channel(channelId);

  const filter = filters?.category ? 
    `category=eq.${SINDHI_CATEGORIES[filters.category]}` : 
    filters?.artisanId ? 
    `artisan_id=eq.${filters.artisanId}` : 
    undefined;

  if (filter) {
    channel = channel.on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'products',
        filter
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
