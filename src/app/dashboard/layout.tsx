import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}