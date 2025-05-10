import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "next/app";
import { AuthProvider } from "@/contex/AuthContex";
import { CartProvider } from "@/contex/CartContex";
import { WishlistProvider } from "@/contex/WishlistContext";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Head>
            <title>KlikMart - Your One-Stop Shopping Destination</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
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

// export default MyApp;
// import "@/styles/globals.css";
// import type { AppProps } from "next/app";

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }
