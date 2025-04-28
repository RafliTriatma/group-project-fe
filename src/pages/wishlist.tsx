import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contex/WishlistContext";
import { useCart } from "@/contex/CartContex";
import { useAuth } from "@/contex/AuthContex";
import { FaStar, FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
    toast.info("Product removed from wishlist");
  };

  const handleAddToCart = (product: any) => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      1
    );
    toast.success("Product added to cart");
  };

  // Return loading state if auth is being checked
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">My Wishlist</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaHeart className="text-red-500" /> My Wishlist
          </h1>
          <Link href="/">
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-red-500 text-xl" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">
              Discover products and save your favorites for later
            </p>
            <Link href="/">
              <button className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                Explore Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wishlist.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                            <Link href={`/product/${item.id}`}>
                              <img
                                src={item.image || "/placeholder-image.jpg"}
                                alt={item.title}
                                className="h-full w-full object-cover object-center"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                }}
                              />
                            </Link>
                          </div>
                          <div className="ml-4">
                            <Link href={`/product/${item.id}`}>
                              <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                {item.title}
                              </h3>
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              Category: {item.category.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center gap-1"
                          >
                            <FaShoppingCart className="h-3 w-3" />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                          >
                            <FaTrash className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

export default WishlistPage; 