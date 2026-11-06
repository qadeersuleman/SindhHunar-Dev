import { supabase } from './client';

export interface PaymentData {
  order_id: string;
  customer_id: string;
  artisan_id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id?: string;
  sender_name?: string;
}

/**
 * Create a new payment record in Supabase
 */
export const createPayment = async (paymentData: PaymentData) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          order_id: paymentData.order_id,
          customer_id: paymentData.customer_id,
          artisan_id: paymentData.artisan_id,
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          payment_status: paymentData.payment_status,
          transaction_id: paymentData.transaction_id,
          sender_name: paymentData.sender_name,
        }
      ])
      .select();

    if (error) throw error;
    return { payment: data[0], error: null };
  } catch (error) {
    return { payment: null, error: error as Error };
  }
};

/**
 * Get payment details for an order
 */
export const getPaymentByOrderId = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return { payment: data, error: null };
  } catch (error) {
    return { payment: null, error: error as Error };
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (paymentId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ payment_status: status, updated_at: new Date() })
      .eq('id', paymentId)
      .select();

    if (error) throw error;
    return { payment: data[0], error: null };
  } catch (error) {
    return { payment: null, error: error as Error };
  }
};
