import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "next/app";
import { AuthProvider } from "@/contex/AuthContex";
import { CartProvider } from "@/contex/CartContex";
import { WishlistProvider } from "@/contex/WishlistContext";
import { ToastContainer } from "react-toastify";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
