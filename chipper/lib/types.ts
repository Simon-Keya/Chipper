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

export interface ProductPayload {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description: string;
  image?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}