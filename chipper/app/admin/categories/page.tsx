// app/admin/categories/page.tsx
import CategoriesAdminClient from "./categoriesAdminClient";

export default function CategoriesAdminPage() {
  // This file stays server-side (no 'use client')
  return <CategoriesAdminClient />;
}
