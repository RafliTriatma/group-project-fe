import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface TrackingUpdate {
  status: string;
  location?: string;
  timestamp?: string;
  time?: string; // Untuk kompatibilitas dengan data lama
  date: string;
  completed: boolean;
}

interface OrderTrackingProps {
  updates: TrackingUpdate[];
  orderNumber: string;
}

// Urutan status pengiriman yang standar
const statusOrder = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const OrderTracking: React.FC<OrderTrackingProps> = ({
  updates,
  orderNumber,
}) => {
  // Urutkan berdasarkan urutan proses standar, bukan berdasarkan tanggal
  const sortedUpdates = [...updates].sort((a, b) => {
    const indexA = statusOrder.indexOf(a.status);
    const indexB = statusOrder.indexOf(b.status);
    return indexA - indexB; // Mengurutkan dari awal proses (Order Placed) sampai akhir (Delivered)
  });

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Delivery Tracking</h2>

      {/* Progress Timeline */}
      <div className="relative pl-1">
        {sortedUpdates.map((update, index) => (
          <div key={index} className="flex mb-8 relative">
            {/* Timeline connector line */}
            {index < sortedUpdates.length - 1 && (
              <div
                className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                  update.completed && sortedUpdates[index + 1].completed
                    ? "bg-green-500"
                    : "bg-gray-200"
                } h-full`}
              ></div>
            )}

            {/* Status icon */}
            <div className="mr-4 relative z-10">
              {update.completed ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
              )}
            </div>

            {/* Status details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <p
                    className={`font-medium ${
                      update.completed ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {update.status}
                    {update.location && ` - ${update.location}`}
                  </p>
                  {update.status === "Delivered" && update.completed && (
                    <p className="text-sm text-green-600 mt-1">
                      Pesanan telah sampai di tujuan
                    </p>
                  )}
                </div>
                <div
                  className={`text-sm mt-1 md:mt-0 ${
                    update.completed ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  <p>{update.date !== "Pending" ? update.date : "-"}</p>
                  <p>
                    {(update.timestamp || update.time) !== "Pending"
                      ? update.timestamp || update.time
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Order ID:{" "}
          <span className="font-medium text-gray-700">{orderNumber}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Jika Anda memiliki pertanyaan tentang pengiriman, hubungi layanan
          pelanggan kami.
        </p>
      </div>
    </div>
  );
};

export default OrderTracking;
