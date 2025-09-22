import { Product } from "@/lib/types";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
      <figure className="p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="rounded-xl h-40 object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-primary font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="btn btn-sm btn-primary"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
