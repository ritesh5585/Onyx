import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, RefreshCw, Calendar, Hash, DollarSign, XCircle } from 'lucide-react';
import OrderTimeline from './OrderTimeline';

const OrderCard = ({ order, onCancel }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'shipped': return 'text-onyx-gold bg-onyx-gold/10 border-onyx-gold/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-onyx-muted bg-onyx-surface border-onyx-border';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="onyx-card overflow-hidden transition-all duration-300 hover:border-onyx-gold/30 hover:shadow-[0_8px_30px_rgba(196,154,82,0.1)] group">
      {/* Card Header - Summary */}
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer p-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center gap-8 flex-1">
          <div className="group-hover:translate-x-1 transition-transform duration-300">
            <p className="onyx-eyebrow !mb-1 flex items-center gap-1.5 text-onyx-muted"><Hash size={12} className="text-onyx-gold"/> Order ID</p>
            <p className="font-sans font-semibold text-onyx-text">{order._id || order.id}</p>
          </div>
          <div className="group-hover:translate-x-1 transition-transform duration-300 delay-75">
            <p className="onyx-eyebrow !mb-1 flex items-center gap-1.5 text-onyx-muted"><Calendar size={12} className="text-onyx-gold"/> Date Placed</p>
            <p className="font-sans text-onyx-text">{new Date(order.createdAt || order.date).toLocaleDateString()}</p>
          </div>
          <div className="group-hover:translate-x-1 transition-transform duration-300 delay-150">
            <p className="onyx-eyebrow !mb-1 flex items-center gap-1.5 text-onyx-muted"><DollarSign size={12} className="text-onyx-gold"/> Total Amount</p>
            <p className="font-sans text-onyx-gold font-semibold">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-4 md:mt-0">
          <span className={`px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-full border ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          <button className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-onyx-gold/10 text-onyx-gold' : 'text-onyx-muted hover:bg-onyx-surface hover:text-onyx-gold'}`}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 mt-6 pt-6 border-t border-onyx-border' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        
        {/* Timeline Tracking */}
        <div className="mb-8">
          <h4 className="onyx-eyebrow">Tracking Status</h4>
          <OrderTimeline currentStatus={order.status} trackingEvents={order.trackingEvents} />
        </div>

        {/* 2 Column Layout for Items and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="onyx-eyebrow">Items in this order</h4>
            {order.items.map((item) => (
              <div key={item._id || item.id} className="group/item flex gap-4 p-4 rounded-xl bg-onyx-surface/50 border border-onyx-border hover:border-onyx-border-hover hover:bg-onyx-surface transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg w-20 h-20 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
                  <div className="absolute inset-0 bg-black/10 group-hover/item:bg-transparent transition-colors duration-300" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h5 className="font-serif text-lg text-onyx-text group-hover/item:text-onyx-gold transition-colors duration-300">{item.name}</h5>
                  <p className="text-[11px] uppercase tracking-widest text-onyx-muted mt-1">{item.variant}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[11px] font-semibold text-onyx-muted">QTY: {item.quantity}</p>
                    <p className="font-sans font-semibold text-onyx-text">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping & Payment Details */}
          <div className="space-y-6">
            <div className="p-5 rounded-lg bg-onyx-black border border-onyx-border">
              <h4 className="onyx-eyebrow">Shipping Address</h4>
              <p className="font-semibold text-onyx-text mt-2">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-onyx-muted mt-1 leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && <br />}
                {order.shippingAddress.addressLine2}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="p-5 rounded-lg bg-onyx-black border border-onyx-border">
              <h4 className="onyx-eyebrow">Payment Information</h4>
              <p className="text-sm text-onyx-text mt-2">{order.paymentMethod}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button className="onyx-btn-secondary">
                <ExternalLink size={16} className="mr-2" /> View Invoice
              </button>
              {order.status === 'delivered' && (
                <button className="onyx-btn-primary">
                  <RefreshCw size={16} className="mr-2" /> Return / Exchange
                </button>
              )}
              {['placed', 'processing'].includes(order.status) && (
                <button 
                  onClick={() => onCancel(order._id || order.id)}
                  className="onyx-btn-secondary !text-red-500 !border-red-500/30 hover:!bg-red-500/10"
                >
                  <XCircle size={16} className="mr-2" /> Cancel Order
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderCard;
