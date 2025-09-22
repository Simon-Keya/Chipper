export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl: string; // Cloudinary URL, e.g., https://res.cloudinary.com/<cloud-name>/image/upload/...
  stock: number;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface Order {
  id: number;
  productId: number;
  customerDetails: string;
  status: string;
  createdAt: string;
  product: Product;
}