import Header from "@/components/dashboard/layout/HeaderDashboard";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { UlasanInbox } from "@/types/product";
import UlasanTabs from "@/components/dashboard/layout/UlasanTabs";
import { useState } from "react";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for testing
const mockUlasan: UlasanInbox[] = [
  {
    id: 1,
    namaProduk: "Samsung Electronics Galaxy S21 5G",
    idPesanan: "ABC456",
    ulasan: "Samsung Galaxy S21 hadir dengan desain premium yang lebih ramping dan modern dibanding pendahulunya. Bagian belakang menggunakan material kaca matte yang tidak mudah meninggalkan sidik jari"
  },
  {
    id: 2,
    namaProduk: "Samsung Electronics Galaxy S25 5G", 
    idPesanan: "ABC456",
    ulasan: "Samsung Galaxy S25 hadir dengan desain premium yang lebih ramping dan modern dibanding pendahulunya. Bagian belakang menggunakan material kaca matte yang tidak mudah meninggalkan sidik jari, dan sisi-sisi melengkung memberikan kenyamanan saat digenggam. Layar Dynamic AMOLED 2X 6,8 inci dengan refresh rate 144Hz memberikan visual yang super mulus dan warna yang sangat hidup, cocok untuk menonton video maupun bermain game."
  }
];

export default function InboxUlasan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUlasan = mockUlasan.filter((ulasan) =>
    ulasan.namaProduk.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUlasan.length / itemsPerPage);
  const paginatedUlasan = filteredUlasan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-col sm:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <UlasanTabs />
          <div className="bg-white rounded-md shadow-md mb-4">
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Search and Filter Controls */}

              {/* Table Content */}
              <div className="flex-1 overflow-auto px-6 scrollbar-gutter-stable custom-scrollbar">
                <table className="w-full table-fixed border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-[40%] p-4 text-left text-sm font-medium text-gray-700 bg-gray-50">
                        Nama Produk
                      </th>
                      <th className="w-[20%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        ID Pesanan
                      </th>
                      <th className="w-[20%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Ulasan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedUlasan.map((ulasan: UlasanInbox) => (
                      <tr key={ulasan.id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-700">
                          {ulasan.namaProduk}
                        </td>
                        <td className="p-4 text-center text-gray-700">
                          {ulasan.idPesanan}
                        </td>
                        <td className="p-4 text-center text-gray-700">
                          {ulasan.ulasan.substring(0, 50)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-100 px-6 py-4 flex-shrink-0 bg-white">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        filteredUlasan.length
                      )}
                      -
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredUlasan.length
                      )}{" "}
                      of {filteredUlasan.length} results
                    </p>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <Button
                        onClick={() =>
                          setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <Button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === index + 1
                              ? "z-10 bg-[#32577e] text-white"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </Button>
                      ))}
                      <Button
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(totalPages, page + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
