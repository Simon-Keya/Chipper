import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chipper - Cart',
  description: 'Review your shopping cart and proceed to checkout',
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      {children}
    </div>
  );
}