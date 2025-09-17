import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings,
  LogOut,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg h-screen w-64 fixed left-0 top-0 z-30 lg:relative lg:z-0 transition-colors">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-blue-600 rounded-lg p-2">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">InventoryPro</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-white font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;