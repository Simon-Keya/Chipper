'use client';

import React, { useCallback, useEffect, useState } from "react";
// Imports for UI/UX consistency with productsAdminServer.tsx
import { AlertTriangle, ListChecks, Loader2, PenTool, Plus, RefreshCw, Trash2, X } from 'lucide-react';

import CategoryForm from "../../../components/CategoryForm";
import { Category } from "../../../lib/types";

// ---------------------------------------------
// FIX: TS2322 Workaround 
// Define expected props for CategoryForm to resolve TypeScript error (2) 
// by ensuring the component is typed to accept 'onSuccess'.
interface CategoryFormProps {
    token: string;
    category: Category | undefined;
    onSuccess: () => void;
}
// Create a typed alias for the imported component
const TypedCategoryForm = CategoryForm as React.FC<CategoryFormProps>;
// ---------------------------------------------


// Helper function to handle internal API calls and error handling
// FIX: Replaced 'any' with 'unknown' to address ESLint error (1)
async function fetcher(url: string, method: string = 'GET', token: string, body?: unknown) {
    // Construct the full URL using the environment variable
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: body ? JSON.stringify(body) : undefined,
        }
    );

    if (!res.ok) {
        throw new Error(`API call failed: ${res.status} ${res.statusText}`);
    }

    // Only attempt to parse JSON for non-DELETE methods that expect content
    if (method !== 'DELETE') {
        return res.json();
    }
}


