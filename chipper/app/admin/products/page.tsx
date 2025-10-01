import ProductsAdminClient from "./ProductsAdminClient";

export default function ProductsAdminPage() {
  // This remains a server component — no 'use client'
  return <ProductsAdminClient />;
}
