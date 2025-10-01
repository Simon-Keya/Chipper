import { io } from 'socket.io-client';
import { Category, Order, Product } from './types';

// Define a type for the specific error we're looking for
interface FetchError extends Error {
  cause?: { code?: string };
}

// Type guard to check if an error has the 'cause' property
const isFetchError = (error: unknown): error is FetchError => {
  return error instanceof Error && 'cause' in error;
};

const API_BASE_URL ='http://localhost:5000';

export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  try {
    if (!API_BASE_URL) {
      console.warn('NEXT_PUBLIC_API_URL is not set. Using fallback: http://localhost:5000');
    }
    const url = categoryId
      ? `${API_BASE_URL}/api/products?categoryId=${categoryId}`
      : `${API_BASE_URL}/api/products`;
    const res = await fetch(url, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    const products: Product[] = await res.json();
    return products.map((product) => ({
      ...product,
      imageUrl: `${product.imageUrl}?w=300&h=200&c=fill&q=80`,
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching products:', errorMessage);
    if (isFetchError(error) && error.cause?.code === 'ECONNREFUSED') {
      console.error(`Cannot connect to backend at ${API_BASE_URL}. Ensure the server is running.`);
    }
    return [];
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  try {
    if (!API_BASE_URL) {
      console.warn('NEXT_PUBLIC_API_URL is not set. Using fallback: http://localhost:5000');
    }
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
    const product: Product = await res.json();
    return {
      ...product,
      imageUrl: `${product.imageUrl}?w=600&h=400&c=fill&q=80`,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching product:', errorMessage);
    throw new Error('Product not found');
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    if (!API_BASE_URL) {
      console.warn('NEXT_PUBLIC_API_URL is not set. Using fallback: http://localhost:5000');
    }
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      cache: 'force-cache',
    });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching categories:', errorMessage);
    if (isFetchError(error) && error.cause?.code === 'ECONNREFUSED') {
      console.error(`Cannot connect to backend at ${API_BASE_URL}. Ensure the server is running.`);
    }
    return [];
  }
}

export async function fetchOrders(token: string): Promise<Order[]> {
  try {
    if (!API_BASE_URL) {
      console.warn('NEXT_PUBLIC_API_URL is not set. Using fallback: http://localhost:5000');
    }
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
    const orders: Order[] = await res.json();
    return orders.map((order) => ({
      ...order,
      product: {
        ...order.product,
        imageUrl: `${order.product.imageUrl}?w=50&h=50&c=fill&q=80`,
      },
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching orders:', errorMessage);
    if (isFetchError(error) && error.cause?.code === 'ECONNREFUSED') {
      console.error(`Cannot connect to backend at ${API_BASE_URL}. Ensure the server is running.`);
    }
    return [];
  }
}

export async function createProduct(
  product: { name: string; price: number; stock: number; categoryId: number; description: string; imageUrl: string },
  token: string
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Failed to create product: ${res.status} ${res.statusText}`);
    const newProduct = await res.json();
    const socket = io(API_BASE_URL);
    socket.emit('new-product', newProduct);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error creating product:', errorMessage);
    throw error;
  }
}

export async function updateProduct(
  id: number,
  product: { name: string; price: number; stock: number; categoryId: number; description: string; imageUrl: string },
  token: string
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Failed to update product: ${res.status} ${res.statusText}`);
    const updatedProduct = await res.json();
    const socket = io(API_BASE_URL);
    socket.emit('update-product', updatedProduct);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error updating product:', errorMessage);
    throw error;
  }
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to delete product: ${res.status} ${res.statusText}`);
    const socket = io(API_BASE_URL);
    socket.emit('delete-product', { id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error deleting product:', errorMessage);
    throw error;
  }
}

export async function createCategory(name: string, token: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error(`Failed to create category: ${res.status} ${res.statusText}`);
    const newCategory = await res.json();
    const socket = io(API_BASE_URL);
    socket.emit('new-category', newCategory);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error creating category:', errorMessage);
    throw error;
  }
}

export async function updateCategory(id: number, name: string, token: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error(`Failed to update category: ${res.status} ${res.statusText}`);
    const updatedCategory = await res.json();
    const socket = io(API_BASE_URL);
    socket.emit('update-category', updatedCategory);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error updating category:', errorMessage);
    throw error;
  }
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to delete category: ${res.status} ${res.statusText}`);
    const socket = io(API_BASE_URL);
    socket.emit('delete-category', { id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error deleting category:', errorMessage);
    throw error;
  }
}