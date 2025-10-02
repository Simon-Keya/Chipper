'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createProduct, updateProduct } from '../lib/api';
import { Category } from '../lib/types';

interface ProductFormProps {
  categories: Category[];
  token: string;
}

export default function ProductForm({ categories, token }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  // ✅ Handle edit product event
  useEffect(() => {
    const handleEdit = (event: Event) => {
      const product = (event as CustomEvent).detail;
      setEditProductId(product.id);
      setName(product.name);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategoryId(product.categoryId.toString());
      setDescription(product.description || '');
      setImage(null);
      setPreview(product.image || null);
    };
    window.addEventListener('edit-product', handleEdit);
    return () => window.removeEventListener('edit-product', handleEdit);
  }, []);

  // ✅ Helper: convert file → base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let base64Image: string | undefined;

      // Require image if creating new product
      if (!editProductId && !image) {
        setError('Please upload an image when creating a new product.');
        setLoading(false);
        return;
      }

      if (image) {
        base64Image = await fileToBase64(image);
      }

      const productData = {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        description,
        image: base64Image, // ⛔ undefined if no update
      };

      if (editProductId) {
        await updateProduct(editProductId, productData, token);
      } else {
        await createProduct(productData, token);
      }

      handleReset();
      window.location.reload();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEditProductId(null);
    setName('');
    setPrice('');
    setStock('');
    setCategoryId('');
    setDescription('');
    setImage(null);
    setPreview(null);
    setError('');
  };

  const handleFileChange = (file: File | null) => {
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit}
      className="card bg-base-100 shadow-xl border border-base-200 p-6 rounded-2xl space-y-6 transition hover:shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">
        {editProductId ? '✏️ Edit Product' : '➕ Create Product'}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side */}
        <div className="space-y-4">
          <div>
            <label className="label font-medium">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="label font-medium">Price (Ksh)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Ksh</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input input-bordered w-full rounded-lg pl-12 focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          <div>
            <label className="label font-medium">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-primary"
              min="0"
              placeholder="Available stock"
              required
            />
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-4">
          <div>
            <label className="label font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="select select-bordered w-full rounded-lg focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full rounded-lg min-h-[100px] focus:ring-2 focus:ring-primary"
              placeholder="Write a short description..."
            />
          </div>

          <div>
            <label className="label font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full rounded-lg"
            />
            {preview && (
              <div className="mt-3">
                <Image
                  src={preview}
                  alt="Preview"
                  width={112} // Tailwind h-28
                  height={112} // Tailwind w-28
                  className="object-cover rounded-lg border"
                  unoptimized // ✅ needed for blob:// and data: URLs
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-error bg-error/10 p-2 rounded-md">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary flex-1 rounded-lg hover:btn-accent transition-all"
          disabled={loading}
        >
          {loading ? 'Saving...' : editProductId ? 'Update Product' : 'Create Product'}
        </button>
        {editProductId && (
          <button
            type="button"
            className="btn btn-outline flex-1 rounded-lg"
            onClick={handleReset}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
