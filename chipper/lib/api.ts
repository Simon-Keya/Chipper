// lib/api.ts

import { CartItem, CartResponse, Category, Order, Product, ProductPayload, Review, ReviewPayload } from "./types";

// Critical fix: Remove /api from base URL — it's already mounted in server.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Utility: prevents fetching during build-time (on server)
function isServer() {
  return typeof window === 'undefined';
}
// -------------------- AUTH --------------------

export async function loginUser(username: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  // Critical fix: Handle empty/invalid response body
  if (!res.ok) {
    let errorMessage = 'Login failed';
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is empty or not JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Also safely parse JSON
  const text = await res.text();
  if (!text) {
    throw new Error('Empty response from server');
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid response format');
  }
}
// -------------------- PRODUCTS --------------------

export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  if (isServer()) return [];
  try {
    const url = categoryId
      ? `${API_BASE_URL}/api/products?categoryId=${categoryId}`
      : `${API_BASE_URL}/api/products`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  if (isServer()) throw new Error("fetchProduct called on server.");
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);
  return await res.json();
}

export async function createProduct(
  product: ProductPayload | FormData,
  token: string
): Promise<Product> {
  if (isServer()) throw new Error("createProduct called on server.");
  const isFormData = product instanceof FormData;

  const res = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? product : JSON.stringify(product),
  });

  if (!res.ok) throw new Error(`Failed to create product: ${res.statusText}`);
  return await res.json();
}

export async function updateProduct(
  id: number,
  product: ProductPayload | FormData,
  token: string
): Promise<Product> {
  if (isServer()) throw new Error("updateProduct called on server.");
  const isFormData = product instanceof FormData;

  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? product : JSON.stringify(product),
  });

  if (!res.ok) throw new Error(`Failed to update product: ${res.statusText}`);
  return await res.json();
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  if (isServer()) throw new Error("deleteProduct called on server.");
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete product: ${res.statusText}`);
}

// -------------------- CLOUDINARY UPLOAD --------------------

export async function uploadImage(file: File, token: string): Promise<string> {
  if (isServer()) throw new Error("uploadImage called on server.");
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error(`Failed to upload image: ${res.statusText}`);

  const data = await res.json();
  return data.url;
}

// -------------------- CATEGORIES --------------------

export async function fetchCategories(): Promise<Category[]> {
  if (isServer()) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {  // ← Fixed: /api/categories
      cache: "force-cache",
    });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(
  data: FormData,
  token: string
): Promise<Category> {
  if (isServer()) throw new Error("createCategory called on server.");

  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to create category");
  }

  return await res.json();
}

export async function updateCategory(
  id: number,
  data: FormData,
  token: string
): Promise<Category> {
  if (isServer()) throw new Error("updateCategory called on server.");

  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to update category");
  }

  return await res.json();
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  if (isServer()) throw new Error("deleteCategory called on server.");
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete category: ${res.statusText}`);
}

// -------------------- ORDERS --------------------

export async function fetchOrders(token: string): Promise<Order[]> {
  if (isServer()) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function fetchOrder(id: string, token: string): Promise<Order> {
  if (isServer()) throw new Error("fetchOrder called on server.");
  const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch order: ${res.statusText}`);
  return await res.json();
}

export async function updateOrderStatus(
  id: number,
  status: string,
  token: string
): Promise<Order> {
  if (isServer()) throw new Error("updateOrderStatus called on server.");
  const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update order status: ${res.statusText}`);
  return await res.json();
}

export async function deleteOrder(id: number, token: string): Promise<void> {
  if (isServer()) throw new Error("deleteOrder called on server.");
  const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete order: ${res.statusText}`);
}

export async function createOrder(
  orderData: {
    productId: number;
    quantity: number;
    customerDetails?: string;
    status?: string;
  },
  token: string
): Promise<Order> {
  if (isServer()) throw new Error("createOrder called on server.");
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error(`Failed to create order: ${res.statusText}`);
  return await res.json();
}

// -------------------- CART --------------------

export async function fetchCart(token: string): Promise<CartResponse> {
  if (isServer()) throw new Error("fetchCart called on server.");
  const res = await fetch(`${API_BASE_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch cart: ${res.statusText}`);
  return await res.json();
}

export async function updateCartItem(id: number, quantity: number, token: string): Promise<CartItem> {
  if (isServer()) throw new Error("updateCartItem called on server.");
  const res = await fetch(`${API_BASE_URL}/api/cart/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error(`Failed to update cart item: ${res.statusText}`);
  return await res.json();
}

export async function removeFromCart(id: number, token: string): Promise<void> {
  if (isServer()) throw new Error("removeFromCart called on server.");
  const res = await fetch(`${API_BASE_URL}/api/cart/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to remove from cart: ${res.statusText}`);
}

export async function addToCart(productId: number, quantity: number = 1, token: string): Promise<CartItem> {
  if (isServer()) throw new Error("addToCart called on server.");
  const res = await fetch(`${API_BASE_URL}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error(`Failed to add to cart: ${res.statusText}`);
  return await res.json();
}

export async function clearCart(token: string): Promise<void> {
  if (isServer()) throw new Error("clearCart called on server.");
  const res = await fetch(`${API_BASE_URL}/api/cart/clear`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to clear cart: ${res.statusText}`);
}

// -------------------- REVIEWS --------------------

export async function fetchReviews(productId: number, token?: string): Promise<Review[]> {
  if (isServer()) return [];
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function addReview(productId: number, reviewData: ReviewPayload, token: string): Promise<Review> {
  if (isServer()) throw new Error("addReview called on server.");
  const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) throw new Error(`Failed to add review: ${res.statusText}`);
  return await res.json();
}

export async function deleteReview(reviewId: number, token: string): Promise<void> {
  if (isServer()) throw new Error("deleteReview called on server.");
  const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete review: ${res.statusText}`);
}