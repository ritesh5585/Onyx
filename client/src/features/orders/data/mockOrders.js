export const mockOrders = [
  {
    id: "ORD-9823749",
    date: "2026-09-28T14:30:00Z",
    status: "delivered", // placed, processing, shipped, out_for_delivery, delivered, cancelled
    totalAmount: 1299.00,
    items: [
      {
        id: "ITEM-1",
        name: "Onyx Signature Gold Watch",
        variant: "Midnight Black / Gold",
        quantity: 1,
        price: 1299.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop"
      }
    ],
    shippingAddress: {
      fullName: "Ateeksh Soni",
      addressLine1: "123 Luxury Avenue",
      addressLine2: "Suite 400",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    paymentMethod: "Credit Card ending in 4242",
    trackingEvents: [
      { status: "placed", date: "2026-09-25T10:00:00Z", description: "Order placed successfully" },
      { status: "processing", date: "2026-09-26T09:00:00Z", description: "Order is being packed" },
      { status: "shipped", date: "2026-09-26T18:00:00Z", description: "Package handed to courier" },
      { status: "out_for_delivery", date: "2026-09-28T08:00:00Z", description: "Out for delivery" },
      { status: "delivered", date: "2026-09-28T14:30:00Z", description: "Delivered to customer" },
    ]
  },
  {
    id: "ORD-9823750",
    date: "2026-10-01T09:15:00Z",
    status: "shipped",
    totalAmount: 450.50,
    items: [
      {
        id: "ITEM-2",
        name: "Premium Leather Wallet",
        variant: "Tan Brown",
        quantity: 1,
        price: 150.50,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop"
      },
      {
        id: "ITEM-3",
        name: "Silk Tie Collection",
        variant: "Emerald Green",
        quantity: 2,
        price: 150.00,
        image: "https://images.unsplash.com/photo-1589756818128-4ceb0e50d60d?q=80&w=300&auto=format&fit=crop"
      }
    ],
    shippingAddress: {
      fullName: "Ateeksh Soni",
      addressLine1: "123 Luxury Avenue",
      addressLine2: "Suite 400",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    paymentMethod: "UPI (Google Pay)",
    trackingEvents: [
      { status: "placed", date: "2026-10-01T09:15:00Z", description: "Order placed successfully" },
      { status: "processing", date: "2026-10-01T14:00:00Z", description: "Order is being packed" },
      { status: "shipped", date: "2026-10-02T10:00:00Z", description: "Package handed to courier" },
    ]
  },
  {
    id: "ORD-9823751",
    date: "2026-10-02T11:00:00Z",
    status: "processing",
    totalAmount: 890.00,
    items: [
      {
        id: "ITEM-4",
        name: "Onyx Cufflinks",
        variant: "Gold / Diamond",
        quantity: 1,
        price: 890.00,
        image: "https://images.unsplash.com/photo-1582046182512-4d2c884cfb9f?q=80&w=300&auto=format&fit=crop"
      }
    ],
    shippingAddress: {
      fullName: "Ateeksh Soni",
      addressLine1: "123 Luxury Avenue",
      addressLine2: "Suite 400",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    paymentMethod: "Wallet Balance",
    trackingEvents: [
      { status: "placed", date: "2026-10-02T11:00:00Z", description: "Order placed successfully" },
      { status: "processing", date: "2026-10-02T11:15:00Z", description: "Order is being packed" },
    ]
  },
  {
    id: "ORD-9823752",
    date: "2026-09-15T18:45:00Z",
    status: "cancelled",
    totalAmount: 320.00,
    items: [
      {
        id: "ITEM-5",
        name: "Classic Sunglasses",
        variant: "Matte Black",
        quantity: 1,
        price: 320.00,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=300&auto=format&fit=crop"
      }
    ],
    shippingAddress: {
      fullName: "Ateeksh Soni",
      addressLine1: "123 Luxury Avenue",
      addressLine2: "Suite 400",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    paymentMethod: "Credit Card ending in 4242",
    trackingEvents: [
      { status: "placed", date: "2026-09-15T18:45:00Z", description: "Order placed successfully" },
      { status: "cancelled", date: "2026-09-16T09:00:00Z", description: "Order cancelled by customer" },
    ]
  }
];
