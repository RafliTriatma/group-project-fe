import Header from "@/components/dashboard/layout/HeaderDashboard";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Produk, ProdukFilters } from "@/types/product";
import Link from "next/link";
import { useState } from "react";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for testing
const mockProduk: Produk[] = [
  {
    id: 1,
    namaProduk: "Smart TV 42 inch",
    harga: 4500000,
    stok: 12,
    status: "active"
  },
  {
    id: 2,
    namaProduk: "Laptop Core i5",
    harga: 7500000,
    stok: 8,
    status: "active"
  },
  {
    id: 3,
    namaProduk: "Kulkas 2 Pintu",
    harga: 3200000,
    stok: 5,
    status: "active"
  },
  {
    id: 4,
    namaProduk: "Mesin Cuci Front Load",
    harga: 4000000,
    stok: 3,
    status: "active"
  },
  {
    id: 5,
    namaProduk: "AC 1 PK",
    harga: 3700000,
    stok: 0,
    status: "active"
  },
  {
    id: 6,
    namaProduk: "Smartphone Android",
    harga: 2500000,
    stok: 20,
    status: "active"
  },
  {
    id: 7,
    namaProduk: "Headphone Bluetooth",
    harga: 450000,
    stok: 15,
    status: "active"
  },
  {
    id: 8,
    namaProduk: "Microwave Oven",
    harga: 1300000,
    stok: 6,
    status: "active"
  },
  {
    id: 9,
    namaProduk: "Kamera DSLR",
    harga: 8500000,
    stok: 2,
    status: "active"
  },
  {
    id: 10,
    namaProduk: "Printer Inkjet",
    harga: 900000,
    stok: 0,
    status: "active"
  },
  // Array data produk tambahan untuk testing
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 11,
    namaProduk: `Produk Test ${i + 1}`,
    harga: Math.floor(Math.random() * 10000000),
    stok: Math.floor(Math.random() * 100),
    status: i % 2 === 0 ? "active" : "inactive" as "active" | "inactive",
  })),
];

export default function DaftarProdukPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<ProdukFilters>({
    status: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
    });
    setCurrentPage(1);
  };

  const filteredProduk = mockProduk.filter((produk) => {
    const matchesSearch = produk.namaProduk
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || produk.status === filters.status;


    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage);
  const paginatedProduk = filteredProduk.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-hidden">
          <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">Daftar Produk</h1>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Search and Filter Controls */}
              <div className="p-6 space-y-6 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowFilter(!showFilter)}
                      className={`flex items-center gap-2 px-4 py-2 ${
                        showFilter
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-700"
                      } hover:bg-gray-200 font-medium transition-colors rounded-lg`}
                    >
                      <Filter size={20} />
                      Filter
                    </Button>
                    <Link href="/produk/tambah">
                      <Button className="px-6 py-2.5 bg-[#32577e] hover:bg-[#264463] text-white font-medium transition-colors rounded-lg">
                        Tambah Produk
                      </Button>
                    </Link>
                  </div>
                </div>

                {showFilter && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-700">Filter</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilter(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        >
                          <option value="">Semua Status</option>
                          <option value="active">Aktif</option>
                          <option value="inactive">Tidak Aktif</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={resetFilters}
                        className="text-gray-700 hover:text-gray-900"
                        variant="ghost"
                      >
                        Reset Filter
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-auto px-6 scrollbar-gutter-stable custom-scrollbar">
                <table className="w-full table-fixed border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-[25%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Nama Produk
                      </th>
                      <th className="w-[25%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Harga
                      </th>
                      <th className="w-[25%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Stok
                      </th>
                      <th className="w-[25%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        status
                      </th>
                      <th className="w-[25%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-center">
                    {paginatedProduk.map((produk) => (
                      <tr key={produk.id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-700 truncate">
                          {produk.namaProduk}
                        </td>
                        <td className="p-4 text-center text-gray-700">
                          {produk.harga.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </td>
                        <td className="p-4 text-gray-700 truncate">
                          {produk.stok}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              produk.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {produk.status === "active"
                              ? "Aktif"
                              : "Tidak Aktif"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                            >
                              Hapus
                            </Button>
                          </div>
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
                        filteredProduk.length
                      )}
                      -
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredProduk.length
                      )}{" "}
                      of {filteredProduk.length} results
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
