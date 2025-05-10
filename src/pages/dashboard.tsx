import HeaderDasboard from "@/components/dashboard/layout/HeaderDashboard";
import Sidebar from "@/components/dashboard/layout/Sidebar";

export default function DashboardPage() {
  return (
    <>
      <HeaderDasboard />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Total Produk</h2>
              <p className="text-3xl font-bold">24</p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Total Pengguna</h2>
              <p className="text-3xl font-bold">12</p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Pesanan Aktif</h2>
              <p className="text-3xl font-bold">8</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 