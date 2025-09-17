
import React, { useState } from 'react';
import Dashboard from '../Dashboard';
import Login from '../Login';
import { User } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  
  return (
    <div className="min-h-screen bg-blue-100">
      {user ? <Dashboard user={user} /> : <Login setUser={setUser} />}
    </div>
  );
};

export default App;
