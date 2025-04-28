import React, { useState } from "react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { useCart } from "@/contex/CartContex";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/contex/AuthContex";

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

const ProductList: React.FC<Props> = ({ products }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("popular"); // Default sort option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Get sorted products
  const sortedProducts = getSortedProducts();

  return (
    <div className="w-full">
      {/* Sorting Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Showing {sortedProducts.length} products
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
        {sortedProducts.map((product) => {
          const promoLabel = getRandomPromoLabel(product.id);
          const { rating, count } = getRandomRating(product.id);
          
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
                />
                
                {/* Conditional Promo Label */}
                {promoLabel && (
                  <div className="absolute top-2 left-2">
                    <span className={`${promoLabel.bgColor} text-white text-xs px-2 py-1 rounded`}>
                      {promoLabel.text}
                    </span>
                  </div>
                )}
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
    </div>
  );
};

export default ProductList;
