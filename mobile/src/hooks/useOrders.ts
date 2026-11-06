import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyOrders, createOrder, updateOrderStatus, OrderData } from '../services/supabase/order-service';

/**
 * Hook to fetch current user's orders
 */
export const useMyOrders = (userId: string) => {
  return useQuery({
    queryKey: ['my-orders', userId],
    queryFn: () => getMyOrders(userId),
    enabled: !!userId,
    select: (data) => data.orders,
  });
};

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: OrderData) => createOrder(orderData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders', variables.customer_id] });
    },
  });
};

/**
 * Hook to update order status
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: string }) => 
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};

/**
 * Hook to fetch orders received by an artisan
 */
export const useArtisanOrders = (artisanId: string) => {
  return useQuery({
    queryKey: ['artisan-orders', artisanId],
    queryFn: () => getMyOrders(artisanId, true), // Passing true to indicate artisan mode
    enabled: !!artisanId,
    select: (data) => data.orders,
  });
};
