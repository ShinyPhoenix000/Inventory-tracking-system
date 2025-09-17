import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Brain, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { mockForecastData, mockProductForecast } from '../data/mockData';
import { formatCurrency } from '../lib/utils';

const DemandForecasting: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <div className="bg-purple-100 rounded-lg p-2">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Demand Forecasting</h2>
          <p className="text-gray-600">AI-powered predictions for the next 3 months</p>
        </div>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span>Demand Forecast</span>
          </CardTitle>
          <CardDescription>
            Predicted demand based on historical sales data using moving average analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockForecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(Number(value)), 
                  name === 'predicted' ? 'Predicted Sales' : 'Actual Sales'
                ]} 
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="actual"
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="predicted"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span className="text-gray-600">Actual Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-purple-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #8B5CF6 0, #8B5CF6 5px, transparent 5px, transparent 10px)' }}></div>
              <span className="text-gray-600">Predicted Sales</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product-Specific Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Product Demand Predictions</span>
          </CardTitle>
          <CardDescription>
            Individual product forecasts and restock recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicted Demand (3 months)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suggested Restock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockProductForecast.map((item, index) => {
                  const needsRestock = item.currentStock < item.predictedDemand;
                  const isUrgent = item.currentStock < item.predictedDemand * 0.5;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.currentStock} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.predictedDemand} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.suggestedRestock > 0 ? `${item.suggestedRestock} units` : 'No restock needed'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isUrgent ? 'bg-red-100 text-red-800' :
                          needsRestock ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {isUrgent ? 'Urgent' : needsRestock ? 'Monitor' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-800">Forecasting Methodology</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Our AI model uses a 12-month moving average combined with seasonal trends and market indicators 
                  to predict future demand. Accuracy typically ranges from 85-92% for established products.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandForecasting;