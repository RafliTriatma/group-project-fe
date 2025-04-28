import React, { useState, useEffect } from "react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { useCart } from "@/contex/CartContex";
import { useWishlist } from "@/contex/WishlistContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/contex/AuthContex";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
  };
}

interface Props {
  products: Product[];
}

// Type for sort options
type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];

const PRODUCTS_PER_PAGE = 12;

const ProductList: React.FC<Props> = ({ products }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("popular");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Function to generate a random promo label for products
  const getRandomPromoLabel = (productId: number) => {
    // Use product ID to ensure consistent labels on rerenders
    const seed = productId % 10;
    
    // No label for some products (30% chance)
    if (seed < 3) return null;
    
    if (seed === 3 || seed === 4) {
      return {
        text: "HOT",
        bgColor: "bg-red-500",
      };
    }
    
    if (seed === 5) {
      return {
        text: "BEST DEALS",
        bgColor: "bg-black",
      };
    }
    
    if (seed === 6 || seed === 7) {
      return {
        text: "SALE",
        bgColor: "bg-green-500",
      };
    }
    
    // Discount percentages for remaining products
    const discountPercent = [10, 20, 25, 30][seed % 4];
    return {
      text: `${discountPercent}% OFF`,
      bgColor: "bg-orange-500",
    };
  };

  // Function to generate random rating for a product
  const getRandomRating = (productId: number) => {
    // Use product ID as seed for consistent rating
    const baseNumber = (productId * 17) % 100;
    
    // Generate rating between 3.0 and 5.0
    const rating = 3.0 + (baseNumber / 100) * 2;
    const roundedRating = Math.round(rating * 10) / 10; // Round to 1 decimal place
    
    // Generate random number of reviews (between 10 and 999)
    const reviewCount = 10 + (productId * 13) % 990;
    
    return {
      rating: roundedRating,
      count: reviewCount
    };
  };

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="w-3 h-3" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="w-3 h-3" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="w-3 h-3" />);
    }
    
    return stars;
  };

  // Function to sort products based on selected criteria
  const getSortedProducts = () => {
    let sortedProducts = [...products];
    
    switch (sortBy) {
      case "price-asc":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
      case "newest":
        // For demo purposes, sort by ID in descending order to simulate newest items
        return sortedProducts.sort((a, b) => b.id - a.id);
      case "popular":
      default:
        // For demo purposes, use a combination of rating and review count to sort by "popularity"
        return sortedProducts.sort((a, b) => {
          const ratingA = getRandomRating(a.id).rating;
          const ratingB = getRandomRating(b.id).rating;
          const countA = getRandomRating(a.id).count;
          const countB = getRandomRating(b.id).count;
          // Calculate a popularity score based on rating and review count
          const scoreA = ratingA * (Math.log10(countA + 1));
          const scoreB = ratingB * (Math.log10(countB + 1));
          return scoreB - scoreA;
        });
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        category: product.category,
      },
      1
    );
    toast.success("Product added to cart");
  };

  const handleToggleWishlist = (product: Product) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const productItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info("Product removed from wishlist");
    } else {
      addToWishlist(productItem);
      toast.success("Product added to wishlist");
    }
  };

  // Get sorted products
  const sortedProducts = getSortedProducts();
  
  // Total number of pages
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  // Load initial set of products
  const loadInitialProducts = () => {
    const initialProducts = sortedProducts.slice(0, PRODUCTS_PER_PAGE);
    setVisibleProducts(initialProducts);
  };

  // Make sure this useEffect runs on initial render
  useEffect(() => {
    setCurrentPage(1);
    loadInitialProducts();
  }, [sortBy, products]); // Add products as a dependency too

  // Function to handle page change
  const handlePageChange = (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    
    // Simulate loading delay (remove in production)
    setTimeout(() => {
      const startIndex = (pageNumber - 1) * PRODUCTS_PER_PAGE;
      const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, sortedProducts.length);
      const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
      
      setVisibleProducts(paginatedProducts);
      setIsLoading(false);
      
      // Scroll to top of product grid
      const gridElement = document.getElementById('product-grid');
      window.scrollTo({ 
        top: (gridElement?.offsetTop ?? 0) - 100, 
        behavior: 'smooth' 
      });
    }, 400);
  };

  // Function to generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5; // Show max 5 page buttons at a time
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    // Previous page button
    buttons.push(
      <button
        key="prev"
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="Previous page"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>
    );
    
    // First page button if not visible in current range
    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          disabled={isLoading}
          className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          1
        </button>
      );
      
      // Ellipsis if there's a gap
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="flex items-center justify-center w-9 h-9 text-gray-500">
            ...
          </span>
        );
      }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={isLoading}
          className={`flex items-center justify-center w-9 h-9 rounded-md ${
            i === currentPage
              ? 'bg-black text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Ellipsis if there's a gap before last page
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="flex items-center justify-center w-9 h-9 text-gray-500">
          ...
        </span>
      );
    }
    
    // Last page button if not visible in current range
    if (endPage < totalPages) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={isLoading}
          className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }
    
    // Next page button
    buttons.push(
      <button
        key="next"
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        aria-label="Next page"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    );
    
    return buttons;
  };

  return (
    <div className="w-full">
      {/* Sorting Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Showing {visibleProducts.length} of {sortedProducts.length} products
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-sm bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
          >
            <BiSortAlt2 className="text-gray-500" />
            <span>Sort by: </span>
            <span className="font-medium">
              {sortOptions.find(option => option.value === sortBy)?.label}
            </span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsDropdownOpen(false);
                      setCurrentPage(1);
                      loadInitialProducts();
                    }}
                    className={`${
                      sortBy === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full text-left px-4 py-2 text-sm hover:bg-gray-50`}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading products...</span>
          </div>
        </div>
      )}

      {/* Product Grid - add id for scroll reference */}
      <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
        {visibleProducts.map((product) => {
          const promoLabel = getRandomPromoLabel(product.id);
          const { rating, count } = getRandomRating(product.id);
          const isWishlisted = isInWishlist(product.id);
          
          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy" // Add native lazy loading
                />
                
                {/* Conditional Promo Label */}
                {promoLabel && (
                  <div className="absolute top-2 left-2">
                    <span className={`${promoLabel.bgColor} text-white text-xs px-2 py-1 rounded`}>
                      {promoLabel.text}
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleWishlist(product);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm z-10 hover:bg-gray-100"
                >
                  {isWishlisted ? (
                    <FaHeart className="h-5 w-5 text-red-500" />
                  ) : (
                    <FaRegHeart className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {renderStars(rating)}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">({count})</span>
                </div>

                <h2 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h2>

                <div className="flex items-center mb-2">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {product.category.name}
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                      {/* Show original price if there's a discount label */}
                      {promoLabel && promoLabel.text.includes("OFF") && (
                        <p className="text-xs text-gray-500 line-through">
                          ${(product.price * 1.2).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
                  >
                    <MdOutlineShoppingCartCheckout />
                    <span className="text-sm">
                      {isAuthenticated ? "Add to Cart" : "Login to Add"}
                    </span>
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Choose between Load More or Pagination */}
      <div className="mt-8 flex flex-col items-center">
        {/* Pagination Controls */}
        <div className="inline-flex items-center gap-2 my-4">
          {renderPaginationButtons()}
        </div>
        
        {/* Pagination Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
