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
    <div className="flex flex-wrap gap-2 mb-6">
      {/* All Products */}
      <button
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-300 ${
          selectedCategory === null
            ? 'bg-primary text-white border-primary'
            : 'bg-base-100 text-primary border-primary hover:bg-primary hover:text-white'
        }`}
        onClick={() => onChange(null)}
      >
        All
      </button>

      {/* Individual Categories */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-300 ${
            selectedCategory === cat.id
              ? 'bg-primary text-white border-primary'
              : 'bg-base-100 text-primary border-primary hover:bg-primary hover:text-white'
          }`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

