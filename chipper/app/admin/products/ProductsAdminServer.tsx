'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react'; // Added useCallback
// Import Lucide Icons for better UI/UX
import { AlertTriangle, ListChecks, Loader2, PenTool, Plus, RefreshCw, Trash2, X } from 'lucide-react';

import ProductForm from '../../../components/ProductForm';
import { deleteProduct, fetchCategories, fetchProducts } from '../../../lib/api';
import { Category, Product } from '../../../lib/types';

interface ProductsAdminServerProps {
  token: string;
}

// Component for the Product Administration Page
export default function ProductsAdminServer({ token }: ProductsAdminServerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  // State for managing the delete confirmation dialog
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // --- Data Fetching Logic (wrapped in useCallback to satisfy exhaustive-deps) ---

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      return data; // Return data for Promise.all
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not load products. Please check your connection.');
      return [];
    }
  }, [setError, setProducts]); // Dependencies are state setters

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [setCategories]); // Dependency is state setter

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([loadProducts(), loadCategories()]);
    setLoading(false);
  }, [loadProducts, loadCategories, setError, setLoading]); // Dependencies are the stable functions and state setters

  useEffect(() => {
    refreshData();
  }, [refreshData]); // refreshData is now stable, resolving the warning

  // --- Action Handlers ---

  // Initiates the deletion process by setting the product to be confirmed
  const initiateDelete = (product: Product) => {
    setProductToDelete(product);
  };

  // Executes the actual deletion
  const executeDelete = async () => {
    if (!productToDelete) return;
    
    setLoading(true); // Show loading state during deletion
    try {
      await deleteProduct(productToDelete.id, token);
      setProductToDelete(null); // Close the confirmation modal
      // Reload products after successful deletion
      await loadProducts(); 
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setShowForm(true);
    // Use setTimeout to ensure the form has rendered before scrolling
    setTimeout(() => {
      document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
      // Dispatch event to populate the ProductForm
      const event = new CustomEvent('edit-product', { detail: product });
      window.dispatchEvent(event);
    }, 50);
  };
  
  // --- Components for UI structure ---

  // Custom component replacing the browser's confirm() dialog
  const DeleteConfirmationModal = () => {
    if (!productToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-base-100 p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-error">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-error" />
            <h3 className="text-xl font-bold text-error">Confirm Deletion</h3>
          </div>
          <p className="mb-6 text-neutral-content">
            {/* FIX: Escaped apostrophes with &apos; to resolve ESLint error */}
            Are you absolutely sure you want to permanently delete &apos;{productToDelete.name}&apos;? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setProductToDelete(null)}
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

  // Product Card component (refactored for sleekness)
  const ProductCard = ({ product }: { product: Product }) => {
    const categoryName = categories.find((c) => c.id === product.categoryId)?.name || 'N/A';
    const isLowStock = product.stock < 10;
    
    return (
        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition duration-300 rounded-2xl border border-base-300 overflow-hidden">
            {product.imageUrl && (
                <div className="relative w-full h-48">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized // Assuming you are using an optimized image service elsewhere
                    />
                </div>
            )}
            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-neutral-content line-clamp-1">{product.name}</h3>
                    <span className="badge badge-lg badge-outline text-warning border-warning font-semibold">
                      {categoryName}
                    </span>
                </div>
                <p className="text-sm text-neutral-content/70 line-clamp-2 mb-3 h-10">{product.description}</p>
                
                <div className="flex items-center justify-between border-t border-base-300 pt-3">
                    <div className="flex flex-col">
                        <p className="font-extrabold text-2xl text-success">Ksh. {product.price.toFixed(2)}</p>
                        <p className={`text-sm font-medium ${isLowStock ? 'text-error' : 'text-neutral-content/80'}`}>
                            Stock: {product.stock} {isLowStock ? '(Low)' : ''}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(product)}
                            className="btn btn-sm btn-outline btn-warning rounded-full px-4"
                        >
                            <PenTool size={16} /> Edit
                        </button>
                        <button
                            onClick={() => initiateDelete(product)}
                            className="btn btn-sm btn-error rounded-full"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  // --- Main Render ---

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen bg-base-100">
      
      {/* Show Confirmation Modal if productToDelete is set */}
      <DeleteConfirmationModal />

      {/* Header */}
      <header className="mb-10 border-b pb-4 border-base-200">
        <h1 className="text-4xl md:text-5xl font-black text-warning flex items-center gap-3">
          <ListChecks size={50} className="text-warning" /> Manage Products
        </h1>
        <p className="mt-2 text-neutral-content/80 text-lg">
            Create, update, and monitor your entire product inventory.
        </p>
      </header>

      {/* Product Form Toggle Section */}
      <div id="product-form" className="mb-12">
        <div className="flex items-center justify-between card bg-base-200 shadow-xl p-6 rounded-2xl border-l-4 border-warning">
          <h2 className="text-2xl font-bold text-neutral-content flex items-center gap-2">
            <PenTool size={24} className="text-warning" /> 
            Product Editor
          </h2>
          
          <button
            className={`btn btn-lg rounded-xl ${showForm ? 'btn-neutral' : 'btn-warning text-white'}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={20} /> : <Plus size={20} />} 
            {showForm ? 'Close Editor' : 'Add New Product'}
          </button>
        </div>
        
        {/* Render ProductForm if showForm is true */}
        {showForm && (
            <div className="mt-6 p-6 bg-base-200 rounded-2xl shadow-xl">
                <ProductForm onSuccess={loadProducts} />
            </div>
        )}
      </div>

      {/* Product List Header */}
      <div className="flex items-center justify-between mb-6 border-b pb-2 border-base-200">
        <h2 className="text-3xl font-bold text-neutral-content">
          Current Inventory ({products.length})
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

      {/* Product List Content */}
      {error ? (
        <div className="alert alert-error shadow-lg rounded-xl">
            <AlertTriangle size={20} />
            <div>
                <h3 className="font-bold">Error Loading Data</h3>
                <div className="text-xs">{error}</div>
            </div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-base-200 rounded-2xl border border-dashed border-base-300 mt-6">
          <p className="text-neutral-content text-lg mb-4">
            {/* FIX: Escaped apostrophes with &apos; to resolve ESLint error */}
            No products found in the catalog. Click &apos;Add New Product&apos; to begin.
          </p>
        </div>
      )}
    </div>
  );
}
