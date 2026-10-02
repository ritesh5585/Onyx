import React, { useState, useMemo } from 'react';
import Layout from '../../Shared/Layout';
import OrderCard from '../components/OrderCard';
import { useOrder } from '../hooks/useOrder';
import EmptyState from '../../components/EmptyState'; // Assuming this exists, if not we'll create a simple one or just handle it

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { orders, fetchMyOrders, handleCancelOrder, isLoading, error } = useOrder();

  React.useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  }, [activeTab, orders]);

  return (
    <Layout showBackButton={true}>
      <div className="min-h-[60vh] pb-24 pt-8 onyx-container">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 border-b border-onyx-border/70 pb-6 sm:pb-8">
          <p className="onyx-eyebrow mb-3">Order History</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-onyx-text">
            My Orders
          </h1>
          <div className="onyx-divider" />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 border-b border-onyx-border/40">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-onyx-gold text-onyx-black shadow-[var(--shadow-onyx-glow)]'
                  : 'bg-transparent text-onyx-muted hover:text-onyx-text hover:bg-onyx-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="py-16 text-center bg-onyx-surface rounded-xl border border-onyx-border">
              <p className="onyx-eyebrow mb-3 animate-pulse">Loading Archive</p>
              <h3 className="font-serif text-2xl text-onyx-text mb-2">Fetching your orders...</h3>
            </div>
          ) : error ? (
            <div className="py-16 text-center bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
               <p className="font-sans font-semibold">Error loading orders: {error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center bg-onyx-surface rounded-xl border border-onyx-border">
              <p className="onyx-eyebrow mb-3">No Orders Found</p>
              <h3 className="font-serif text-2xl text-onyx-text mb-2">Looks like you don't have any orders here</h3>
              <p className="text-sm text-onyx-muted max-w-md mx-auto">
                When you place an order or filter for a specific status, it will appear here.
              </p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <OrderCard key={order._id || order.id} order={order} onCancel={handleCancelOrder} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