export default function CategoriesAdminServer({ token }: { token: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  // State for managing the delete confirmation dialog
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // --- Data Fetching Logic (wrapped in useCallback for stability) ---

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetcher("/api/categories", 'GET', token);
      setCategories(data || []);
      return data || [];
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      // Consistent error message with product admin
      setError("Could not load categories. Please check your connection."); 
      return [];
    }
  }, [token]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    await loadCategories();
    setLoading(false);
  }, [loadCategories]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle "edit-category" event to open form with prefilled data
  useEffect(() => {
    function handleEdit(e: CustomEvent) {
      const category = e.detail as Category;
      setEditCategory(category);
      setShowForm(true);
      // Scroll to form after opening
      setTimeout(() => {
        document.getElementById('category-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
    // Updated event listener to handle the custom event dispatched in this file
    window.addEventListener("edit-category-internal", handleEdit as EventListener);
    return () => {
      window.removeEventListener("edit-category-internal", handleEdit as EventListener);
    };
  }, []);
  
  // --- Action Handlers ---

  const initiateDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  // Executes the actual deletion, replacing window.confirm and reload
  const executeDelete = async () => {
    if (!categoryToDelete) return;
    
    setLoading(true); 
    try {
      await fetcher(`/api/categories/${categoryToDelete.id}`, 'DELETE', token);
      setCategoryToDelete(null); // Close the confirmation modal
      await loadCategories(); // Reload data instead of page refresh
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditCategory(category);
    setShowForm(true);
    setTimeout(() => {
        document.getElementById('category-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };
  
  // --- Components for UI structure ---

  // Custom component replacing the browser's confirm() dialog
  const DeleteConfirmationModal = () => {
    if (!categoryToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-base-100 p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-error">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-error" />
            <h3 className="text-xl font-bold text-error">Confirm Deletion</h3>
          </div>
          <p className="mb-6 text-base-content">
            {/* Using &apos; for consistency and to avoid react/no-unescaped-entities */}
            Are you absolutely sure you want to permanently delete the category &apos;{categoryToDelete.name}&apos;? This action cannot be undone and will affect associated products.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setCategoryToDelete(null)}
              className="btn btn-neutral flex-1 rounded-xl"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={executeDelete}
              className="btn btn-error flex-1 rounded-xl"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen bg-base-100">
      
      {/* Show Confirmation Modal */}
      <DeleteConfirmationModal />

      {/* Header (Matching Product Admin Style) */}
      <header className="mb-10 border-b pb-4 border-base-200">
        <h1 className="text-4xl md:text-5xl font-black text-warning flex items-center gap-3">
          <ListChecks size={50} className="text-warning" /> Manage Categories
        </h1>
        <p className="mt-2 text-neutral-content/80 text-lg">
            Create, update, and manage the categorization structure for your products.
        </p>
      </header>

      {/* Category Form Toggle Section (Matching Product Admin Style) */}
      <div id="category-form-section" className="mb-12">
        <div className="flex items-center justify-between card bg-base-200 shadow-xl p-6 rounded-2xl border-l-4 border-warning">
          <h2 className="text-2xl font-bold text-neutral-content flex items-center gap-2">
            <PenTool size={24} className="text-warning" /> 
            Category Editor
          </h2>
          
          <button
            className={`btn btn-lg rounded-xl ${showForm ? 'btn-neutral' : 'btn-warning text-white'}`}
            onClick={() => {
                setEditCategory(null); // Clear edit state when toggling
                setShowForm(!showForm);
            }}
          >
            {showForm ? <X size={20} /> : <Plus size={20} />} 
            {showForm ? 'Close Editor' : 'Add New Category'}
          </button>
        </div>
        
        {/* Render CategoryForm if showForm is true */}
        {showForm && (
            <div id="category-form" className="mt-6 p-6 bg-base-200 rounded-2xl shadow-xl">
                {/* FIX: Use TypedCategoryForm alias to resolve TS2322 */}
                <TypedCategoryForm 
                    token={token} 
                    category={editCategory || undefined}
                    onSuccess={() => {
                        // After success (add/edit), refresh data and hide form
                        refreshData();
                        setShowForm(false);
                    }} 
                />
            </div>
        )}
      </div>

      {/* Category List Header (Matching Product Admin Style) */}
      <div className="flex items-center justify-between mb-6 border-b pb-2 border-base-200">
        <h2 className="text-3xl font-bold text-neutral-content">
          Current Categories ({categories.length})
        </h2>
        <button 
            onClick={refreshData} 
            className="btn btn-ghost text-warning"
            disabled={loading}
        >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
            {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Category List Content */}
      {loading ? (
        <div className="text-center py-10 bg-base-200 rounded-2xl border border-dashed border-base-300 mt-6">
            <Loader2 className="animate-spin mx-auto text-warning mb-4" size={32} />
            <p className="text-neutral-content text-lg">Loading Categories...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error shadow-lg rounded-xl">
            <AlertTriangle size={20} />
            <div>
                <h3 className="font-bold">Error Loading Data</h3>
                <div className="text-xs">{error}</div>
            </div>
        </div>
      ) : categories.length > 0 ? (
        <div className="overflow-x-auto bg-base-200 rounded-2xl shadow-lg border border-base-300">
          {/* REMOVED conflicting text color from table definition */}
          <table className="table w-full"> 
            <thead>
              <tr className="bg-base-300/80">
                {/* REMOVED text-neutral-content to use default dark text color */}
                <th className="font-bold text-base-content text-lg">ID</th>
                <th className="font-bold text-base-content text-lg">Name</th>
                <th className="font-bold text-base-content text-lg text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-base-300 transition duration-150">
                  {/* SET explicit text-base-content for contrast */}
                  <td className="font-mono text-base-content text-xs py-4">{category.id}</td>
                  <td className="font-medium text-base-content text-lg py-4">{category.name}</td>
                  <td className="flex gap-2 justify-center py-4">
                    <button
                      className="btn btn-sm btn-outline btn-warning rounded-full px-4"
                      onClick={() => handleEditClick(category)}
                    >
                      <PenTool size={16} /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error rounded-full"
                      onClick={() => initiateDelete(category)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-base-200 rounded-2xl border border-dashed border-base-300 mt-6">
          <p className="text-neutral-content text-lg mb-4">
            No categories found. Click &apos;Add New Category&apos; above to create one.
          </p>
        </div>
      )}
    </div>
  );
}
