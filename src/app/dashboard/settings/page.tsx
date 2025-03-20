'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApiKeySettings from '@/components/settings/ApiKeySettings';
import CompanySettings from '@/components/settings/CompanySettings';
import { fetchApiKeySettings, saveApiKeySettings } from '@/lib/api';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'company' | 'api'>('company');

  // APIキー設定を取得
  useEffect(() => {
    const loadApiKeySettings = async () => {
      try {
        const settings = await fetchApiKeySettings();
        setApiKey(settings.openai || '');
      } catch (err) {
        console.error('APIキー設定取得エラー:', err);
        setError('APIキー設定の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKeySettings();
  }, []);

  // APIキーを保存
  const handleSaveApiKey = async (newApiKey: string) => {
    try {
      await saveApiKeySettings(newApiKey);
      setApiKey(newApiKey);
      return Promise.resolve();
    } catch (err) {
      console.error('APIキー保存エラー:', err);
      return Promise.reject(new Error('APIキーの保存に失敗しました'));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                設定
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                アプリケーションの設定を管理します
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              ダッシュボードに戻る
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* タブナビゲーション */}
        <div className="mb-8">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'company'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              会社設定
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'api'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              APIキー設定
            </button>
          </nav>
        </div>

        {isLoading ? (
          <div className="bg-white shadow rounded-lg p-6 mb-8 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-700">設定を読み込み中...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {activeTab === 'company' ? (
              <CompanySettings />
            ) : (
              <ApiKeySettings
                initialApiKey={apiKey}
                onSave={handleSaveApiKey}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}