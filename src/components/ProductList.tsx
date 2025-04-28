import React from "react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
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

const ProductList: React.FC<Props> = ({ products }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      // toast.error("Please login to add items to cart");
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
      {products.map((product) => {
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
  );
};

export default ProductList;
