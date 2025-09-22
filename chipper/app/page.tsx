import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCategories, fetchProducts } from '../lib/api';
import { Category, Product } from '../lib/types';

export const metadata: Metadata = {
  title: 'Chipper - Your One-Stop Shop for Quality Products',
  description: 'Explore a wide range of products at Chipper, from electronics to clothing.',
  keywords: 'ecommerce, products, Chipper, shopping',
  openGraph: {
    title: 'Chipper',
    description: 'Discover quality products for all your needs.',
    url: 'https://chipper-store.com',
    images: ['/images/og-image.jpg'],
  },
};

export default async function Home() {
  const [products, categories]: [Product[], Category[]] = await Promise.all([fetchProducts(), fetchCategories()]);

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100">
      <section className="hero bg-neutral rounded-box shadow-lg mb-12">
        <div className="hero-content text-center py-16">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-base-100">Welcome to Chipper</h1>
            <p className="py-6 text-base-100">Discover quality products for every need, from electronics to fashion.</p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Shop by Category</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className="btn btn-outline btn-primary hover:bg-primary hover:text-base-100 transition-colors duration-300"
              aria-label={`Filter by ${category.name}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="card bg-neutral shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="object-cover w-full h-48"
                  priority={products.indexOf(product) < 4}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-lg text-neutral-content">{product.name}</h3>
                <p className="text-neutral-content">${product.price.toFixed(2)}</p>
                <p className="text-sm text-neutral-content/80">{product.category.name}</p>
                <div className="card-actions justify-end">
                  <Link href={`/products/${product.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}