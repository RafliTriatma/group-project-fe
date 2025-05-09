import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contex/AuthContex";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import Profile from "next/image";
import Link from "next/link";

// Mock data for demo purposes
const mockOrders = [
  {
    id: "ORD-1234",
    date: "2023-10-15",
    total: 239.99,
    status: "Delivered",
    items: [
      {
        id: 1,
        name: "Mid-Century Modern Wooden Dining Table",
        quantity: 1,
        price: 239.99,
      },
    ],
  },
  {
    id: "ORD-5678",
    date: "2023-09-22",
    total: 89.97,
    status: "Processing",
    items: [
      { id: 2, name: "Modern Fabric Accent Chair", quantity: 3, price: 29.99 },
    ],
  },
];

const mockAddresses = [
  {
    id: 1,
    type: "Home",
    isDefault: true,
    fullName: "Udin Petot",
    address: "Jl. Raya No. 123",
    city: "South Jakarta",
    state: "DKI Jakarta",
    zipCode: "10001",
    country: "Indonesia",
    phone: "+62 81234567890",
  },
  {
    id: 2,
    type: "Work",
    isDefault: false,
    fullName: "Udin Petot",
    address: "Jl. Kantor No. 123",
    city: "South Jakarta",
    state: "DKI Jakarta",
    zipCode: "10002",
    country: "Indonesia",
    phone: "+62 81234567890",
  },
];

const mockPaymentMethods = [
  {
    id: 1,
    type: "Credit Card",
    isDefault: true,
    cardType: "Visa",
    lastFour: "4242",
    expiry: "09/25",
  },
  {
    id: 2,
    type: "Credit Card",
    isDefault: false,
    cardType: "Mastercard",
    lastFour: "5555",
    expiry: "12/24",
  },
];

const ProfilePage = () => {
  const { isAuthenticated, user, isLoading, logout, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal-info");

  // Additional user profile fields that might not be in the auth context
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "User",
    lastName: user?.lastName || "Default",
    email: user?.email || "user.default@example.com", // Menggunakan email dari auth context jika tersedia
    phone: "+62 81234567890",
    avatar: "/image/revoulogo.png",
    dateJoined: "October 2020",
  });

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  // Update profile from user data when it changes
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email, // Memperbarui email dari user context
        // Tetap menggunakan avatar default
      }));
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update local state
      setProfile(formData);

      // Update user context
      if (updateUser) {
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          avatar: formData.avatar,
        });
      }

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // If still loading or not authenticated, show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">My Account</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - Collapsible on mobile */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              {/* Profile Summary */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={profile.avatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-medium text-sm sm:text-base truncate">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Member since {profile.dateJoined}
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {[
                  { id: 'personal-info', label: 'Personal Information' },
                  { id: 'orders', label: 'Order History' },
                  { id: 'addresses', label: 'Addresses' },
                  { id: 'payment', label: 'Payment Methods' },
                  { id: 'settings', label: 'Account Settings' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm sm:text-base transition-colors ${
                      activeTab === item.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm sm:text-base text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {/* Personal Information Tab */}
              {activeTab === 'personal-info' && (
                <div>
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold">Personal Information</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...profile });
                            setIsEditing(false);
                          }}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">First Name</p>
                          <p className="text-sm sm:text-base font-medium">{profile.firstName}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Last Name</p>
                          <p className="text-sm sm:text-base font-medium">{profile.lastName}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Email</p>
                        <p className="text-sm sm:text-base font-medium">{profile.email}</p>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                        <p className="text-sm sm:text-base font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Order History</h2>

                  {mockOrders.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {mockOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 px-3 sm:px-4 py-3 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div>
                                <p className="font-medium text-sm sm:text-base">{order.id}</p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  Placed on {order.date}
                                </p>
                              </div>
                              <div className="flex items-center justify-between sm:flex-col sm:items-end">
                                <p className="font-medium text-sm sm:text-base">
                                  ${order.total.toFixed(2)}
                                </p>
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 sm:p-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between py-2 text-sm sm:text-base"
                              >
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="bg-gray-50 px-3 sm:px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:justify-between">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              View Details
                            </button>
                            {order.status === "Delivered" && (
                              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                Buy Again
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4 text-sm sm:text-base">
                        You haven't placed any orders yet.
                      </p>
                      <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold">Saved Addresses</h2>
                    <button className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                      Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 relative"
                      >
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}

                        <p className="font-medium text-sm sm:text-base mb-1">{address.type}</p>
                        <div className="space-y-1 text-xs sm:text-sm mb-3">
                          <p>{address.fullName}</p>
                          <p>{address.address}</p>
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <button className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                          <button className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-800">
                            Delete
                          </button>
                          {!address.isDefault && (
                            <button className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800">
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold">Payment Methods</h2>
                    <button className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                      Add New Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPaymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 relative"
                      >
                        {method.isDefault && (
                          <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          {method.cardType === "Visa" ? (
                            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                              VISA
                            </div>
                          ) : (
                            <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                              MC
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              **** **** **** {method.lastFour}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Expires {method.expiry}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <button className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-800">
                            Remove
                          </button>
                          {!method.isDefault && (
                            <button className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800">
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Account Settings</h2>

                  <div className="space-y-6">
                    {/* Password Change Section */}
                    <div className="pb-6 border-b border-gray-200">
                      <h3 className="text-base sm:text-lg font-medium mb-4">Password</h3>
                      <button className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                        Change Password
                      </button>
                    </div>

                    {/* Email Preferences */}
                    <div className="pb-6 border-b border-gray-200">
                      <h3 className="text-base sm:text-lg font-medium mb-4">Email Preferences</h3>
                      <div className="space-y-3">
                        {['Marketing emails and newsletters', 'Order status updates', 'Account alerts'].map((pref, index) => (
                          <div key={index} className="flex items-start sm:items-center">
                            <input
                              id={`pref-${index}`}
                              type="checkbox"
                              defaultChecked
                              className="mt-1 sm:mt-0 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                            />
                            <label
                              htmlFor={`pref-${index}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {pref}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-4">Delete Account</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50">
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export async function getServerSideProps({ req }: { req: any }) {
  const token = req.cookies.token;

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

export default ProfilePage;
