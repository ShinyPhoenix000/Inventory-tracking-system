import React, { useState } from 'react';
import { Bell, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from './hooks/useAuth';

interface NavbarProps {
  user: SupabaseUser;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log('🔍 Search:', value); // For future filter integration
  };

  const notifications = [
    { id: 1, text: 'New order placed' },
    { id: 2, text: 'Low stock warning' },
    { id: 3, text: 'Weekly report ready' },
  ];

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0]?.replace(/^\w/, c => c.toUpperCase()) ||
    'User';

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Bell Icon with dropdown */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <li key={n.id} className="p-3 text-sm text-gray-700 hover:bg-gray-50">
                      {n.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">{fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;