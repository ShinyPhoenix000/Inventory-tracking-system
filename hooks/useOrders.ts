import { useState } from 'react';

export function useOrders(userId: string) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  async function addOrder(order: any) {
    setOrders([...orders, order]);
    return { error: null };
  }
  async function updateOrder(id: string, updates: any) {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
    return { error: null };
  }
  async function deleteOrder(id: string) {
    setOrders(orders.filter(o => o.id !== id));
    return { error: null };
  }

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder,
  };
}
