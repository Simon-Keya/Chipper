export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  imageUrl: string;
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