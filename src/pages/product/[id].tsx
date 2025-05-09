import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductRating } from '@/components/ProductRating';
import { SelectField } from '@/components/SelectField';
import { QuantitySelector } from '@/components/QuantitySelector';
import { ProductFeatures } from '@/components/ProductFeatures';
import { ShippingInfo } from '@/components/ShippingInfo';
import { ProductTabs } from '@/components/ProductTabs';
import { SocialShare } from '@/components/SocialShare';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  HeartIcon, 
  CartIcon
} from '../../components/icons';
import { useRouter } from 'next/router';
import { useAuth } from '@/contex/AuthContex';
import { useCart } from '@/contex/CartContex';
import { useWishlist } from '@/contex/WishlistContext';
import { toast } from 'react-toastify';

// Define static data for features and shipping
const productFeatures = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>, text: 'Free 1 Year Warranty' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>, text: 'Free Shipping & Fasted Delivery' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>, text: '100% Money-back guarantee' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>, text: '24/7 Customer support' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>, text: 'Secure payment method' }
];

const shippingOptions = [
  { method: 'Courier', time: '2-4 days, free shipping' },
  { method: 'Local Shipping', time: 'up to one week' },
  { method: 'UPS Ground Shipping', time: '4-6 days' },
  { method: 'Unishop Global Export', time: '3-4 days' }
];

const tabs = [
  { id: 'description', label: 'DESCRIPTION' },
  { id: 'additional', label: 'ADDITIONAL INFORMATION' },
  { id: 'specification', label: 'SPECIFICATION' },
  { id: 'review', label: 'REVIEW' }
];

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
  };
  creationAt: string;
  updatedAt: string;
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Only fetch if we have an ID from the router
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string | string[]) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      
      const data = await response.json();
      setProduct(data);
      setIsLoading(false);
    } catch (err: unknown) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category
    }, quantity);

    toast.success('Product added to cart');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase items');
      router.push('/login');
      return;
    }

    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category
    }, quantity);

    router.push('/checkout');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      router.push('/login');
      return;
    }

    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Product removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        category: product.category
      });
      toast.success('Product added to wishlist');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading product</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => router.push('/')} 
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Show no product found state
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">Product not found</div>
          <button 
            onClick={() => router.push('/')} 
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Head>
          <title>{product.title} | Store</title>
          <meta name="description" content={product.description.substring(0, 160)} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Product Images Section */}
          <div className="w-full lg:w-1/2">
            {product.images && product.images.length > 0 ? (
              <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white border border-gray-200">
                    <img 
                      src={image} 
                      alt={`${product.title} - image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Rating and Reviews */}
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.round(4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">(425 reviews)</span>
            </div>
            
            {/* Product Title and Info */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-4">{product.title}</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">SKU: <span className="text-gray-900">{product.id}</span></p>
                <p className="text-sm text-gray-500">Category: <span className="text-gray-900">{product.category.name}</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Availability: <span className="text-green-600 font-medium">In Stock</span></p>
              </div>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl text-blue-600 font-semibold">${product.price.toFixed(2)}</h2>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Product Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {product.category.name === 'Electronics' && (
                <>
                  <SelectField label="Display">
                    <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                      <option>Standard Display</option>
                      <option>HD Display</option>
                      <option>4K Display</option>
                    </select>
                  </SelectField>
                  
                  <SelectField label="Memory">
                    <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                      <option>4GB</option>
                      <option>8GB</option>
                      <option>16GB</option>
                    </select>
                  </SelectField>
                  
                  <SelectField label="Storage">
                    <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                      <option>128GB</option>
                      <option>256GB</option>
                      <option>512GB</option>
                      <option>1TB</option>
                    </select>
                  </SelectField>
                </>
              )}

              {product.category.name === 'Clothes' && (
                <>
                  <SelectField label="Size">
                    <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                    </select>
                  </SelectField>
                </>
              )}

              {product.category.name === 'Shoes' && (
                <>
                  <SelectField label="Size">
                    <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                    </select>
                  </SelectField>
                </>
              )}
            </div>
            
            {/* Add to Cart Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-auto">
                <QuantitySelector 
                  quantity={quantity}
                  onDecrease={decreaseQuantity}
                  onIncrease={increaseQuantity}
                />
              </div>
              
              <div className="flex flex-1 gap-2">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <span>Add to Cart</span>
                  <CartIcon />
                </button>
                
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 px-4 py-3 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
            
            {/* Wishlist and Share */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
              <button 
                onClick={handleWishlist}
                className={`flex items-center ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'} hover:text-red-500 transition-colors`}
              >
                <HeartIcon />
                <span className="ml-2">{isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
              
              <SocialShare />
            </div>
          </div>
        </div>

        {/* Product Tabs Section */}
        <div className="mt-8 sm:mt-12">
          <ProductTabs tabs={tabs} defaultTabId="description">
            {(activeTabId: string) => (
              <div className="mt-6">
                {activeTabId === 'description' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-lg font-medium">Description</h3>
                      <div className="prose prose-sm sm:prose max-w-none text-gray-600">
                        <p>{product.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Features</h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <ProductFeatures features={productFeatures} />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <ShippingInfo options={shippingOptions} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTabId === 'additional' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-900 font-medium bg-gray-50 w-1/3">Product ID</td>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-600">{product.id}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-900 font-medium bg-gray-50">Category</td>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-600">{product.category.name}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-900 font-medium bg-gray-50">Created At</td>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-600">{new Date(product.creationAt).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-900 font-medium bg-gray-50">Updated At</td>
                              <td className="px-4 py-3 text-sm sm:text-base text-gray-600">{new Date(product.updatedAt).toLocaleDateString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTabId === 'specification' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Specification</h3>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
                          <p className="text-sm sm:text-base text-gray-600">
                            Detailed specifications for {product.title} would be listed here.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Product Dimensions</h4>
                          <p className="text-sm sm:text-base text-gray-600">
                            Product dimensions and weight information would be displayed here.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTabId === 'review' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Reviews</h3>
                    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                      <p className="text-sm sm:text-base text-gray-600">No reviews available for this product yet.</p>
                      <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Write a Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ProductTabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}