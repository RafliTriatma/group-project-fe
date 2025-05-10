export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
} 

export interface Produk {
  id: number;
  namaProduk: string;
  harga: number;
  stok: number
  status: 'active' | 'inactive';
}

export interface ProdukFilters {
  status: string;
}

export interface Iklan {
  id: number;
  title: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface IklanFilters {
  status: string;
  startDate: string;
  endDate: string;
}

export interface Ulasan {
  id: number;
  namaProduk: string;
  rating: string;
  totalUlsan: number;
}

export interface UlasanFilter {
  id: number;
  namaProduk: string;
}

export interface UlasanInbox {
  id: number;
  namaProduk: string;
  idPesanan: string;
  ulasan: string;
}


export interface Promo {
  id: number;
  title: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
}

export interface PromoFilters {
  status: string;
  startDate: string;
  endDate: string;
}

export interface PromoFormData {
  judul: string;
  kode: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
}

export interface PromoFormErrors {
  judul: string;
  kode: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
}