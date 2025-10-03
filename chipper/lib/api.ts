import { Category, Order, Product } from './types';

const API_BASE_URL = 'http://localhost:5001';

export interface ProductPayload {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description: string;
  image?: string; // Cloudinary URL or raw string
}

// -------------------- PRODUCTS --------------------

export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  try {
    const url = categoryId
      ? `${API_BASE_URL}/api/products?categoryId=${categoryId}`
      : `${API_BASE_URL}/api/products`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
    return await res.json();
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);
  return await res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  return fetchProduct(id);
}

/**
 * Create product
 * Accepts either:
 *  - ProductPayload (JSON body)
 *  - FormData (multipart/form-data)
 */
export async function createProduct(product: ProductPayload | FormData, token: string): Promise<Product> {
  const isFormData = product instanceof FormData;

  const res = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? product : JSON.stringify(product),
  });

  if (!res.ok) throw new Error(`Failed to create product: ${res.statusText}`);
  return await res.json();
}

/**
 * Update product
 * Accepts either:
 *  - ProductPayload (JSON body)
 *  - FormData (multipart/form-data)
 */
export async function updateProduct(id: number, product: ProductPayload | FormData, token: string): Promise<Product> {
  const isFormData = product instanceof FormData;

  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? product : JSON.stringify(product),
  });

  if (!res.ok) throw new Error(`Failed to update product: ${res.statusText}`);
  return await res.json();
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete product: ${res.statusText}`);
}

// -------------------- CATEGORIES --------------------

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
    return await res.json();
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(name: string, token: string): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Failed to create category: ${res.statusText}`);
  return await res.json();
}

export async function updateCategory(id: number, name: string, token: string): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Failed to update category: ${res.statusText}`);
  return await res.json();
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete category: ${res.statusText}`);
}

// -------------------- ORDERS --------------------

export async function fetchOrders(token: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.statusText}`);
    return await res.json();
  } catch (error: unknown) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
