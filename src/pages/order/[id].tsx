import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaBox, FaShippingFast, FaCheckCircle, FaMapMarkerAlt, FaArrowLeft, FaPrint } from "react-icons/fa";

// Mock order data (same as in orders.tsx)
const mockOrders = [
  {
    id: "ORD-1234",
    date: "August 15, 2023",
    total: 189.99,
    status: "delivered",
    items: [
      { id: 1, name: "Wireless Headphones", price: 99.99, quantity: 1, image: "/images/product-1.jpg" },
      { id: 2, name: "Smart Watch", price: 149.99, quantity: 1, image: "/images/product-2.jpg" }
    ],
    tracking: {
      number: "TRK48976543",
      carrier: "FedEx",
      estimatedDelivery: "August 18, 2023",
      updates: [
        { status: "Order Placed", date: "August 15, 2023", time: "10:30 AM", completed: true },
        { status: "Processing", date: "August 15, 2023", time: "2:45 PM", completed: true },
        { status: "Shipped", date: "August 16, 2023", time: "9:15 AM", completed: true },
        { status: "Out for Delivery", date: "August 18, 2023", time: "8:20 AM", completed: true },
        { status: "Delivered", date: "August 18, 2023", time: "2:30 PM", completed: true }
      ]
    },
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States"
    },
    paymentMethod: "Credit Card (•••• 4589)"
  },
  {
    id: "ORD-5678",
    date: "September 3, 2023",
    total: 259.95,
    status: "shipped",
    items: [
      { id: 3, name: "Bluetooth Speaker", price: 79.99, quantity: 1, image: "/images/product-3.jpg" },
      { id: 4, name: "Fitness Tracker", price: 89.99, quantity: 2, image: "/images/product-4.jpg" }
    ],
    tracking: {
      number: "TRK58976123",
      carrier: "UPS",
      estimatedDelivery: "September 8, 2023",
      updates: [
        { status: "Order Placed", date: "September 3, 2023", time: "3:20 PM", completed: true },
        { status: "Processing", date: "September 4, 2023", time: "10:15 AM", completed: true },
        { status: "Shipped", date: "September 5, 2023", time: "1:45 PM", completed: true },
        { status: "Out for Delivery", date: "September 8, 2023", time: "8:30 AM", completed: false },
        { status: "Delivered", date: "Pending", time: "Pending", completed: false }
      ]
    },
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States"
    },
    paymentMethod: "PayPal"
  },
  {
    id: "ORD-9012",
    date: "October 10, 2023",
    total: 129.99,
    status: "processing",
    items: [
      { id: 5, name: "Wireless Earbuds", price: 129.99, quantity: 1, image: "/images/product-5.jpg" }
    ],
    tracking: {
      number: "Pending",
      carrier: "USPS",
      estimatedDelivery: "October 15, 2023 (estimated)",
      updates: [
        { status: "Order Placed", date: "October 10, 2023", time: "5:40 PM", completed: true },
        { status: "Processing", date: "October 11, 2023", time: "9:30 AM", completed: true },
        { status: "Shipped", date: "Pending", time: "Pending", completed: false },
        { status: "Out for Delivery", date: "Pending", time: "Pending", completed: false },
        { status: "Delivered", date: "Pending", time: "Pending", completed: false }
      ]
    },
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States"
    },
    paymentMethod: "Credit Card (•••• 4589)"
  }
];

// Helper functions for status display
const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <FaCheckCircle className="text-green-500" />;
    case "shipped":
      return <FaShippingFast className="text-blue-500" />;
    case "processing":
      return <FaBox className="text-yellow-500" />;
    default:
      return <FaBox className="text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "shipped":
      return "Shipped";
    case "processing":
      return "Processing";
    default:
      return "Pending";
  }
};

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Find order by ID
  const order = mockOrders.find(order => order.id === id);
  
  // If order not found or page is still loading
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/orders" className="text-gray-500 hover:text-gray-700">Orders</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">Order Details</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {!router.isReady ? (
              <div className="animate-pulse">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 w-48 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 w-64 mx-auto"></div>
              </div>
            ) : (
              <>
                <FaBox className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">Order not found</h2>
                <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or has been removed.</p>
                <Link href="/orders">
                  <button className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Orders
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Calculate order summary
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax for example
  const total = subtotal + shipping + tax;
  
  // Get current status (most recent completed update)
  const currentStatus = order.tracking.updates.filter(update => update.completed).pop()?.status || "Order Placed";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/orders" className="text-gray-500 hover:text-gray-700">Orders</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Order {order.id}</span>
        </div>
        
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Order {order.id}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{getStatusText(order.status)}</span>
                </span>
              </h1>
              <p className="text-gray-500 text-sm">Placed on {order.date}</p>
            </div>
            
            <div className="flex gap-3">
              <Link href="/orders">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1">
                  <FaArrowLeft className="w-3 h-3" />
                  Back to Orders
                </button>
              </Link>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1">
                <FaPrint className="w-3 h-3" />
                Print Order
              </button>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="relative pt-4">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              {order.status === "processing" && (
                <div style={{ width: "25%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
              )}
              {order.status === "shipped" && (
                <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              )}
              {order.status === "delivered" && (
                <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Order Placed</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold">Order Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start p-6">
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.image || "/placeholder-image.jpg"} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span>Quantity: {item.quantity}</span>
                        <span>Unit Price: ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delivery Tracking */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold">Delivery Tracking</h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                  <div className="flex-1 bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-500 mb-2">Shipping Method</h3>
                    <p className="font-medium">{order.tracking.carrier} - Standard Shipping</p>
                    {order.tracking.number !== "Pending" && (
                      <p className="text-sm mt-1">
                        Tracking Number: <span className="font-medium">{order.tracking.number}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-500 mb-2">Estimated Delivery Date</h3>
                    <p className="font-medium">{order.tracking.estimatedDelivery}</p>
                    <p className="text-sm mt-1">Current Status: <span className="font-medium">{currentStatus}</span></p>
                  </div>
                </div>
                
                {/* Tracking Timeline */}
                <h3 className="font-medium mb-4">Tracking History</h3>
                <div className="relative">
                  {order.tracking.updates.map((update, index) => (
                    <div key={index} className="flex mb-8 last:mb-0">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-5 h-5 rounded-full ${update.completed ? 'bg-black' : 'bg-gray-300'} z-10 flex items-center justify-center`}>
                          {update.completed && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        {index < order.tracking.updates.length - 1 && (
                          <div className={`w-0.5 h-full ${order.tracking.updates[index + 1].completed ? 'bg-black' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${update.completed ? 'text-black' : 'text-gray-400'}`}>
                          {update.status}
                        </div>
                        <div className="text-sm text-gray-500">
                          {update.date} {update.time !== 'Pending' && `at ${update.time}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary and Shipping Info */}
          <div className="md:col-span-1">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-base">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">Paid with {order.paymentMethod}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold">Shipping Information</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium">{order.shippingAddress.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Need Help? */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold">Need Help?</h2>
              </div>
              
              <div className="p-6">
                <button className="w-full px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800 transition-colors mb-3">
                  Contact Support
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                  Return or Exchange
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ req, params }: { req: any, params: { id: string } }) {
  const token = req.cookies.token; // Check authentication token from cookies

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  
  // Here you would normally fetch the order data from your backend
  // For now, we'll use the mock data on the client side
  
  return {
    props: {},
  };
}

export default OrderDetailPage; 