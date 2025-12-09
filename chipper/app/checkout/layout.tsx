import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chipper - Checkout',
  description: 'Complete your purchase securely',
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Progress Steps */}
      <div className="bg-base-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-content">1</span>
              </div>
              <span className="text-sm font-medium text-base-content">Shipping</span>
            </div>
            <div className="flex-1 h-px bg-base-300 mx-4"></div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-base-300 rounded-full flex items-center justify-center border border-base-content/20">
                <span className="text-xs text-base-content/50">2</span>
              </div>
              <span className="text-sm text-base-content/50">Payment</span>
            </div>
            <div className="flex-1 h-px bg-base-300 mx-4"></div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-base-300 rounded-full flex items-center justify-center border border-base-content/20">
                <span className="text-xs text-base-content/50">3</span>
              </div>
              <span className="text-sm text-base-content/50">Review</span>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}