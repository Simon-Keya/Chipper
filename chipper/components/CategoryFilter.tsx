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
      <button
        className={`btn btn-sm ${
          selectedCategory === null ? 'btn-primary' : 'btn-outline btn-primary'
        } hover:bg-primary hover:text-base-100 transition-colors duration-300`}
        onClick={() => onChange(null)}
        aria-label="Show all products"
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`btn btn-sm ${
            selectedCategory === cat.id ? 'btn-primary' : 'btn-outline btn-primary'
          } hover:bg-primary hover:text-base-100 transition-colors duration-300`}
          onClick={() => onChange(cat.id)}
          aria-label={`Filter by ${cat.name}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}