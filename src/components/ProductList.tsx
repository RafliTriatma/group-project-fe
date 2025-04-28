import React from "react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaStar } from "react-icons/fa";
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
      {products.map((product) => (
        <Link
          href={`/product/${product.id}`}
          key={product.id}
          className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-3 h-3" />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">(230)</span>
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
                  <p className="text-xs text-gray-500 line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </p>
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
      ))}
    </div>
  );
};

export default ProductList;
