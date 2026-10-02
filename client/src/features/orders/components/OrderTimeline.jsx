import React from 'react';
import { CheckCircle, Package, Truck, Home, XCircle } from 'lucide-react';

const OrderTimeline = ({ currentStatus, trackingEvents }) => {
  const steps = [
    { key: 'placed', label: 'Order Placed', icon: Package },
    { key: 'processing', label: 'Processing', icon: Package }, // Used same icon for simplicity, could change
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home },
  ];

  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 text-red-500 py-4">
        <XCircle size={24} />
        <div>
          <h4 className="font-semibold font-sans">Order Cancelled</h4>
          <p className="text-sm text-onyx-muted mt-1">This order was cancelled and will not be shipped.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex(step => step.key === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="py-8">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-onyx-border -translate-y-1/2 rounded-full hidden sm:block"></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-onyx-gold -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
          {steps.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isCurrent = index === activeIndex;
            const Icon = step.icon;
            
            // Find event detail if exists
            const eventDetail = trackingEvents.find(e => e.status === step.key);

            return (
              <div key={step.key} className="flex sm:flex-col items-center sm:items-center sm:w-32 relative z-10 gap-4 sm:gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-onyx-gold border-onyx-gold text-onyx-black shadow-[var(--shadow-onyx-glow)]' 
                      : 'bg-onyx-surface border-onyx-border text-onyx-muted'
                  }`}
                >
                  {isCompleted && step.key === 'delivered' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                
                {/* Mobile line connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-onyx-border sm:hidden">
                    {isCompleted && index < activeIndex && (
                      <div className="w-full h-full bg-onyx-gold"></div>
                    )}
                  </div>
                )}

                <div className="text-left sm:text-center flex-1 pt-1 sm:pt-0">
                  <p className={`text-sm font-semibold font-sans ${isCompleted ? 'text-onyx-text' : 'text-onyx-muted'}`}>
                    {step.label}
                  </p>
                  {eventDetail && (
                    <p className="text-[11px] text-onyx-muted2 mt-1 hidden sm:block">
                      {new Date(eventDetail.date).toLocaleDateString()}
                    </p>
                  )}
                  {eventDetail && (
                     <p className="text-[12px] text-onyx-muted mt-0.5 sm:hidden">
                       {eventDetail.description} - {new Date(eventDetail.date).toLocaleDateString()}
                     </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
