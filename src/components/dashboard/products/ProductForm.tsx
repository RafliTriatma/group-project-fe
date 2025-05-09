"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/product"

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: Omit<Product, "id">) => void
}

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    status: initialData?.status || "Aktif",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? parseInt(value) : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="w-full p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-6">{initialData ? "Edit Produk" : "Tambah Produk"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Nama Produk
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium">
              Harga
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block mb-2 text-sm font-medium">
              Stok
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block mb-2 text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-6 py-2 bg-[#2c3e50] text-white rounded-md hover:bg-[#1e2a36]">
            {initialData ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  )
} 