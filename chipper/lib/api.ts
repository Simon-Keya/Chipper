// src/utils/api.ts
import { Category, Order, Product } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface ProductPayload {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description: string;
  image?: string;
}

// ✅ Utility: prevents fetching during build-time (on server)
function isServer() {
  return typeof window === "undefined";
}

// -------------------- PRODUCTS --------------------

export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  if (isServer()) return []; // ✅ Skip server builds safely
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
  if (isServer()) return []; // ✅ Skip during prerender/build
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
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
  name: string,
  token: string
): Promise<Category> {
  if (isServer()) throw new Error("createCategory called on server.");
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Failed to create category: ${res.statusText}`);
  return await res.json();
}

export async function updateCategory(
  id: number,
  name: string,
  token: string
): Promise<Category> {
  if (isServer()) throw new Error("updateCategory called on server.");
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Failed to update category: ${res.statusText}`);
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
