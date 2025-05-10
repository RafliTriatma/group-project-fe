import React from "react";
import Link from "next/link";


export default function UlasanTabs() {

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-4 px-3 bg-white py-5 rounded-md">
        <Link href="/ulasan/listulasan">
          <button className="flex-1 sm:flex-none min-w-[120px] px-4 py-2 text-sm border rounded transition-all hover:cursor-pointer bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 hover:shadow-md active:bg-blue-100 active:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50">
            Rating Produk
          </button>
        </Link>
        <Link href="/ulasan/inboxulasan">
          <button className="flex-1 sm:flex-none min-w-[120px] px-4 py-2 text-sm border rounded transition-all hover:cursor-pointer bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 hover:shadow-md active:bg-blue-100 active:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50">
            Inbox Ulasan
          </button>
        </Link>
      </div>
    </div>
  );
}