import React, { useState } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface OrderFormProps {
  products: Product[];
  onPlaceOrder: (productId: string, quantity: number) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ products, onPlaceOrder }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [error, setError] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    if (!selectedProduct) {
      setError('Selected product not found');
      return;
    }

    if (orderQuantity > selectedProduct.quantity) {
      setError('Order quantity exceeds available stock');
      return;
    }

    if (orderQuantity <= 0) {
      setError('Order quantity must be greater than 0');
      return;
    }

    onPlaceOrder(selectedProductId, orderQuantity);
    setSelectedProductId('');
    setOrderQuantity(1);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-orange-100 rounded-lg p-2">
          <ShoppingCart className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Place Order</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a product...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.sku} (Stock: {product.quantity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Quantity
          </label>
          <input
            type="number"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max={selectedProduct?.quantity || 1}
          />
        </div>

        {selectedProduct && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Order Summary:</span>
            </div>
            <div className="space-y-1 text-sm text-blue-700">
              <div>Product: {selectedProduct.name}</div>
              <div>Available Stock: {selectedProduct.quantity}</div>
              <div>Unit Price: ${selectedProduct.price.toFixed(2)}</div>
              <div className="font-semibold">
                Total: ${(selectedProduct.price * orderQuantity).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedProductId || products.length === 0}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Place Order</span>
        </button>
      </form>
    </div>
  );
};

export default OrderForm;