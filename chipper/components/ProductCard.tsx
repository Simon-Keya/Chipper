import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all rounded-2xl overflow-hidden">
      {/* Product Image */}
      <figure className="relative w-full h-48">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </figure>

      {/* Product Info */}
      <div className="card-body p-4 flex flex-col justify-between">
        <div>
          <h2 className="card-title text-lg font-semibold line-clamp-1">
            {product.name}
          </h2>
          <p className="text-sm text-neutral-content line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-primary font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="btn btn-sm btn-primary rounded-full hover:btn-accent transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
