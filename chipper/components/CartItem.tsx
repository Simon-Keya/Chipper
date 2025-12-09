'use client';

import { Product } from '@/lib/types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: {
    id: number;
    product: Product;
    quantity: number;
  };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    onUpdateQuantity(item.id, newQuantity);
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-base-100 rounded-xl shadow-sm border border-base-200 hover:border-base-300 transition-colors">
      <div className="flex-shrink-0">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base-content truncate mb-1">{item.product.name}</h3>
        <p className="text-sm text-base-content/70 mb-3">KSh {item.product.price.toLocaleString()}</p>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="btn btn-sm btn-outline btn-square"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-base-content">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="btn btn-sm btn-outline btn-square"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <p className="font-bold text-lg text-base-content">
          KSh {subtotal.toLocaleString()}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="btn btn-sm btn-error btn-ghost"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}