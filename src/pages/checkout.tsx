import React, { useState, useEffect } from "react";
import { useCart } from "@/contex/CartContex";
import { useAuth } from "@/contex/AuthContex";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import { Modal, Box, Typography } from "@mui/material";
import axios from "axios";

// Interface for form data
interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  orderNotes: string;
  shippingAddress: boolean;
}

// Interfaces for country and state data
interface Country {
  name: string;
  code: string;
}

interface State {
  name: string;
  code: string;
}

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Country and state data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    orderNotes: "",
    shippingAddress: false,
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        // Use RestCountries API to fetch countries (random API)
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );
        const formattedCountries = response.data
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Fallback to some default countries if API fails
        setCountries([
          { name: "United States", code: "US" },
          { name: "Canada", code: "CA" },
          { name: "United Kingdom", code: "GB" },
          { name: "Australia", code: "AU" },
          { name: "France", code: "FR" },
          { name: "Germany", code: "DE" },
          { name: "Japan", code: "JP" },
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) {
        setStates([]);
        return;
      }

      setLoadingStates(true);
      try {
        // For this example, we'll only provide states for US
        // In a real app, you would use an API that provides states based on country
        if (formData.country === "US") {
          setStates([
            { name: "Alabama", code: "AL" },
            { name: "Alaska", code: "AK" },
            { name: "Arizona", code: "AZ" },
            { name: "Arkansas", code: "AR" },
            { name: "California", code: "CA" },
            { name: "Colorado", code: "CO" },
            { name: "Connecticut", code: "CT" },
            { name: "Delaware", code: "DE" },
            { name: "Florida", code: "FL" },
            { name: "Georgia", code: "GA" },
            { name: "Hawaii", code: "HI" },
            { name: "Idaho", code: "ID" },
            { name: "Illinois", code: "IL" },
            { name: "Indiana", code: "IN" },
            { name: "Iowa", code: "IA" },
            { name: "Kansas", code: "KS" },
            { name: "Kentucky", code: "KY" },
            { name: "Louisiana", code: "LA" },
            { name: "Maine", code: "ME" },
            { name: "Maryland", code: "MD" },
            { name: "Massachusetts", code: "MA" },
            { name: "Michigan", code: "MI" },
            { name: "Minnesota", code: "MN" },
            { name: "Mississippi", code: "MS" },
            { name: "Missouri", code: "MO" },
            { name: "Montana", code: "MT" },
            { name: "Nebraska", code: "NE" },
            { name: "Nevada", code: "NV" },
            { name: "New Hampshire", code: "NH" },
            { name: "New Jersey", code: "NJ" },
            { name: "New Mexico", code: "NM" },
            { name: "New York", code: "NY" },
            { name: "North Carolina", code: "NC" },
            { name: "North Dakota", code: "ND" },
            { name: "Ohio", code: "OH" },
            { name: "Oklahoma", code: "OK" },
            { name: "Oregon", code: "OR" },
            { name: "Pennsylvania", code: "PA" },
            { name: "Rhode Island", code: "RI" },
            { name: "South Carolina", code: "SC" },
            { name: "South Dakota", code: "SD" },
            { name: "Tennessee", code: "TN" },
            { name: "Texas", code: "TX" },
            { name: "Utah", code: "UT" },
            { name: "Vermont", code: "VT" },
            { name: "Virginia", code: "VA" },
            { name: "Washington", code: "WA" },
            { name: "West Virginia", code: "WV" },
            { name: "Wisconsin", code: "WI" },
            { name: "Wyoming", code: "WY" },
          ]);
        } else {
          // For other countries, provide empty state list or fetch from API
          setStates([]);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [formData.country]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox for shipping address
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Calculate tax (for demo purposes, 8% of subtotal)
  const tax = Math.round(total * 0.08 * 100) / 100;
  const discount = 24; // Fixed discount for demo
  const finalTotal = total + tax - discount;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: Record<string, string> = {};

    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.zipCode) errors.zipCode = "Zip code is required";
    if (!formData.country) errors.country = "Country is required";

    // If there are errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Process order
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);

      // Generate a random order ID
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;

      // Navigate to success page with order details
      router.push({
        pathname: "/order-success",
        query: {
          orderId: orderId,
          total: finalTotal.toFixed(2),
        },
      });
    }, 2000);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Return loading state if auth is being checked
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/cart" className="text-gray-500 hover:text-gray-700">
              Cart
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">Checkout</span>
          </div>
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">
              Your cart is empty. Please add items to your cart before checking
              out.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
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
          <Link href="/cart" className="text-gray-500 hover:text-gray-700">
            Shopping Cart
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Checkout</span>
        </div>

        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Billing Information Form */}
          <div className="lg:w-3/5">
            <form id="checkout-form" onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Billing Information</h2>

                {/* User Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        validationErrors.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                    />
                    {validationErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        validationErrors.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                    />
                    {validationErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Name (Optional) */}
                <div className="mb-4">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full border ${
                      validationErrors.address
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.address}
                    </p>
                  )}
                </div>

                {/* Country - MOVED UP */}
                <div className="mb-4">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full border ${
                      validationErrors.country
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                    disabled={loadingCountries}
                  >
                    <option value="">Select...</option>
                    {loadingCountries ? (
                      <option value="" disabled>
                        Loading countries...
                      </option>
                    ) : (
                      countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))
                    )}
                  </select>
                  {validationErrors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.country}
                    </p>
                  )}
                </div>

                {/* City, State, Zip Code */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        validationErrors.city
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Region/State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        validationErrors.state
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                      disabled={loadingStates || states.length === 0}
                    >
                      <option value="">Select...</option>
                      {loadingStates ? (
                        <option value="" disabled>
                          Loading states...
                        </option>
                      ) : (
                        states.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))
                      )}
                    </select>
                    {validationErrors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.state}
                      </p>
                    )}
                    {states.length === 0 &&
                      formData.country &&
                      !loadingStates && (
                        <p className="text-xs text-gray-500 mt-1">
                          No states/regions available for the selected country
                        </p>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Zip Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        validationErrors.zipCode
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                    />
                    {validationErrors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        validationErrors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full border ${
                        validationErrors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ship to different address checkbox */}
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="shippingAddress"
                    name="shippingAddress"
                    checked={formData.shippingAddress}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <label
                    htmlFor="shippingAddress"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Ship to different address
                  </label>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">
                  Additional Information
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="orderNotes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Order Notes{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id="orderNotes"
                    name="orderNotes"
                    rows={4}
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Notes about your order, e.g. special notes for delivery"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    maxLength={5000}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.orderNotes.length}/5000 characters
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              {/* Items in cart */}
              <div className="mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-gray-100"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder-image.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal, shipping, discount, tax */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sub-total</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">
                      ${finalTotal.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Payment Method</h3>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="payment-cc"
                      name="payment-method"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <label
                      htmlFor="payment-cc"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Credit Card (Stripe)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="payment-paypal"
                      name="payment-method"
                      type="radio"
                      className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <label
                      htmlFor="payment-paypal"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      PayPal
                    </label>
                  </div>
                </div>
              </div>

              {/* Place order button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "PLACE ORDER"
                )}
              </button>

              {/* Return to cart link */}
              <div className="text-center mt-4">
                <Link
                  href="/cart"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Return to cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Order complete modal */}
        <Modal
          open={orderComplete}
          onClose={() => {}}
          aria-labelledby="order-complete-title"
          aria-describedby="order-complete-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
            }}
          >
            <Typography
              id="order-complete-title"
              variant="h6"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              Order Confirmed!
            </Typography>
            <Typography
              id="order-complete-description"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Thank you for your order! We've received your payment and will
              process your order right away. You will receive an email
              confirmation shortly.
            </Typography>
          </Box>
        </Modal>
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

export default CheckoutPage;
