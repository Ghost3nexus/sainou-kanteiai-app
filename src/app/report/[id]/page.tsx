import ReportViewer from '@/components/report/ReportViewer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface ReportPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: '診断レポート | 才能鑑定AI',
  description: '診断結果の詳細レポートを表示・ダウンロードできます。',
};

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              診断レポート
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              AIが分析した詳細なレポートを確認できます。PDFでのダウンロードも可能です。
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <ReportViewer resultId={params.id} />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ※ レポートの内容は参考情報として提供されています。
              重要な意思決定の際は、必ず他の情報源も参考にしてください。
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}