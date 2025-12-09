import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chipper - Authentication',
  description: 'Login or register to start shopping with Chipper',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8">
        {children}
      </div>
    </div>
  );
}