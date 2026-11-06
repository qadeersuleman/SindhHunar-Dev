import { supabase } from './client';


export interface OrderData {
  customer_id: string;
  artisan_id: string;
  items: any[];
  total_amount: number;
  shipping_address: any;
  phone: string;
  notes?: string;
}

/**
 * Create a new order in Supabase
 */
export const createOrder = async (orderData: OrderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: orderData.customer_id,
          artisan_id: orderData.artisan_id,
          items: orderData.items,
          total_amount: orderData.total_amount, // Reverted to standard spelling
          shipping_address: orderData.shipping_address,
          phone: orderData.phone,
          notes: orderData.notes,
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Order creation failed: No data returned');
    
    return data[0];
  } catch (error: any) {
    console.error('❌ [ORDER SERVICE ERROR]:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }
};

/**
 * Get orders for the current user (as customer or artisan)
 */
export const getMyOrders = async (id: string, isArtisan: boolean = false) => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:profiles!orders_customer_id_fkey (
          name,
          email,
          phone
        ),
        artisans (
          shop_name
        ),
        payments (
          payment_method,
          payment_status
        )
      `);

    if (isArtisan) {
      console.log('Fetching orders for artisan_id:', id);
      query = query.eq('artisan_id', id);
    } else {
      console.log('Fetching orders for customer_id:', id);
      query = query.eq('customer_id', id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database query error details:', JSON.stringify(error, null, 2));
      throw error;
    }
    
    console.log(`✅ Successfully fetched ${data?.length || 0} orders`);
    return { orders: data || [], error: null };
  } catch (error: any) {
    console.error('❌ Service error in getMyOrders:', error?.message || error);
    return { orders: [], error: error as Error };
  }
};

/**
 * Update order status (for artisans)
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return { order: data[0], error: null };
  } catch (error) {
    return { order: null, error: error as Error };
  }
};
