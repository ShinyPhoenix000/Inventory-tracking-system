// Mock data for analytics and forecasting
export const mockSalesData = [
  { month: 'Jan', sales: 4000, orders: 24 },
  { month: 'Feb', sales: 3000, orders: 18 },
  { month: 'Mar', sales: 5000, orders: 32 },
  { month: 'Apr', sales: 4500, orders: 28 },
  { month: 'May', sales: 6000, orders: 38 },
  { month: 'Jun', sales: 5500, orders: 35 },
];

export const mockCategoryData = [
  { name: 'Electronics', value: 45, color: '#3B82F6' },
  { name: 'Accessories', value: 30, color: '#10B981' },
  { name: 'Clothing', value: 15, color: '#F59E0B' },
  { name: 'Books', value: 10, color: '#EF4444' },
];

export const mockHeatmapData = [
  { product: 'Wireless Headphones', velocity: 85, color: '#10B981' },
  { product: 'Bluetooth Speaker', velocity: 45, color: '#F59E0B' },
  { product: 'Phone Case', velocity: 92, color: '#10B981' },
  { product: 'Laptop Stand', velocity: 30, color: '#EF4444' },
  { product: 'USB Cable', velocity: 78, color: '#10B981' },
  { product: 'Wireless Mouse', velocity: 55, color: '#F59E0B' },
];

export const mockForecastData = [
  { month: 'Jul', predicted: 6200, actual: 5800 },
  { month: 'Aug', predicted: 6800, actual: null },
  { month: 'Sep', predicted: 7200, actual: null },
  { month: 'Oct', predicted: 6900, actual: null },
];

export const mockProductForecast = [
  { product: 'Wireless Headphones', currentStock: 25, predictedDemand: 45, suggestedRestock: 30 },
  { product: 'Bluetooth Speaker', currentStock: 5, predictedDemand: 25, suggestedRestock: 35 },
  { product: 'Phone Case', currentStock: 150, predictedDemand: 80, suggestedRestock: 0 },
  { product: 'Laptop Stand', currentStock: 12, predictedDemand: 20, suggestedRestock: 15 },
];