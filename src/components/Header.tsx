import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contex/AuthContex";
import { useCart } from "@/contex/CartContex";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import CategoryFilter from './CategoryFilter';
import axiosInstance from "@/utils/axiosInstance";

interface Category {
  id: number;
  name: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories if API fails
        setCategories([
          { id: 1, name: "Electronics" },
          { id: 2, name: "Furniture" },
          { id: 3, name: "Shoes" },
          { id: 4, name: "Clothes" },
          { id: 5, name: "Books" },
          { id: 6, name: "Fashion" }
        ]);
      }
    };

    fetchCategories();
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setIsCategoryOpen(false);
    
    if (categoryId === null) {
      router.push('/');  // Changed from /products to / since that's your main page
    } else {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        router.push(`/category/${category.name.toLowerCase()}`);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <nav className="max-w-full mx-14 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold">LOGO</span>
          </Link>

         {/* Search Bar */}
         <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for anything..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <FaSearch className="text-gray-400" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="relative">
              <FaShoppingCart className="text-gray-600 w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <Link href="/wishlist">
              <FaHeart className="text-gray-600 w-6 h-6" />
            </Link>
            {isAuthenticated ? (
              <button onClick={handleLogout}>
                <FaUser className="text-gray-600 w-6 h-6" />
              </button>
            ) : (
              <Link href="/login">
                <FaUser className="text-gray-600 w-6 h-6" />
              </Link>
            )}
          </div>
        </div>

        {/* Categories and Links */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span>All Category</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Enhanced Dropdown Menu with Selection */}
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full px-4 py-2 text-left ${
                      selectedCategory === null
                        ? "bg-gray-100 text-black font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full px-4 py-2 text-left ${
                        selectedCategory === category.id
                          ? "bg-gray-100 text-black font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/track" className="text-gray-600 hover:text-gray-900">
              Track Order
            </Link>
            <Link href="/compare" className="text-gray-600 hover:text-gray-900">
              Compare
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900">
              Customer Support
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">
              Need Help
            </Link>
          </div>
          <div className="text-gray-600">
            <span>+62-202-555-010</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
