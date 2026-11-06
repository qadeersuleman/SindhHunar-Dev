import { useQuery } from '@tanstack/react-query';
import { 
  getSindhiProducts, 
  getSindhiArtisans, 
  getFeaturedSindhiProducts,
  getCulturalInfo,
  searchSindhiCrafts,
  SINDHI_CATEGORIES
} from '../services/supabase/sindhi-crafts';

/**
 * Hook to search Sindhi crafts
 */
export const useSearchSindhiCrafts = (searchTerm: string, filters?: Parameters<typeof searchSindhiCrafts>[1]) => {
  return useQuery({
    queryKey: ['search-sindhi-crafts', searchTerm, filters],
    queryFn: () => searchSindhiCrafts(searchTerm, filters),
    enabled: searchTerm.length >= 2,
    select: (data) => data.products,
  });
};

/**
 * Hook to fetch Sindhi products with optional filters
 */
export const useSindhiProducts = (filters?: Parameters<typeof getSindhiProducts>[0]) => {
  return useQuery({
    queryKey: ['sindhi-products', filters],
    queryFn: () => getSindhiProducts(filters),
    select: (data) => data.products,
  });
};

/**
 * Hook to fetch featured Sindhi products
 */
export const useFeaturedSindhiProducts = (limit?: number) => {
  return useQuery({
    queryKey: ['featured-sindhi-products', limit],
    queryFn: () => getFeaturedSindhiProducts(limit),
    select: (data) => data.products,
  });
};

/**
 * Hook to fetch Sindhi artisans
 */
export const useSindhiArtisans = (filters?: Parameters<typeof getSindhiArtisans>[0]) => {
  return useQuery({
    queryKey: ['sindhi-artisans', filters],
    queryFn: () => getSindhiArtisans(filters),
    select: (data) => data.artisans,
  });
};

/**
 * Hook to fetch cultural info for a category
 */
export const useCulturalInfo = (category: keyof typeof SINDHI_CATEGORIES) => {
  return useQuery({
    queryKey: ['cultural-info', category],
    queryFn: () => getCulturalInfo(category),
  });
};
