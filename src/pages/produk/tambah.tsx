import Header from "@/components/dashboard/layout/HeaderDashboard";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import {
  ChevronDown,
  CircleFadingArrowUp,
} from "lucide-react";

interface ImageFiles {
  mainImage: File | null;
  secondImage: File | null;
  thirdImage: File | null;
  fourthImage: File | null;
}

export default function TambahIklanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageFiles>({
    mainImage: null,
    secondImage: null,
    thirdImage: null,
    fourthImage: null
  });
  const [preview, setPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    namaProduk: "",
    kategori: "",
    harga: 0,
    stok: 0,
    deskripsi: "",
  });
  const [errors, setErrors] = useState({
    namaProduk: "",
    kategori: "",
    harga: "",
    stok: "",
    deskripsi: "",
  });
  const maxChars = 5000;
  
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    setImages: React.Dispatch<React.SetStateAction<ImageFiles>>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // Validasi tipe dan ukuran file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const minSize = 300; // px (as a reference, you'd usually check actual pixel size separately)
  
    if (!validTypes.includes(file.type)) {
      alert('Format gambar tidak didukung. Gunakan .jpg, .jpeg, atau .png');
      return;
    }

    // Create preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  
    // Menetapkan file ke slot yang sesuai berdasarkan index
    setImages((prevImages) => {
      const updatedImages = { ...prevImages };
      switch (index) {
        case 0:
          updatedImages.mainImage = file;
          break;
        case 1:
          updatedImages.secondImage = file;
          break;
        case 2:
          updatedImages.thirdImage = file;
          break;
        case 3:
          updatedImages.fourthImage = file;
          break;
        default:
          break;
      }
      return updatedImages;
    });
  };

  // Wrapper functions for each image upload
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 0, setImages);
  const handleSecondImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 1, setImages);
  const handleThirdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 2, setImages);
  const handleFourthImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 3, setImages);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImages({
      mainImage: null,
      secondImage: null,
      thirdImage: null,
      fourthImage: null
    });
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setFormData({
      namaProduk: "",
      kategori: "Pilih Kategori",
      harga: 0,
      stok: 0,
      deskripsi: "",
    });
    setImages({
      mainImage: null,
      secondImage: null,
      thirdImage: null,
      fourthImage: null
    });
    setPreview("");
    setErrors({
      namaProduk: "",
      kategori: "",
      harga: "",
      stok: "",
      deskripsi: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    let tempErrors = {
      namaProduk: "",
      kategori: "",
      harga: "",
      stok: "",
      deskripsi: "",
    };
    let isValid = true;

    if (!formData.namaProduk.trim()) {
      tempErrors.namaProduk = "Nama Produk harus diisi";
      isValid = false;
    }

    if (!formData.kategori) {
      tempErrors.kategori = "Kategori harus dipilih";
      isValid = false;
    }

    if (formData.harga <= 0) {
      tempErrors.harga = "Harga harus tidak boleh kosong";
      isValid = false;
    }
    if (formData.stok < 0) {
      tempErrors.stok = "Stok tidak boleh kosong";
      isValid = false;
    }
    if (formData.deskripsi.length < 260) {
      tempErrors.deskripsi = "Deskripsi harus lebih dari 260 karakter";
      isValid = false;
    } else if (formData.deskripsi.length > maxChars) {
      tempErrors.deskripsi = `Deskripsi tidak boleh lebih dari ${maxChars} karakter`;
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", { ...formData, banner: images.mainImage });
      router.push("/iklan/daftar");
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-col sm:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-800">Tambah Produk</h1>
            </div>

            <form onSubmit={handleSubmit} noValidate className="p-6">
              <div className="space-y-6 max-w-full">
                <div>
                  <label
                    htmlFor="namaProduk"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    id="namaProduk"
                    name="namaProduk"
                    value={formData.namaProduk}
                    onChange={handleChange}
                    placeholder="Masukkan nama produk"
                    className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2
                      ${
                        errors.namaProduk
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                      }`}
                  />
                  {errors.namaProduk && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.namaProduk}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="kategori"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      id="kategori"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleChange}
                      className={`w-full p-3 pr-12 border rounded-lg transition-colors focus:outline-none focus:ring-2 appearance-none
                      ${
                        errors.kategori
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                      }`}
                    >
                      <option selected disabled>
                        Pilih Kategori
                      </option>
                      <option value="elektronik">Elektronik</option>
                      <option value="fashion">Fashion</option>
                      <option value="rumah-tangga">Rumah Tangga</option>
                      <option value="otomotif">Otomotif</option>
                      <option value="olahraga">Olahraga</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      size={20}
                    />
                  </div>
                  {errors.kategori && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.kategori}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="harga"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Harga Produk
                  </label>
                  <input
                    type="number"
                    id="harga"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    placeholder="Masukkan harga produk"
                    className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2
                      ${
                        errors.harga
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                      }`}
                  />
                  {errors.harga && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.harga}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Stock Produk
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    placeholder="Masukkan stock produk"
                    className={`w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2
                      ${
                        errors.stok
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                      }`}
                  />
                  {errors.stok && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.stok}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Produk
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Format foto harus .jpg, .jpeg, .png dan ukuran min. 300 x
                    300 px (untuk gambar optimal, gunakan ukuran min. 1200 x
                    1200 px).
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 text-center text-sm text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleMainImageUpload}
                        ref={fileInputRef}
                      />
                      {!images.mainImage ? (
                        <>
                          <CircleFadingArrowUp className="w-6 h-6 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                          <span className="font-medium group-hover:text-blue-600">
                            Foto Utama
                          </span>
                          <span className="text-xs mt-1 text-gray-400">
                            Klik untuk unggah
                          </span>
                        </>
                      ) : (
                        <>
                          <img 
                            src={URL.createObjectURL(images.mainImage)}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            X
                          </button>
                        </>
                      )}
                    </div>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 text-center text-sm text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleSecondImageUpload}
                        ref={fileInputRef}
                      />
                      {!images.mainImage ? (
                        <>
                          <CircleFadingArrowUp className="w-6 h-6 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                          <span className="font-medium group-hover:text-blue-600">
                            Foto Ke Dua
                          </span>
                          <span className="text-xs mt-1 text-gray-400">
                            Klik untuk unggah
                          </span>
                        </>
                      ) : (
                        <>
                          <img 
                            src={URL.createObjectURL(images.mainImage)}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            X
                          </button>
                        </>
                      )}
                    </div>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 text-center text-sm text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleThirdImageUpload}
                        ref={fileInputRef}
                      />
                      {!preview ? (
                        <>
                          <CircleFadingArrowUp className="w-6 h-6 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                          <span className="font-medium group-hover:text-blue-600">
                          Foto Ke Tiga
                          </span>
                          <span className="text-xs mt-1 text-gray-400">
                            Klik untuk unggah
                          </span>
                        </>
                      ) : (
                        <>
                          <img 
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            X
                          </button>
                        </>
                      )}
                    </div>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 text-center text-sm text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFourthImageUpload}
                        ref={fileInputRef}
                      />
                      {!preview ? (
                        <>
                          <CircleFadingArrowUp className="w-6 h-6 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                          <span className="font-medium group-hover:text-blue-600">
                          Foto Ke Empat
                          </span>
                          <span className="text-xs mt-1 text-gray-400">
                            Klik untuk unggah
                          </span>
                        </>
                      ) : (
                        <>
                          <img 
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            X
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Produk
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Pastikan deskripsi produk memuat penjelasan detail terkait
                    produkmu agar pembeli mudah mengerti dan menemukan produkmu.
                  </p>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 ${
                      errors.deskripsi
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                    }`}
                    placeholder="Deskripsi Produk"
                  ></textarea>
                  {errors.deskripsi && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.deskripsi}</p>
                  )}
                  <p className="text-xs text-gray-500 text-right mt-1">
                    Tulis deskripsi produkmu min. 260 karakter agar pembeli
                    semakin mudah mengerti. {formData.deskripsi.length}/{maxChars}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors rounded-lg"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2.5 bg-[#32577e] hover:bg-[#264463] text-white font-medium transition-colors rounded-lg"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
