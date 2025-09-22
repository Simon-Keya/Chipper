import { Category, Order, Product } from './types';

export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  try {
    const url = categoryId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/products?categoryId=${categoryId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
    const res = await fetch(url, {
      cache: 'no-store', // Ensure fresh data for SSG
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const products: Product[] = await res.json();
    return products.map((product) => ({
      ...product,
      imageUrl: `${product.imageUrl}?w=300&h=200&c=fill&q=80`, // Optimize Cloudinary URL
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch product');
    const product: Product = await res.json();
    return {
      ...product,
      imageUrl: `${product.imageUrl}?w=600&h=400&c=fill&q=80`, // Optimize for product page
    };
  } catch (error) {
    throw new Error('Product not found');
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: 'force-cache', // Categories are less likely to change
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchOrders(token: string): Promise<Order[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const orders: Order[] = await res.json();
    return orders.map((order) => ({
      ...order,
      product: {
        ...order.product,
        imageUrl: `${order.product.imageUrl}?w=50&h=50&c=fill&q=80`, // Optimize for order table
      },
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}