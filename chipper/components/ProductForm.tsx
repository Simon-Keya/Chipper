'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createProduct, fetchCategories, updateProduct } from '../lib/api';
import { Category, Product } from '../lib/types';

interface ProductFormProps {
  onSuccess: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories + listen for edit events
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();

    const handleEdit = (event: Event) => {
      const product = (event as CustomEvent<Product>).detail;
      if (!product) {
        resetForm();
        return;
      }

      setEditProductId(product.id);
      setName(product.name || '');
      setPrice(product.price?.toString() || '');
      setStock(product.stock?.toString() || '');
      setCategoryId(product.categoryId?.toString() || '');
      setDescription(product.description || '');
      setImage(null);
      setPreview(product.imageUrl || null); // Cloudinary URL
    };

    window.addEventListener('edit-product', handleEdit);
    return () => window.removeEventListener('edit-product', handleEdit);
  }, []);

  const resetForm = () => {
    setEditProductId(null);
    setName('');
    setPrice('');
    setStock('');
    setCategoryId('');
    setDescription('');
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('categoryId', categoryId);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      if (editProductId) {
        await updateProduct(editProductId, formData, token);
      } else {
        await createProduct(formData, token);
      }
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-100 border border-base-300 shadow-xl p-8 mb-8 rounded-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-primary">
        {editProductId ? '✏️ Edit Product' : '➕ Add New Product'}
      </h2>

      {/* Name */}
      <div className="mb-5">
        <label className="block mb-2 font-medium">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="e.g. Premium T-shirt"
          required
        />
      </div>

      {/* Price & Stock in grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        <div>
          <label className="block mb-2 font-medium">Price (Ksh)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full"
            placeholder="e.g. 1500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="input input-bordered w-full"
            placeholder="e.g. 50"
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-5">
        <label className="block mb-2 font-medium">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-5">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          rows={3}
          placeholder="Write a short description..."
        />
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImage(file);
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="file-input file-input-bordered w-full"
        />
        {preview && (
          <div className="mt-4">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="object-cover rounded-xl border shadow-md"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary flex-1">
          {editProductId ? '💾 Update Product' : '🚀 Create Product'}
        </button>
        {editProductId && (
          <button
            type="button"
            className="btn btn-secondary flex-1"
            onClick={resetForm}
          >
            🔄 Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
