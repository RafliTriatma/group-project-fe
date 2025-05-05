import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductList from "@/components/ProductList";
import axiosInstance from "@/utils/axiosInstance";

interface Product {
  id: number;
  title: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  description: string;
  images: string[];
}

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string | null>(
    null
  );
  const isFirstSearch = useRef(true);

  // Effect to handle search when query parameter changes
  useEffect(() => {
    // Only search when router is ready
    if (!router.isReady) return;

    // Get the query from URL
    const searchQuery = typeof query === "string" ? query : null;

    // Skip if the search term is the same (prevents duplicate fetches)
    if (searchQuery === currentSearchTerm && !isFirstSearch.current) {
      return;
    }

    // Update current search term
    setCurrentSearchTerm(searchQuery);

    // If no query, set empty results and don't fetch
    if (!searchQuery) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products");
        const allProducts = response.data;

        const filteredProducts = allProducts.filter(
          (product: Product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

        setProducts(filteredProducts);
        isFirstSearch.current = false;
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query, router.isReady]);

  // If still loading, show spinner
  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Search Results {query ? `for "${query}"` : ""}
        </h1>
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {query
                ? `No products found for "${query}"`
                : "Please enter a search term"}
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-black text-white rounded transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
