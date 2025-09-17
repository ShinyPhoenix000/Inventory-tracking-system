import { useState } from 'react';

export function useProducts(userId: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  async function addProduct(product: any) {
    setProducts([...products, product]);
    return { error: null };
  }
  async function updateProduct(id: string, updates: any) {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    return { error: null };
  }
  async function deleteProduct(id: string) {
    setProducts(products.filter(p => p.id !== id));
    return { error: null };
  }
  async function placeOrder(productId: string, quantity: number) {
    
    return { error: null };
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
  };
}
