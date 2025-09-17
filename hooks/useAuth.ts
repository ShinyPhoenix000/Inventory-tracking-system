import { useState } from 'react';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string) {
    
    if (email && password) {
      const demoUser = {
        id: '1',
        email,
        name: 'Demo User',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: new Date().toISOString(),
      };
      setUser(demoUser as User);
      return { error: null, user: demoUser };
    }
    return { error: { message: 'Invalid credentials' }, user: null };
  }

  async function signUp(email: string, password: string) {
    
    if (email && password) {
      const demoUser = {
        id: '1',
        email,
        name: 'Demo User',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: new Date().toISOString(),
      };
      setUser(demoUser as User);
      return { error: null, user: demoUser };
    }
    return { error: { message: 'Sign up failed' }, user: null };
  }

  return { user, signIn, signUp, setUser };
}
