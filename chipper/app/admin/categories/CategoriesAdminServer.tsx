import { Metadata } from 'next';
import CategoryForm from '../../../components/CategoryForm';
import { fetchCategories } from '../../../lib/api';
import { Category } from '../../../lib/types';

export const metadata: Metadata = {
  metadataBase: new URL('https://chipper-store.com'),
  title: 'Manage Categories - Chipper Admin',
  description: 'Create, edit, and manage categories for the Chipper e-commerce platform.',
};

export default async function CategoriesAdminServer({ token }: { token: string }) {
  const categories: Category[] = await fetchCategories();

  return (
    <div className="container mx-auto px-4 py-12 bg-base-100">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-content">Manage Categories</h1>
      <div className="card bg-base-200 shadow-lg p-6 mb-12 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-neutral-content">Add/Edit Category</h2>
        <CategoryForm token={token} />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-neutral-content">Category List</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-neutral rounded-xl">
          <thead>
            <tr>
              <th className="text-neutral-content">ID</th>
              <th className="text-neutral-content">Name</th>
              <th className="text-neutral-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm rounded-full mr-2 hover:bg-accent transition-colors duration-300"
                    onClick={() => {
                      document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth' });
                      window.dispatchEvent(
                        new CustomEvent('edit-category', { detail: category })
                      );
                    }}
                    aria-label={`Edit category ${category.name}`}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm rounded-full"
                    onClick={async () => {
                      if (confirm(`Delete ${category.name}?`)) {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        window.location.reload();
                      }
                    }}
                    aria-label={`Delete category ${category.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {categories.length === 0 && (
        <p className="text-neutral-content text-lg mt-6 text-center">No categories found.</p>
      )}
    </div>
  );
}