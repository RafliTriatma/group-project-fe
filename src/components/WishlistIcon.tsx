import React from "react";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "@/contex/WishlistContext";
import Link from "next/link";

const WishlistIcon = () => {
  const { wishlist } = useWishlist();
  const totalItems = wishlist.length;

  return (
    <Link href="/wishlist" className="relative">
      <FaHeart className="h-6 w-6 text-gray-600" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon; 