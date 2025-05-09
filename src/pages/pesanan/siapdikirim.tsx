import React from "react";
import Header from "@/components/dashboard/layout/Header";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import OrderTabs from "@/components/dashboard/layout/OrderTabs";
import { useRouter } from "next/router";

export default function SiapDiKirim() {
  const orders = [
    {
      name: "Budi Anak Baik",
      items: [
        {
          product: "Samsung Electronics Samsung Galaxy S21 5G",
          price: "Rp20.999.000,00",
          qty: 2,
          status: "Siap Dikirim",
          id: "#123ABC",
          total: "Rp41.998.000,00",
        },
        {
          product: "Samsung Galaxy Buds Pro 2",
          price: "Rp3.999.000,00",
          qty: 1,
          status: "Siap Dikirim",
          id: "#123ABC",
          total: "Rp3.999.000,00",
        },
      ],
    },
    {
      name: "Susi Susanti",
      items: [
        {
          product: "Samsung Electronics Samsung Galaxy S22 5G",
          price: "Rp20.999.000,00",
          qty: 2,
          status: "Dibatalkan",
          id: "#123ABC",
          total: "Rp41.998.000,00",
        },
        {
          product: "Samsung Galaxy Watch Ultra",
          price: "Rp8.999.000,00",
          qty: 1,
          status: "Dibatalkan",
          id: "#123ABC",
          total: "Rp8.999.000,00",
        },
      ],
    },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-col sm:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
              <OrderTabs />
              <div className="p-4 bg-white rounded-md shadow-md mb-4">
                <div className="grid grid-cols-6 bg-slate-800 text-white text-sm font-semibold p-6 min-w-[700px] rounded-md">
                    <div className="col-span-2">Nama Produk</div>
                    <div>Quantity</div>
                    <div>Status</div>
                    <div>ID Pesanan</div>
                    <div>Total</div>
                </div>
              {orders.map((order, i) => (
                <div
                  key={i}
                  className={` ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {order.name}
                    </div>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-6 text-sm text-gray-700 items-start min-w-[700px]"
                      >
                        <div className="col-span-2">
                          <p>{item.product}</p>
                          <p className="text-gray-500">{item.price}</p>
                        </div>
                        <div className="pt-1">X{item.qty}</div>
                        <div className="pt-1">{item.status}</div>
                        <div className="pt-1">{item.id}</div>
                        <div className="pt-1">{item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>
        </div>
      </div>
    </div>
  );
}
