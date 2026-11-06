import { supabase } from './client';
import type { Tables } from './client';

export type Order = Tables['orders']['Row'];
export type OrderInsert = Tables['orders']['Insert'];
export type OrderUpdate = Tables['orders']['Update'];

export interface OrderResponse {
  orders: Order[];
  error: Error | null;
}

export interface SingleOrderResponse {
  order: Order | null;
  error: Error | null;
}

export const getOrders = async (filters?: {
  customerId?: string;
  artisanId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<OrderResponse> => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_customer_id_fkey (
          name,
          email,
          phone
        ),
        artisans (
          shop_name,
          logo_url,
          phone,
          address
        )
      `);

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters?.artisanId) {
      query = query.eq('artisan_id', filters.artisanId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
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
    return { orders: data || [], error: null };
  } catch (error) {
    return { orders: [], error: error as Error };
  }
};

export const getOrderById = async (id: string): Promise<SingleOrderResponse> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_customer_id_fkey (
          name,
          email,
          phone
        ),
        artisans (
          shop_name,
          logo_url,
          phone,
          address,
          owner_id
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { order: data, error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};

export const createOrder = async (order: OrderInsert): Promise<SingleOrderResponse> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select(`
        *,
        stores (
          name,
          logo_url,
          phone,
          address
        )
      `)
      .single();

    if (error) throw error;
    return { order: data, error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<SingleOrderResponse> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { order: data, error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};

export const updateOrder = async (id: string, updates: OrderUpdate): Promise<SingleOrderResponse> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { order: data, error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};

export const cancelOrder = async (id: string): Promise<SingleOrderResponse> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { order: data, error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};

export const getCustomerOrders = async (customerId: string, filters?: {
  status?: string;
  limit?: number;
}): Promise<OrderResponse> => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        stores (
          name,
          logo_url,
          phone,
          address
        )
      `)
      .eq('customer_id', customerId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { orders: data || [], error: null };
  } catch (error) {
    return { orders: [], error: error as Error };
  }
};

export const getStoreOrders = async (storeId: string, filters?: {
  status?: string;
  limit?: number;
}): Promise<OrderResponse> => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_customer_id_fkey (
          name,
          email,
          phone
        )
      `)
      .eq('store_id', storeId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { orders: data || [], error: null };
  } catch (error) {
    return { orders: [], error: error as Error };
  }
};

// Real-time subscription for orders
export const subscribeToOrders = (callback: (payload: any) => void, filters?: {
  customerId?: string;
  storeId?: string;
}) => {
  let channel = supabase.channel('orders-changes');

  if (filters?.customerId || filters?.storeId) {
    channel = channel.on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: filters?.customerId ? `customer_id=eq.${filters.customerId}` : 
               filters?.storeId ? `store_id=eq.${filters.storeId}` : undefined
      }, 
      callback
    );
  } else {
    channel = channel.on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, 
      callback
    );
  }

  return channel.subscribe();
};

// Order statistics
export const getOrderStats = async (storeId?: string, customerId?: string): Promise<{
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  error: Error | null;
}> => {
  try {
    let query = supabase
      .from('orders')
      .select('status');

    if (storeId) {
      query = query.eq('store_id', storeId);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(order => order.status === 'pending').length || 0,
      completed: data?.filter(order => order.status === 'delivered').length || 0,
      cancelled: data?.filter(order => order.status === 'cancelled').length || 0,
      error: null,
    };

    return stats;
  } catch (error) {
    return {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      error: error as Error,
    };
  }
};
