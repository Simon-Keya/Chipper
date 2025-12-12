'use client';

import { AlertTriangle, ListChecks, Loader2, PenTool, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import CategoryForm from "../../../components/CategoryForm";
import { Category } from "../../../lib/types";

async function fetcher(url: string, method: string = 'GET', token: string, body?: unknown) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`API call failed: ${res.status}`);
  return method !== 'DELETE' ? res.json() : null;
}

export default function CategoriesAdminServer({ token }: { token: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetcher("/api/categories", 'GET', token);
      setCategories(data || []);
    } catch {
      // Silently handle error — we show loading state instead
      setCategories([]);
    }
  }, [token]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await loadCategories();
    setLoading(false);
  }, [loadCategories]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleEdit = (cat: Category) => {
    setEditCategory(cat);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('category-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const initiateDelete = (cat: Category) => setCategoryToDelete(cat);

  const executeDelete = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      await fetcher(`/api/categories/${categoryToDelete.id}`, 'DELETE', token);
      setCategoryToDelete(null);
      await loadCategories();
    } catch {
      // Swallow error — user sees no change, but operation failed silently
      console.warn('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const DeleteModal = () => categoryToDelete && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-2xl p-8 max-w-md w-full border border-error shadow-2xl">
        <h3 className="text-2xl font-bold text-error mb-4 flex items-center gap-2">
          <AlertTriangle /> Delete Category?
        </h3>
        <p className="mb-6 text-base-content">
          Are you sure you want to delete <strong>{categoryToDelete.name}</strong>? 
          This will not delete products, but they will lose their category.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => setCategoryToDelete(null)} 
            className="btn btn-ghost flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={executeDelete} 
            className="btn btn-error flex-1" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-base-100">
      <DeleteModal />

      <header className="mb-10 border-b pb-6 border-base-200">
        <h1 className="text-5xl font-black text-warning flex items-center gap-4">
          <ListChecks size={50} /> Manage Categories
        </h1>
        <p className="mt-3 text-xl text-base-content/70">
          Organize your store with beautiful category images and names.
        </p>
      </header>

      <div id="category-form-section" className="mb-12">
        <div className="card bg-gradient-to-r from-warning/10 to-orange-500/10 border-l-4 border-warning p-8 rounded-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <PenTool className="text-warning" /> Category Editor
            </h2>
            <button
              onClick={() => {
                setEditCategory(null);
                setShowForm(!showForm);
              }}
              className={`btn btn-lg ${showForm ? 'btn-neutral' : 'btn-warning'} rounded-2xl`}
            >
              {showForm ? <X size={24} /> : <Plus size={24} />}
              {showForm ? 'Close' : 'New Category'}
            </button>
          </div>

          {showForm && (
            <div className="mt-8">
              <CategoryForm
                token={token}
                category={editCategory || undefined}
                onSuccess={() => {
                  refreshData();
                  setShowForm(false);
                  setEditCategory(null);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">All Categories ({categories.length})</h2>
        <button onClick={refreshData} className="btn btn-ghost" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-3xl"></div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-base-200 border-2 border-dashed rounded-3xl w-32 h-32 mx-auto mb-6" />
          <p className="text-2xl text-base-content/60">No categories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="group relative bg-base-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48">
                <Image
                  src={cat.imageUrl || "/placeholder-category.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="p-6 text-center relative">
                <h3 className="font-bold text-2xl text-base-content mb-6">{cat.name}</h3>
                <div className="flex gap-3 justify-center opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(cat);
                    }}
                    className="btn btn-outline btn-warning btn-sm rounded-full"
                  >
                    <PenTool size={16} /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      initiateDelete(cat);
                    }}
                    className="btn btn-error btn-sm rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}