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
      handleReset();
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
    <div className="card bg-base-100 shadow-lg p-6 rounded-2xl border border-base-200">
      <h2 className="text-xl font-semibold mb-4">
        {editCategoryId ? 'Edit Category' : 'Create Category'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <label className="label font-medium">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter category name"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-error text-sm">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading}
          >
            {loading ? 'Saving...' : editCategoryId ? 'Update Category' : 'Create Category'}
          </button>
          {editCategoryId && (
            <button
              type="button"
              className="btn btn-outline flex-1"
              onClick={handleReset}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

