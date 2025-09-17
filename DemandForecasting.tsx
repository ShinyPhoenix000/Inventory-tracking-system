import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Loader2, LineChart } from 'lucide-react';
import { supabase } from './lib/supabase';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface ForecastEntry {
  product_id: string;
  product_name: string;
  product_sku: string;
  total_quantity: number;
  predicted_demand: number;
}

const DemandForecasting: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          product_id,
          quantity,
          created_at,
          products (
            name,
            sku
          )
        `);

      if (error) throw error;

      const grouped = new Map<string, ForecastEntry>();

      for (const order of data || []) {
        const id = order.product_id;
        const name = order.products?.name || 'Unknown';
        const sku = order.products?.sku || '';
        const existing = grouped.get(id);

        if (existing) {
          existing.total_quantity += order.quantity;
        } else {
          grouped.set(id, {
            product_id: id,
            product_name: name,
            product_sku: sku,
            total_quantity: order.quantity,
            predicted_demand: 0,
          });
        }
      }

      const forecastData: ForecastEntry[] = Array.from(grouped.values()).map((entry) => ({
        ...entry,
        predicted_demand: Math.round(entry.total_quantity * 1.1),
      }));

      setForecast(forecastData);
    } catch (err) {
      console.error('Error fetching forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <Card className="dark:bg-gray-900 dark:text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LineChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Demand Forecasting</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading forecast data...</span>
          </div>
        ) : forecast.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No order data available for forecasting.</p>
        ) : (
          <>
            {/* Forecast Table */}
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">SKU</th>
                    <th className="p-2 text-right">Total Ordered</th>
                    <th className="p-2 text-right">Predicted Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.map((entry) => (
                    <tr key={entry.product_id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2">{entry.product_name}</td>
                      <td className="p-2">{entry.product_sku}</td>
                      <td className="p-2 text-right">{entry.total_quantity}</td>
                      <td className="p-2 text-right text-blue-600 dark:text-blue-400 font-semibold">
                        {entry.predicted_demand}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Area Chart */}
            <div className="h-72 mb-12">
              <h4 className="text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">
                Forecast Area Chart
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="product_name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Area
                    type="monotone"
                    dataKey="predicted_demand"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorForecast)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="h-72">
              <h4 className="text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">
                Total Ordered vs Predicted Demand
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="product_name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="total_quantity" fill="#60A5FA" name="Total Ordered" />
                  <Bar dataKey="predicted_demand" fill="#2563EB" name="Predicted Demand" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DemandForecasting;