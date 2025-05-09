"use client"

import { useState } from "react"
import { Filter, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Product } from "@/types"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Samsung Electronics Samsung...",
      price: 8300000,
      stock: 100,
      status: "Aktif",
    },
    {
      id: 2,
      name: "Samsung Electronics Samsung...",
      price: 8300000,
      stock: 100,
      status: "Aktif",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product.id))
    }
  }

  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
    setSelectedProducts(selectedProducts.filter((productId) => productId !== id))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="w-full p-6 rounded-md shadow-sm">
      <div className="bg-zinc-300 p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari data"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button className="px-6 py-2 bg-[#2c3e50] text-white rounded-md hover:bg-[#1e2a36]">Cek</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#2c3e50] text-white">
                <th className="p-3 text-left">
                  <Checkbox
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#2c3e50]"
                  />
                </th>
                <th className="p-3 text-left">Nama Produk</th>
                <th className="p-3 text-left">Harga</th>
                <th className="p-3 text-left">Stok</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((product) => (
                  <tr key={product.id} className="border-b border-gray-200">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{formatPrice(product.price)}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{product.status}</td>
                    <td className="p-3">
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 