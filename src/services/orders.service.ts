import { supabase } from '../lib/supabase';
import { z } from 'zod';

const OrderSchema = z.object({
  quote_id: z.string().uuid(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  total: z.number().positive(),
  adjustment_type: z.enum(['discount', 'surcharge']).optional(),
  adjustment_percentage: z.number().min(0).max(100).optional(),
  adjusted_total: z.number().positive().optional(),
});

const ReceiptSchema = z.object({
  order_id: z.string().uuid(),
  payment_percentage: z.number().min(0).max(100),
  amount: z.number().positive(),
  status: z.enum(['draft', 'sent']).default('draft'),
});

export async function createOrder(orderData: z.infer<typeof OrderSchema>) {
  try {
    const validatedData = OrderSchema.parse(orderData);

    const { data, error } = await supabase
      .from('orders')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        quote:quotes(*),
        receipts(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw error;
  }
}

export async function getOrderById(id: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        quote:quotes(*),
        receipts(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
}

export async function createReceipt(receiptData: z.infer<typeof ReceiptSchema>) {
  try {
    const validatedData = ReceiptSchema.parse(receiptData);

    const { data, error } = await supabase
      .from('receipts')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in createReceipt:', error);
    throw error;
  }
}

export async function updateReceiptStatus(id: string, status: 'sent') {
  try {
    const { data, error } = await supabase
      .from('receipts')
      .update({ 
        status,
        sent_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateReceiptStatus:', error);
    throw error;
  }
}