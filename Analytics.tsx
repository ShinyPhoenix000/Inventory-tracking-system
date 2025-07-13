import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { BarChart3, Loader2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { supabase } from '../lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  mostPopularProduct: string;
  revenueByProduct: { name: string; revenue: number }[];
  ordersByHour: { hour: string; count: number }[];
  stockVsSales: { name: string; sold: number; stock: number }[];
  salesVelocity: { name: string; velocity: number }[];
}

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`id, quantity, created_at, product_id, products ( name, price, quantity )`);

      if (error) throw error;

      if (!orders || orders.length === 0) {
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          mostPopularProduct: 'None',
          revenueByProduct: [],
          ordersByHour: [],
          stockVsSales: [],
          salesVelocity: [],
        });
        return;
      }

      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.quantity * (order.products?.price || 0));
      }, 0);

      const totalOrders = orders.length;

      const productCount: Record<string, number> = {};
      const productRevenue: Record<string, number> = {};
      const productStock: Record<string, number> = {};
      const hourlyCount: Record<number, number> = {};

      orders.forEach(order => {
        const name = order.products?.name || 'Unknown';
        const revenue = order.quantity * (order.products?.price || 0);

        productCount[name] = (productCount[name] || 0) + order.quantity;
        productRevenue[name] = (productRevenue[name] || 0) + revenue;
        productStock[name] = order.products?.quantity || 0;

        const hour = new Date(order.created_at).getHours();
        hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
      });

      const mostPopularProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0][0];

      const revenueByProduct = Object.entries(productRevenue).map(([name, revenue]) => ({ name, revenue }));

      const stockVsSales = Object.keys(productCount).map(name => ({
        name,
        sold: productCount[name],
        stock: productStock[name],
      }));

      const ordersByHour = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        count: hourlyCount[hour] || 0,
      }));

      const allDates = orders.map(o => new Date(o.created_at).toDateString());
      const uniqueDays = new Set(allDates).size || 1;
      const salesVelocity = Object.keys(productCount).map(name => ({
        name,
        velocity: +(productCount[name] / uniqueDays).toFixed(2),
      }));

      setStats({
        totalRevenue,
        totalOrders,
        mostPopularProduct,
        revenueByProduct,
        ordersByHour,
        stockVsSales,
        salesVelocity,
      });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !stats) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700 dark:text-blue-300">Loading analytics...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 text-gray-800 dark:text-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {stats.totalOrders}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Top Product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium text-gray-800 dark:text-gray-100">
              {stats.mostPopularProduct}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Revenue by Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.revenueByProduct}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.revenueByProduct.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
             <Tooltip contentStyle={{backgroundColor: '#1f2937',color: '#f9fafb',border: 'none',}}
                    labelStyle={{ color: '#f9fafb' }}
                    itemStyle={{ color: '#f9fafb' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Peak Order Times</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ordersByHour}>
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb' }} />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Stock vs Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.stockVsSales}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb' }} />
              <Bar dataKey="sold" fill="#34d399" name="Sold" />
              <Bar dataKey="stock" fill="#fbbf24" name="Stock" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
  <CardHeader>
    <CardTitle className="dark:text-gray-100">Sales Velocity (Radial)</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.salesVelocity.map((item, idx) => {
        const percentage = Math.min(item.velocity * 10, 100);
        return (
          <div className="flex flex-col items-center" key={idx}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Progress', value: percentage },
                    { name: 'Remainder', value: 100 - percentage },
                  ]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={45}
                  outerRadius={60}
                  dataKey="value"
                >
                  <Cell fill="#4f46e5" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.name}</p>
              <p className="text-xs text-gray-500">{item.velocity} units/day</p>
            </div>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>
    </div>
  );
};

export default Analytics;