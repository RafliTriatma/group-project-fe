import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="KlikMart - Your one-stop e-commerce solution" />
        <meta name="keywords" content="e-commerce, online shopping, KlikMart" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KlikMart" />
        <meta property="og:description" content="KlikMart - Your one-stop e-commerce solution" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
