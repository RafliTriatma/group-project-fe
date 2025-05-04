import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contex/AuthContex";
import { useCart } from "@/contex/CartContex";
import { useWishlist } from "@/contex/WishlistContext";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSearch,
  FaSignOutAlt,
  FaClipboardList,
  FaUserCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axiosInstance from "@/utils/axiosInstance";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const profileRef = useRef<HTMLDivElement>(null);

  // Set initial searchTerm from URL query
  useEffect(() => {
    const { query } = router.query;
    if (query && typeof query === "string") {
      setSearchTerm(decodeURIComponent(query));
    }
  }, [router.query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          { id: 1, name: "Electronics" },
          { id: 2, name: "Furniture" },
          { id: 3, name: "Shoes" },
          { id: 4, name: "Clothes" },
          { id: 5, name: "Books" },
          { id: 6, name: "Fashion" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemsCount = wishlist.length;

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setIsCategoryOpen(false);

    if (categoryId === null) {
      router.push("/");
    } else {
      const category = categories.find((cat) => cat.id === categoryId);
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

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Add default profile picture
  const defaultProfilePic = "/image/revoulogo.png";

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
          <div className="flex items-center space-x-4">
            <CartIcon />
            {/* <WishlistIcon /> */}

            {/* Profile Icon with Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center focus:outline-none"
              >
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={defaultProfilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium hidden md:inline-block">
                      {user?.firstName || "Hi, User"}
                    </span>
                  </div>
                ) : (
                  <FaUser className="h-6 w-6 text-gray-600" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img
                            src={defaultProfilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-medium">
                          {user?.firstName
                            ? `${user.firstName} ${user.lastName || ""}`
                            : "Welcome!"}
                        </div>
                      </div>
                      <Link href="/profile">
                        <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaUserCircle className="mr-2" /> Profile
                        </div>
                      </Link>
                      <Link href="/orders">
                        <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaClipboardList className="mr-2" /> My Orders
                        </div>
                      </Link>
                      <Link href="/wishlist">
                        <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaHeart className="mr-2" /> My Wishlist
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Login
                        </div>
                      </Link>
                      <Link href="/signup">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Sign Up
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
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

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* <Link href="/orders" className="text-gray-600 hover:text-gray-900">
              Track Order
            </Link> */}
            {/* <Link href="/compare" className="text-gray-600 hover:text-gray-900">
              Compare
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900">
              Customer Support
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">
              Need Help
            </Link> */}
          </div>
          <div className="text-gray-600 flex items-center">
            <FaMapMarkerAlt className="mr-1" />
            <span>Jakarta</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
