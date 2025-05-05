import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';
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

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        try {
          setLoading(true);
          const response = await axiosInstance.get('/products');
          const allProducts = response.data;
          
          // Filter products to match exact category name
          const filteredProducts = allProducts.filter((product: Product) => 
            product.category.name.toLowerCase() === String(category).toLowerCase()
          );
          
          setProducts(filteredProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{category} Products</h1>
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found in this category</p>
            <button 
              onClick={() => router.push('/')}
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

export default CategoryPage;