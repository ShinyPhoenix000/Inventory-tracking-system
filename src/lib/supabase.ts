import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          sku: string;
          quantity: number;
          price: number;
          threshold: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku: string;
          quantity: number;
          price: number;
          threshold: number;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string;
          quantity?: number;
          price?: number;
          threshold?: number;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          product_id: string;
          quantity: number;
          user_id: string;
          created_at: string;
          status: string;
          total: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity: number;
          user_id: string;
          created_at?: string;
          status?: string;
          total?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity?: number;
          user_id?: string;
          created_at?: string;
          status?: string;
          total?: number;
        };
      };
    };
  };
};