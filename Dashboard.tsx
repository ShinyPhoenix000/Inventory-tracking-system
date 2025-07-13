import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useProducts } from '../hooks/useProducts';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import OrderForm from './OrderForm';
import StatsCards from './StatsCards';
import LoadingSpinner from './LoadingSpinner';
import Analytics from './Analytics';
import Settings from './Settings';
import OrderHistory from './OrderHistory';
import RestockSuggestions from './RestockSuggestions';
import DemandForecasting from './DemandForecasting';
import ReportGenerator from './ReportGenerator';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
  } = useProducts(user?.id);

  const handleAddProduct = async (productData: any) => {
    const { error } = await addProduct(productData);
    if (error) {
      alert(`Error adding product: ${error}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await deleteProduct(id);
      if (error) {
        alert(`Error deleting product: ${error}`);
      }
    }
  };

  const handlePlaceOrder = async (productId: string, quantity: number) => {
    const { error } = await placeOrder(productId, quantity);
    if (error) {
      alert(`Error placing order: ${error}`);
    } else {
      console.log('Order placed successfully');
    }
  };

  const handleRestock = async (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newQuantity = product.quantity + quantity;
    const { error } = await updateProduct(productId, { quantity: newQuantity });
    if (error) {
      alert(`Error restocking product: ${error}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-center flex items-center justify-center">
        <div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <StatsCards products={products} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ProductForm onAddProduct={handleAddProduct} />
                  </div>
                  <div>
                    <OrderForm products={products} onPlaceOrder={handlePlaceOrder} />
                  </div>
                </div>

                <ProductTable products={products} onDeleteProduct={handleDeleteProduct} />

                <RestockSuggestions products={products} onRestock={handleRestock} />
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-8">
                <ProductForm onAddProduct={handleAddProduct} />
                <ProductTable products={products} onDeleteProduct={handleDeleteProduct} />
                <RestockSuggestions products={products} onRestock={handleRestock} />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8">
                <OrderForm products={products} onPlaceOrder={handlePlaceOrder} />
                <OrderHistory />
              </div>
            )}

            {activeTab === 'analytics' && <Analytics products={products} />}

            {activeTab === 'forecasting' && <DemandForecasting />}

            {activeTab === 'reports' && <ReportGenerator />}

            {activeTab === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;