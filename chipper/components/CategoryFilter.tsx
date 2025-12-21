'use client';

import { Category } from '../lib/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onChange: (categoryId: number | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* All Products Button */}
      <button
        onClick={() => onChange(null)}
        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
          selectedCategory === null
            ? 'bg-primary text-white border-2 border-primary'
            : 'bg-base-100 text-base-content border-2 border-base-300 hover:border-primary hover:bg-primary/10'
        }`}
        aria-label="Show all products"
        aria-pressed={selectedCategory === null}
      >
        All Products
      </button>

      {/* Category Buttons */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
            selectedCategory === category.id
              ? 'bg-primary text-white border-2 border-primary'
              : 'bg-base-100 text-base-content border-2 border-base-300 hover:border-primary hover:bg-primary/10'
          }`}
          aria-label={`Filter by ${category.name}`}
          aria-pressed={selectedCategory === category.id}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}