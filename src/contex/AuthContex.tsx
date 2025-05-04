import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";

interface User {
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  // tambah field lain yang diperlukan
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      const response = await axiosInstance.get("/auth/profile");

      // Process user data to extract firstName and lastName if needed
      const userData = response.data;
      if (userData.name && (!userData.firstName || !userData.lastName)) {
        const nameParts = userData.name.split(" ");
        userData.firstName = nameParts[0] || "";
        userData.lastName = nameParts.slice(1).join(" ") || "";
      }

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { access_token } = response.data;
      if (!access_token) {
        throw new Error("Login failed: No access token received");
      }

      Cookies.set("token", access_token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      setIsAuthenticated(true);
      await fetchUserData(access_token);
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser(null);
  };

  // Function to update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };

      // If firstName or lastName is updated, update the name as well
      if (
        (userData.firstName || userData.lastName) &&
        updatedUser.firstName &&
        updatedUser.lastName
      ) {
        updatedUser.name =
          `${updatedUser.firstName} ${updatedUser.lastName}`.trim();
      }

      setUser(updatedUser);

      // In a real app, you would also send this data to the server
      // Example:
      // axiosInstance.put('/auth/profile', userData)
      //   .catch(error => console.error('Failed to update user profile:', error));
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout: handleLogout,
    isLoading: loading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
