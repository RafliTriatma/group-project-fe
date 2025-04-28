import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contex/CartContex";
import { FaCheckCircle } from "react-icons/fa";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const OrderSuccessPage = () => {
  const router = useRouter();
  const { orderId, total } = router.query;
  const { clearCart, cart } = useCart();
  const [isValidOrder, setIsValidOrder] = useState(false);
  
  // Check if this is a valid order completion
  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) return;

    // If no order ID or coming from direct navigation without items in cart, redirect to home
    if (!orderId || (!total && cart.length === 0)) {
      router.replace('/');
      return;
    }

    setIsValidOrder(true);
    
    // Clear cart with a slight delay to ensure the component is mounted
    const timer = setTimeout(() => {
      clearCart();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router, orderId, total, clearCart, cart.length]);

  // Format current date for order date
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle "View Order" button click
  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/order/${orderId}`);
    } else {
      router.push('/orders');
    }
  };

  // Show loading while validating
  if (!isValidOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full mb-4"></div>
          <p className="text-gray-600">Validating your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/cart" className="text-gray-500 hover:text-gray-700">Shopping Cart</Link>
          <span className="text-gray-400">/</span>
          <Link href="/checkout" className="text-gray-500 hover:text-gray-700">Checkout</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Order Complete</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
          </div>
          
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-3">
            Your order is successfully placed
          </h1>
          
          <p className="text-center text-gray-500 text-sm mb-8 max-w-lg mx-auto">
            Pellentesque sed lectus nec tortor tristique accumsan quis dictum nunc. Donec volutpat mollis nulla non facilisis.
          </p>
          
          {/* Order details */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 text-sm">Order Number:</span>
              <span className="font-medium">{orderId || 'ORD-0000'}</span>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 text-sm">Date:</span>
              <span className="font-medium">{orderDate}</span>
            </div>
            
            {total && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 text-sm">Total:</span>
                <span className="font-medium">${Number(total).toFixed(2)} USD</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Payment Method:</span>
              <span className="font-medium">Credit Card</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 border-t border-b border-gray-200 py-8 mb-8">
            <Link href="/">
              <button className="px-5 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded hover:bg-gray-200 transition duration-200 flex items-center justify-center text-sm font-medium">
                CONTINUE SHOPPING
              </button>
            </Link>
            <Link href={orderId ? `/order/${orderId}` : "/orders"}>
              <button className="px-5 py-3 bg-black text-white rounded hover:bg-gray-800 transition duration-200 flex items-center justify-center space-x-1 text-sm font-medium">
                <span>VIEW ORDER</span>
                <HiOutlineArrowNarrowRight className="w-4 h-4" />
              </button>
            </Link>
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

export default OrderSuccessPage; 