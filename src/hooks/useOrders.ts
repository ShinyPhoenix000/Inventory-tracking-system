import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface OrderWithProduct {
  id: string;
  product_id: string;
  quantity: number;
  user_id: string;
  created_at: string;
  status: string;
  total: number;
  product_name: string;
  product_price: number;
  product_sku: string;
}

export const useOrders = (userId: string | undefined) => {
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          product_id,
          quantity,
          user_id,
          created_at,
          status,
          total,
          products (
            name,
            price,
            sku
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include product details
      const transformedOrders: OrderWithProduct[] = (data || []).map(order => ({
        id: order.id,
        product_id: order.product_id,
        quantity: order.quantity,
        user_id: order.user_id,
        created_at: order.created_at,
        status: order.status || 'completed',
        total: order.total || (order.quantity * (order.products?.price || 0)),
        product_name: order.products?.name || 'Unknown Product',
        product_price: order.products?.price || 0,
        product_sku: order.products?.sku || '',
      }));

      setOrders(transformedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};