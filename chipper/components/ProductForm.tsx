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

  // Load categories
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
      className="card bg-base-200 p-6 shadow-md mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        {editProductId ? 'Edit Product' : 'Add Product'}
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block mb-1">Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Stock */}
      <div className="mb-4">
        <label className="block mb-1">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
        />
      </div>

      {/* Image */}
      <div className="mb-4">
        <label className="block mb-1">Image</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImage(file);
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="file-input file-input-bordered w-full"
        />
        {preview && (
          <div className="mt-2">
            <Image
              src={preview}
              alt="Preview"
              width={128}
              height={128}
              className="object-cover rounded"
              unoptimized
            />
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        {editProductId ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
