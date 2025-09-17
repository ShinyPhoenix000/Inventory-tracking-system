import React from 'react';
import { AlertTriangle, Package, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Product } from '../types';

interface RestockSuggestionsProps {
  products: Product[];
  onRestock: (productId: string, quantity: number) => void;
}

const RestockSuggestions: React.FC<RestockSuggestionsProps> = ({ products, onRestock }) => {
  const lowStockProducts = products.filter(product => product.quantity < product.threshold);

  const calculateSuggestedRestock = (product: Product) => {
    // Simple logic: suggest restocking to 2x threshold or minimum 20 units
    return Math.max(product.threshold * 2 - product.quantity, 20);
  };

  const handleRestock = (product: Product) => {
    const suggestedQuantity = calculateSuggestedRestock(product);
    if (confirm(`Restock ${product.name} with ${suggestedQuantity} units?`)) {
      onRestock(product.id, suggestedQuantity);
    }
  };

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-600" />
            <span>Smart Restock Suggestions</span>
          </CardTitle>
          <CardDescription>AI-powered inventory management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">All Stock Levels Good!</h3>
            <p className="text-gray-600">No products need restocking at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Smart Restock Suggestions</span>
        </CardTitle>
        <CardDescription>
          {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} below threshold
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.map((product) => {
            const suggestedQuantity = calculateSuggestedRestock(product);
            const urgencyLevel = product.quantity === 0 ? 'critical' : 
                               product.quantity < product.threshold * 0.5 ? 'high' : 'medium';
            
            return (
              <div
                key={product.id}
                className={`p-4 rounded-lg border-l-4 ${
                  urgencyLevel === 'critical' ? 'border-red-500 bg-red-50' :
                  urgencyLevel === 'high' ? 'border-orange-500 bg-orange-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-800">{product.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        urgencyLevel === 'critical' ? 'bg-red-100 text-red-800' :
                        urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {urgencyLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span>Current: {product.quantity} units</span>
                      <span className="mx-2">•</span>
                      <span>Threshold: {product.threshold} units</span>
                      <span className="mx-2">•</span>
                      <span>SKU: {product.sku}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-800">
                      Suggested restock: {suggestedQuantity} units
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleRestock(product)}
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Restock Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RestockSuggestions;