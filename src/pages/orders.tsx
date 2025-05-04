import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaBox, FaShippingFast, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineEye } from "react-icons/hi";

// Mock order data
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
      street: "Jl. Raya no. 123",
      city: "South Jakarta",
      state: "DKI Jakarta",
      zip: "10001",
      country: "Indonesia"
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
      street: "Jl. Raya no. 123",
      city: "South Jakarta",
      state: "DKI Jakarta",
      zip: "10001",
      country: "Indonesia"
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
      street: "Jl. Raya no. 123",
      city: "South Jakarta",
      state: "DKI Jakarta",
      zip: "10001",
      country: "Indonesia"
    },
    paymentMethod: "Credit Card (•••• 4589)"
  }
];

// Get status icon based on order status
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

const Orders = () => {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  // Get order by ID
  const getOrderById = (id: string) => {
    return mockOrders.find(order => order.id === id);
  };
  
  // Handle view order details
  const handleViewOrder = (orderId: string) => {
    setSelectedOrder(orderId);
  };
  
  // Navigate to detailed order page
  const goToOrderDetails = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };
  
  // Get the selected order object
  const selectedOrderDetails = selectedOrder ? getOrderById(selectedOrder) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Track Orders</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order List */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {mockOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Link href="/">
                    <button className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {mockOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className={`p-4 transition-colors cursor-pointer ${selectedOrder === order.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{order.id}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-3 text-sm">
                        <span className="text-gray-500">{order.date}</span>
                        <span className="font-medium">${order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                        <div className="flex gap-3">
                          <button 
                            className="text-sm text-black flex items-center gap-1 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrder(order.id);
                            }}
                          >
                            <HiOutlineEye className="h-4 w-4" />
                            Quick View
                          </button>
                          <button 
                            className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              goToOrderDetails(order.id);
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Order Details */}
          <div className="w-full lg:w-1/2">
            {selectedOrderDetails ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Order {selectedOrderDetails.id}</h2>
                    <div className="flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-gray-100">
                      {getStatusIcon(selectedOrderDetails.status)}
                      <span className="ml-1">{getStatusText(selectedOrderDetails.status)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Placed on {selectedOrderDetails.date}</p>
                </div>
                
                {/* Tracking Information */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium mb-3">Tracking Information</h3>
                  
                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Tracking Number:</span>
                      <span className="text-sm font-medium">{selectedOrderDetails.tracking.number}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Carrier:</span>
                      <span className="text-sm font-medium">{selectedOrderDetails.tracking.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estimated Delivery:</span>
                      <span className="text-sm font-medium">{selectedOrderDetails.tracking.estimatedDelivery}</span>
                    </div>
                  </div>
                  
                  {/* Tracking Timeline */}
                  <div className="relative">
                    {selectedOrderDetails.tracking.updates.map((update, index) => (
                      <div key={index} className="flex mb-6 last:mb-0">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-4 h-4 rounded-full ${update.completed ? 'bg-black' : 'bg-gray-300'} z-10`}></div>
                          {index < selectedOrderDetails.tracking.updates.length - 1 && (
                            <div className={`w-0.5 h-full ${selectedOrderDetails.tracking.updates[index + 1].completed ? 'bg-black' : 'bg-gray-300'}`}></div>
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
                
                {/* Order Items */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium mb-3">Order Items</h3>
                  
                  <div className="space-y-3">
                    {selectedOrderDetails.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img 
                            src={item.image || "/image/revoulogo.png"} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/image/revoulogo.png";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                            <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Shipping & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm">
                      <p className="font-medium">{selectedOrderDetails.shippingAddress.name}</p>
                      <p>{selectedOrderDetails.shippingAddress.street}</p>
                      <p>{selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} {selectedOrderDetails.shippingAddress.zip}</p>
                      <p>{selectedOrderDetails.shippingAddress.country}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm">{selectedOrderDetails.paymentMethod}</p>
                    
                    <h3 className="font-medium mt-4 mb-2">Order Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal:</span>
                        <span>${selectedOrderDetails.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping:</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                        <span>Total:</span>
                        <span>${selectedOrderDetails.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="p-4 flex flex-wrap gap-3 justify-between">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800 transition-colors">
                      Download Invoice
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                      Contact Support
                    </button>
                  </div>
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => goToOrderDetails(selectedOrderDetails.id)}
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <FaBox className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an order to view details</h3>
                <p className="text-gray-500 text-sm">
                  Click on one of your orders from the list to view its tracking information and details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ req }: { req: any }) {
  const token = req.cookies.token; // Check authentication token from cookies

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Orders; 