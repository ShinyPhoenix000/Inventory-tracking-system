import React from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="font-inter">
      {user ? (
        <Dashboard user={user} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;