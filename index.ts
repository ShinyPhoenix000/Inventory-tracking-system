export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  threshold: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  product_id: string;
  quantity: number;
  user_id: string;
  created_at: string;
}

export interface OrderWithProduct extends Order {
  status: string;
  total: number;
  product_name: string;
  product_price: number;
  product_sku: string;
}

export interface User {
  email: string;
  name: string;
}