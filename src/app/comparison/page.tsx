'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ComparisonResult from '@/components/comparison/ComparisonResult';
import AIFeedback from '@/components/feedback/AIFeedback';

export default function ComparisonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [resultIds, setResultIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<any | null>(null);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [aiFeedback, setAIFeedback] = useState<any | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  
  // URLからresultIdsを取得
  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      setResultIds(ids.split(','));
    }
  }, [searchParams]);
  
  // resultIdsが変更されたら比較を実行
  useEffect(() => {
    if (resultIds.length >= 2) {
      fetchComparison();
    }
  }, [resultIds]);
  
  // 比較APIを呼び出す
  const fetchComparison = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resultIds }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '比較の取得に失敗しました');
      }
      
      const data = await response.json();
      setComparison(data.comparison);
    } catch (err) {
      setError(err instanceof Error ? err.message : '比較の取得中にエラーが発生しました');
      console.error('比較取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // AIフィードバックを取得
  const fetchAIFeedback = async (resultId: string) => {
    setIsLoadingFeedback(true);
    setFeedbackError(null);
    setSelectedUserId(resultId);
    
    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resultId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AIフィードバックの取得に失敗しました');
      }
      
      const data = await response.json();
      setAIFeedback(data.feedback);
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'AIフィードバックの取得中にエラーが発生しました');
      console.error('AIフィードバック取得エラー:', err);
    } finally {
      setIsLoadingFeedback(false);
    }
  };
  
  // AIフィードバックをリクエスト
  const handleRequestAIFeedback = (userId: string) => {
    fetchAIFeedback(userId);
  };
  
  // AIフィードバックを閉じる
  const handleCloseAIFeedback = () => {
    setAIFeedback(null);
    setSelectedUserId(null);
  };
  
  // 結果IDの選択を変更
  const handleResultIdChange = (index: number, value: string) => {
    const newResultIds = [...resultIds];
    newResultIds[index] = value;
    setResultIds(newResultIds);
    
    // URLを更新
    const newUrl = `/comparison?ids=${newResultIds.join(',')}`;
    router.push(newUrl);
  };
  
  // 結果IDを追加
  const handleAddResultId = () => {
    setResultIds([...resultIds, '']);
  };
  
  // 結果IDを削除
  const handleRemoveResultId = (index: number) => {
    const newResultIds = resultIds.filter((_, i) => i !== index);
    setResultIds(newResultIds);
    
    // URLを更新
    const newUrl = newResultIds.length > 0 ? `/comparison?ids=${newResultIds.join(',')}` : '/comparison';
    router.push(newUrl);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">診断結果の比較・分析</h1>
        <p className="text-gray-600 mb-6">
          複数の診断結果を比較して、相性分析やチーム編成の提案を行います。
          比較したい診断結果のIDを入力してください。
        </p>
        
        {/* 結果ID入力フォーム */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">比較する診断結果</h2>
          
          <div className="space-y-4">
            {resultIds.map((id, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={id}
                  onChange={(e) => handleResultIdChange(index, e.target.value)}
                  placeholder="診断結果ID"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleRemoveResultId(index)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  disabled={resultIds.length <= 2}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleAddResultId}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
            >
              結果を追加
            </button>
            
            <button
              onClick={fetchComparison}
              disabled={resultIds.length < 2 || resultIds.some(id => !id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              比較を実行
            </button>
          </div>
        </div>
        
        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-700">比較データを取得中...</span>
          </div>
        )}
        
        {/* 比較結果表示 */}
        {!isLoading && comparison && (
          <div className="mb-8">
            <ComparisonResult
              comparison={comparison}
              onRequestAIFeedback={handleRequestAIFeedback}
            />
          </div>
        )}
        
        {/* AIフィードバック表示 */}
        {selectedUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">AIパーソナルフィードバック</h3>
                <button
                  onClick={handleCloseAIFeedback}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {feedbackError ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{feedbackError}</p>
                  </div>
                ) : (
                  <AIFeedback
                    feedback={aiFeedback || {
                      type: '',
                      resultId: '',
                      generatedAt: new Date().toISOString(),
                      content: '',
                      sections: {},
                    }}
                    isLoading={isLoadingFeedback}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 説明セクション */}
        {!comparison && !isLoading && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">診断結果の比較について</h2>
            <p className="text-gray-700 mb-4">
              この機能では、複数の診断結果を比較して、相性分析やチーム編成の提案を行います。
              以下のような情報が得られます：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>診断結果の概要比較</li>
              <li>相性スコアとコメント</li>
              <li>相性マトリックス（3人以上の場合）</li>
              <li>チーム編成の提案</li>
              <li>AIによるパーソナライズされたフィードバック</li>
            </ul>
            <p className="text-gray-700">
              比較したい診断結果のIDを入力して「比較を実行」ボタンをクリックしてください。
              診断結果IDは、診断結果の共有URLの末尾の部分です。
              例：https://example.com/fortune/share/<strong>abc123</strong> の場合、IDは <strong>abc123</strong> です。
            </p>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <Link
          href="/fortune"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
          </svg>
          占い・診断テストに戻る
        </Link>
      </div>
    </div>
  );
}