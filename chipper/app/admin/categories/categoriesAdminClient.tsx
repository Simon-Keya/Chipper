"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategoriesAdminServer from "./CategoriesAdminServer";

export default function CategoriesAdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  if (!token) return null;

  return <CategoriesAdminServer token={token} />;
}
