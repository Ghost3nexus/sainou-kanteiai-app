'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 結果の型定義
type SavedResult = {
  id: string;
  type: string;
  createdAt: string;
};

// 占いの種類の表示名
const typeNames: Record<string, string> = {
  'numerology': '数秘術',
  'fourPillars': '四柱推命',
  'sanmei': '算命学',
  'mbti': 'MBTI',
  'animalFortune': '動物占い',
};

export default function MyPage() {
  const [results, setResults] = useState<SavedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  
  // ユーザーIDの取得（実際のアプリではログイン情報から取得）
  useEffect(() => {
    // ローカルストレージからユーザーIDを取得
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // ユーザーIDがない場合は新規作成
      const newUserId = `user_${Date.now()}`;
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);
  
  // 結果の取得
  useEffect(() => {
    if (!userId) return;
    
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/fortune/save?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('結果の取得に失敗しました');
        }
        
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('エラー:', error);
        setError('結果の取得中にエラーが発生しました。後でもう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [userId]);
  
  // 結果の削除
  const handleDeleteResult = async (id: string) => {
    if (!confirm('この結果を削除してもよろしいですか？')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/fortune/save/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('結果の削除に失敗しました');
      }
      
      // 削除成功後、結果リストを更新
      setResults(results.filter(result => result.id !== id));
    } catch (error) {
      console.error('エラー:', error);
      alert('結果の削除中にエラーが発生しました。後でもう一度お試しください。');
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            才能診断マイページ
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            保存した才能診断・占いの結果を確認できます。
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">結果を読み込んでいます...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-700 text-center">
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              保存された結果はありません
            </h2>
            <p className="text-gray-600 mb-6">
              才能診断を実施して、結果を保存してみましょう。
            </p>
            <Link
              href="/fortune"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              才能診断を試す
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-medium text-white">
                保存した才能診断結果一覧
              </h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {results.map((result) => {
                const formattedDate = new Date(result.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                
                return (
                  <li key={result.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-indigo-600">
                          {typeNames[result.type] || '占い'}の結果
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formattedDate}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          href={`/fortune/share/${result.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          詳細を見る
                        </Link>
                        <button
                          onClick={() => handleDeleteResult(result.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            
            <div className="bg-gray-50 px-6 py-4 text-right">
              <Link
                href="/fortune"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                新しい才能診断を試す
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-16 bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-lg font-medium text-white">
              ユーザー情報
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">ユーザーID</h3>
              <p className="mt-1 text-gray-600">{userId || '読み込み中...'}</p>
              <p className="mt-2 text-sm text-gray-500">
                このIDは、あなたの才能診断の結果を識別するために使用されます。
                ブラウザのローカルストレージに保存されています。
              </p>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => {
                  if (confirm('ユーザーIDをリセットすると、保存した結果にアクセスできなくなります。よろしいですか？')) {
                    localStorage.removeItem('userId');
                    setUserId(null);
                    setResults([]);
                    router.refresh();
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ユーザーIDをリセット
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}