import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  title: 'データ分析 | 才能鑑定AI',
  description: '診断結果の統計データと分析情報',
};

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              データ分析
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              診断結果の統計データと分析情報を表示します。
            </p>
          </div>

          <AnalyticsDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}