import React, { useEffect, useState } from "react";
import { useCart } from "@/contex/CartContex";
import { useAuth } from "@/contex/AuthContex";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import { Modal, Box, Typography } from "@mui/material";

const CartPage = () => {
  const { cart, total, setQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    toast.success("Item removed from cart");
  };

  const handlePurchase = async () => {
    // Navigate to the checkout page
    router.push("/checkout");
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim() === "") {
      toast.error("Please enter a coupon code");
      return;
    }
    
    // In a real app, you would validate the coupon with your backend
    // For demo purposes, we'll just apply a fixed discount
    setDiscount(24);
    toast.success("Coupon applied successfully!");
  };

  // Calculate tax (for demo purposes, 8% of subtotal)
  const tax = Math.round(total * 0.08 * 100) / 100;
  
  // Calculate final total
  const finalTotal = total + tax - discount;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">Shopping Cart</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Shopping Cart</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Cart items */}
          <div className="w-full lg:w-3/4">
            {/* Column headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm text-gray-500 uppercase mb-4 px-4">
              <div className="col-span-6">Products</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Sub-total</div>
            </div>
            
            {/* Cart items list */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                  {/* Product image and info */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-white border border-gray-200">
                      <img
                        src={item.image || "/placeholder-image.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">{item.title}</h3>
                      <div className="mt-1 text-xs sm:text-sm text-gray-500">{item.category.name}</div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-1 text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price, Quantity and Subtotal for mobile */}
                  <div className="col-span-1 md:hidden grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                    <div className="text-xs sm:text-sm">
                      <div className="text-gray-500">Price:</div>
                      <div className="font-medium">${item.price.toFixed(2)}</div>
                    </div>
                    
                    <div className="text-xs sm:text-sm">
                      <div className="text-gray-500 mb-1">Qty:</div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border border-gray-300 text-gray-600 rounded-l-md hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-8 h-6 sm:w-9 sm:h-7 border-t border-b border-gray-300 text-center text-gray-700 text-xs sm:text-sm outline-none"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border border-gray-300 text-gray-600 rounded-r-md hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-xs sm:text-sm">
                      <div className="text-gray-500">Subtotal:</div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  {/* Price - Desktop */}
                  <div className="hidden md:block col-span-2 text-gray-900 text-center">
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity - Desktop */}
                  <div className="hidden md:block col-span-2 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 rounded-l-md hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-10 h-8 border-t border-b border-gray-300 text-center text-gray-700 outline-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 rounded-r-md hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal - Desktop */}
                  <div className="hidden md:block col-span-2 text-right font-medium text-gray-900">
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Return to shop button */}
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-4">
              <Link href="/" className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center">
                ← RETURN TO SHOP
              </Link>
            </div>
          </div>
          
          {/* Cart Totals */}
          <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Card Totals</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Sub-total</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
              
              {/* Coupon code */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-medium mb-2">Coupon Code</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full border border-gray-300 px-3 py-2 sm:rounded-l-md sm:rounded-r-none rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-black text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md text-xs sm:text-sm hover:bg-gray-800 transition-colors"
                  >
                    APPLY
                  </button>
                </div>
              </div>
              
              {/* Proceed to checkout button */}
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-black text-white py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center text-sm sm:text-base"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "CHECKOUT"
                )}
              </button>
            </div>
          </div>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              maxWidth: "100%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: { xs: 3, sm: 4 },
              borderRadius: "8px",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ textAlign: "center", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
            >
              Purchase Successful
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, textAlign: "center", fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Thank you for your purchase! Your cart has been cleared.
            </Typography>
          </Box>
        </Modal>
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

export default CartPage;