"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutGrid,
  Megaphone,
  Ticket,
  Package,
  Users,
  NotebookText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    produk: false,
    pelanggan: false,
    promo: false,
  });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedMenus({
        produk: false,
        pelanggan: false,
        promo: false,
      });
    }
  };

  useEffect(() => {
    if (router.pathname.startsWith('/produk')) {
      setExpandedMenus(prev => ({
        ...prev,
        produk: true
      }));
    }
    if (router.pathname.startsWith('/pelanggan')) {
      setExpandedMenus(prev => ({
        ...prev,
        pelanggan: true
      }));
    }
    if (router.pathname.startsWith('/promo')) {
      setExpandedMenus(prev => ({
        ...prev,
        pelanggan: true
      }));
    }
  }, [router.pathname]);

  const toggleMenu = (menu: string) => {
    if (!isCollapsed) {
      setExpandedMenus((prev) => ({
        ...prev,
        [menu]: !prev[menu],
      }));
    }
  };

  const isActive = (path: string) => {
    if (path === '/produk') {
      return router.pathname.startsWith('/produk');
    }
    if (path === '/pelanggan') {
      return router.pathname.startsWith('/pelanggan');
    }
    if (path === '/promo') {
      return router.pathname.startsWith('/promo');
    }
    return router.pathname === path;
  };

  return (
    <aside
      className={`relative border-r border-r-gray-100  h-screen bg-white transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-6 bg-[#32577e] text-white rounded-full p-1.5 cursor-pointer shadow-md hover:bg-gray-800"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex flex-col pt-14">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-100 cursor-pointer
            ${isActive("/dashboard") ? "bg-blue-100 text-[#32577e]" : ""}`}
        >
          <LayoutGrid size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* produk Menu with Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("produk")}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 cursor-pointer
              ${isActive("/produk") ? "bg-blue-100 text-[#32577e]" : ""}`}
          >
            <Package size={20} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Produk</span>
                {expandedMenus.produk ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </>
            )}
          </button>

          {!isCollapsed && expandedMenus.produk && (
            <div className="ml-4 border-l border-gray-200">
              <Link
                href="/produk/daftarproduk"
                className={`flex items-center gap-3 pl-7 pr-4 py-2 hover:bg-slate-100 cursor-pointer
                  ${isActive("/produk/daftarproduk") ? "bg-blue-100 text-[#32577e]" : ""}`}
              >
                <span className="text-sm">Daftar Produk</span>
              </Link>
              <Link
                href="/produk/tambah"
                className={`flex items-center gap-3 pl-7 pr-4 py-2 hover:bg-slate-100 cursor-pointer
                  ${isActive("/produk/tambah") ? "bg-blue-100 text-[#32577e]" : ""}`}
              >
                <span className="text-sm">Tambah Produk</span>
              </Link>
            </div>
          )}
        </div>

        {/* pelanggan Menu with Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("pelanggan")}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 cursor-pointer
              ${isActive("/pelanggan") ? "bg-blue-100 text-[#32577e]" : ""}`}
          >
            <Users size={20} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Pelanggan</span>
                {expandedMenus.pelanggan ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </>
            )}
          </button>

          {!isCollapsed && expandedMenus.pelanggan && (
            <div className="ml-4 border-l border-gray-200">
              <Link
                href="/ulasan/listulasan"
                className={`flex items-center gap-3 pl-7 pr-4 py-2 hover:bg-slate-100 cursor-pointer
                  ${isActive("/pelanggan/ulasan") ? "bg-blue-100 text-[#32577e]" : ""}`}
              >
                <span className="text-sm">Ulasan</span>
              </Link>
              <Link
                href="/pelanggan/pesanandikomplain"
                className={`flex items-center gap-3 pl-7 pr-4 py-2 hover:bg-slate-100 cursor-pointer
                  ${isActive("/pelanggan/pesanandikomplain") ? "bg-blue-100 text-[#32577e]" : ""}`}
              >
                <span className="text-sm">Pesanan di Komplain</span>
              </Link>
            </div>
          )}
        </div>

        <div>
          <Link
            href="/pesanan/semuapesanan"
            className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-100 cursor-pointer
              ${isActive("/pesanan") ? "bg-blue-100 text-[#32577e]" : ""}`}
          >
            <NotebookText size={20} />
            {!isCollapsed && <span>Pesanan</span>}
          </Link>
        </div>

        <div>
          <Link
            href="/promo/listpromo"
            className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-100 cursor-pointer
              ${isActive("/promo") ? "bg-blue-100 text-[#32577e]" : ""}`}
          >
            <Ticket size={20} />
            {!isCollapsed && <span>Promo</span>}
          </Link>
        </div>

      </div>
    </aside>
  );
}