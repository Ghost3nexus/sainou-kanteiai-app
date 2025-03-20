'use client';

import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFReport } from './PDFReport';

interface ReportViewerProps {
  resultId: string;
}

export default function ReportViewer({ resultId }: ReportViewerProps) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resultId }),
      });

      if (!response.ok) {
        throw new Error('レポートの生成に失敗しました');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'レポートの生成に失敗しました');
      }

      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!report && !loading && (
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          レポートを生成
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {report && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="prose max-w-none">
              {report.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <PDFDownloadLink
              document={<PDFReport content={report} />}
              fileName="診断レポート.pdf"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {({ loading }) =>
                loading ? 'PDFを準備中...' : 'PDFをダウンロード'
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
}