import Header from "@/components/dashboard/layout/HeaderDashboard";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Ulasan, UlasanFilter } from "@/types/product";
import UlasanTabs from "@/components/dashboard/layout/UlasanTabs";
import { useState } from "react";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for testing
const mockUlasan: Ulasan[] = [
  {
    id: 1,
    namaProduk: "Samsung Electronics Galaxy S21 5G",
    rating: "4.5/5",
    totalUlsan: 100
  },
  {
    id: 2,
    namaProduk: "Samsung Electronics Galaxy S25 5G",
    rating: "4.5/5",
    totalUlsan: 100
  }
];

export default function ListUlasan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<UlasanFilter>({
    id: 0,
    namaProduk: ""
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
      id: 0,
      namaProduk: "",
    });
    setCurrentPage(1);
  };

  const filteredUlasan = mockUlasan.filter((ulasan) => {
    const matchesSearch = ulasan.namaProduk
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesNamaProduk = filters.namaProduk
      ? ulasan.namaProduk.toLowerCase().includes(filters.namaProduk.toLowerCase())
      : true;

    return matchesSearch && matchesNamaProduk;
  });

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
              <div className="p-6 space-y-6 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Cari ulasan..."
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
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Produk
                        </label>
                        <input
                          type="text"
                          name="namaProduk"
                          value={filters.namaProduk}
                          onChange={handleFilterChange}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                          placeholder="Filter berdasarkan nama produk"
                        />
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
                      <th className="w-[40%] p-4 text-left text-sm font-medium text-gray-700 bg-gray-50">
                        Nama Produk
                      </th>
                      <th className="w-[20%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Rating
                      </th>
                      <th className="w-[20%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Total Ulasan
                      </th>
                      <th className="w-[20%] p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedUlasan.map((ulasan) => (
                      <tr key={ulasan.id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-700">
                          {ulasan.namaProduk}
                        </td>
                        <td className="p-4 text-center text-gray-700">
                          {ulasan.rating}
                        </td>
                        <td className="p-4 text-center text-gray-700">
                          {ulasan.totalUlsan}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                              Detail
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
