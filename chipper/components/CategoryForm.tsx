'use client';

import { useEffect, useState } from 'react';
import { createCategory, updateCategory } from '../lib/api';

interface CategoryFormProps {
  token: string;
}

export default function CategoryForm({ token }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const handleEdit = (event: Event) => {
      const category = (event as CustomEvent).detail;
      setEditCategoryId(category.id);
      setName(category.name);
    };
    window.addEventListener('edit-category', handleEdit);
    return () => window.removeEventListener('edit-category', handleEdit);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editCategoryId) {
        await updateCategory(editCategoryId, name, token);
      } else {
        await createCategory(name, token);
      }
      setEditCategoryId(null);
      setName('');
      window.location.reload();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEditCategoryId(null);
    setName('');
    setError('');
  };

  return (
    <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label text-neutral-content font-medium">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full rounded-lg"
          required
          aria-required="true"
        />
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary flex-1 rounded-lg hover:bg-accent transition-colors duration-300"
          disabled={loading}
          aria-label={editCategoryId ? 'Update Category' : 'Create Category'}
        >
          {loading ? 'Saving...' : editCategoryId ? 'Update Category' : 'Create Category'}
        </button>
        {editCategoryId && (
          <button
            type="button"
            className="btn btn-outline btn-secondary flex-1 rounded-lg"
            onClick={handleReset}
            aria-label="Cancel Edit"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
