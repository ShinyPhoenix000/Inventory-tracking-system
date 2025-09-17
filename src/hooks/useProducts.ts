import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const useProducts = (userId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, user_id: userId }])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const deleteProduct = async (id: string) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { error };
    }
  };

  const placeOrder = async (productId: string, quantity: number) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      // First, get the product to calculate total
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      const total = product.price * quantity;

      // Create the order record
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          product_id: productId,
          quantity,
          user_id: userId,
          status: 'completed',
          total
        }]);

      if (orderError) throw orderError;

      // Then update the product quantity
      const newQuantity = product.quantity - quantity;
      const { data, error: updateError } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', productId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      setProducts(prev => prev.map(p => p.id === productId ? data : p));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
    refetch: fetchProducts,
  };
};