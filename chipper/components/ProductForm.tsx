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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      setIsLoading(false);
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
      setIsLoading(false); // Ensure loading state is reset on error
    }
  };

  const inputClass = "input input-bordered w-full input-lg transition duration-150 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:shadow-md rounded-xl";
  const labelClass = "block mb-2 font-semibold text-neutral-content/90 text-sm";

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-base-200"
      >
        {/* Form Header */}
        <h2 className="text-3xl font-extrabold mb-8 text-neutral-content border-b pb-4 border-base-200">
          {editProductId ? '✏️ Edit Product Details' : '➕ Add New Product Listing'}
        </h2>
        
        {/* Grid Container for two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Column 1: Core Details */}
            <div className='lg:col-span-1'>
                
                {/* Name */}
                <div className="mb-6">
                  <label className={labelClass}>Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Premium Cotton T-shirt"
                    required
                  />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={labelClass}>Price (Ksh)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 1500"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stock Quantity</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 50"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className={labelClass}>Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`select select-bordered w-full select-lg transition duration-150 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:shadow-md rounded-xl`}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
            </div>

            {/* Column 2: Description and Image */}
            <div className='lg:col-span-1'>
                {/* Description */}
                <div className="mb-6">
                  <label className={labelClass}>Detailed Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`textarea textarea-bordered w-full transition duration-150 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:shadow-md rounded-xl h-36 resize-none`}
                    rows={4}
                    placeholder="Write a detailed product description..."
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className={labelClass}>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImage(file);
                      setPreview(file ? URL.createObjectURL(file) : null);
                    }}
                    // Using neutral/base colors for file input for a cleaner look
                    className="file-input file-input-bordered w-full file-input-md rounded-xl"
                  />
                </div>
            </div>
        </div>

        {/* Image Preview - Full width below the main grid */}
        {preview && (
          <div className="mt-4 mb-8 border-t border-base-200 pt-6">
            <h3 className="font-semibold text-lg mb-4 text-neutral-content">Current Image Preview</h3>
            <div className="relative w-48 h-48 border-4 border-base-300 rounded-xl overflow-hidden shadow-xl">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-base-200">
          <button
            type="submit"
            className="btn btn-warning btn-lg flex-1 text-white shadow-xl hover:bg-amber-600 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
                <span className="loading loading-spinner"></span>
            ) : (
                editProductId ? '💾 Update Product' : '🚀 Create Product'
            )}
          </button>
          {editProductId && (
            <button
              type="button"
              className="btn btn-outline btn-neutral btn-lg flex-1 hover:bg-base-200"
              onClick={resetForm}
              disabled={isLoading}
            >
              🔄 Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
