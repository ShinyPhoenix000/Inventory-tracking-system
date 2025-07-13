import React from 'react';
import { Package, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface StatsCardsProps {
  products: Product[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ products }) => {
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.quantity < p.threshold).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Inventory Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Stock',
      value: totalQuantity,
      icon: TrendingDown,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;