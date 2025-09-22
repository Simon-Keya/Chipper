'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductsAdminServer from './ProductAdminServer';

export default function ProductsAdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  if (!token) return null;

  return <ProductsAdminServer token={token} />;
}