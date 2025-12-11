import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  type: 'cart' | 'search' | 'wishlist' | 'orders' | 'profile';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  type = 'cart',
  title = 'Empty',
  description = 'Nothing here yet.',
  actionText = 'Go Shopping',
  actionHref = '/products',
  icon,
}: EmptyStateProps) {
  const icons = {
    cart: <ShoppingBag className="w-16 h-16" />,
    search: <Search className="w-16 h-16" />,
    wishlist: <Heart className="w-16 h-16" />,
    orders: <ShoppingBag className="w-16 h-16" />,
    profile: <User className="w-16 h-16" />,
  };

  return (
    <div className="text-center py-16 space-y-4 max-w-md mx-auto">
      <div className="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
        {icon || icons[type]}
      </div>
      <h3 className="text-2xl font-bold text-base-content">{title}</h3>
      <p className="text-base-content/60 mb-6">{description}</p>
      <Link href={actionHref}>
        <button className="btn btn-primary">{actionText}</button>
      </Link>
    </div>
  );
}