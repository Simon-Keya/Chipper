'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { fetchCategories, fetchProducts } from '../lib/api';
import { Category, Product } from '../lib/types';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on the client
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(selectedCategory?.toString()),
          fetchCategories(),
        ]);

        setProducts(fetchedProducts || []);
        setCategories(fetchedCategories || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory]);

  const handleCategoryChange = (newCategoryId: number | null) => {
    setSelectedCategory(newCategoryId);
  };

  return (
    <div className="bg-base-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 text-center">
        <motion.h1
          className="text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to Our Store
        </motion.h1>

        <motion.p
          className="text-lg opacity-90 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Discover amazing deals on the latest gadgets, accessories, and more.
        </motion.p>

        <motion.button
          className="btn btn-accent mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Shop Now
        </motion.button>
      </section>

      {/* OFFERS SECTION */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Special Offers</h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {[
            { title: "Flash Sale", desc: "Up to 50% OFF today only!" },
            { title: "New Arrivals", desc: "Fresh products just landed." },
            { title: "Best Sellers", desc: "Top-rated items loved by customers." },
          ].map((offer, i) => (
            <motion.div
              key={i}
              className="card bg-primary text-white shadow-xl p-6"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
              <p>{offer.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="flex justify-center mt-10 mb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* PRODUCTS SECTION */}
      <section className="container mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {selectedCategory ? "Filtered Products" : "Featured Products"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center">
            <p className="text-neutral-content text-lg">
              No products available for this category.
            </p>
            <button
              onClick={() => handleCategoryChange(null)}
              className="btn btn-outline btn-primary mt-4"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
