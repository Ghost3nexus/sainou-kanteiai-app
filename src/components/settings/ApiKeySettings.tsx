'use client';

import { useState, useEffect } from 'react';

type ApiKeySettingsProps = {
  initialApiKey?: string;
  onSave: (apiKey: string) => Promise<void>;
};

export default function ApiKeySettings({ initialApiKey = '', onSave }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 初期値が変更された場合に状態を更新
  useEffect(() => {
    setApiKey(initialApiKey);
  }, [initialApiKey]);

  // APIキーを保存
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onSave(apiKey);
      setSuccessMessage('APIキーが正常に保存されました');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'APIキーの保存中にエラーが発生しました');
      console.error('APIキー保存エラー:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 編集をキャンセル
  const handleCancel = () => {
    setApiKey(initialApiKey);
    setIsEditing(false);
    setError(null);
  };

  // APIキーを表示用にマスク
  const getMaskedApiKey = (key: string) => {
    if (!key) return '未設定';
    if (key.length <= 8) return '********';
    return `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">APIキー設定</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI APIキー
          </label>
          
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500">
                OpenAI APIキーは<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">OpenAIのダッシュボード</a>から取得できます。
              </p>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 w-full">
                {getMaskedApiKey(apiKey)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSaving}
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {apiKey ? '変更' : '設定'}
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">APIキーについて</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>APIキーは、AIフィードバックや比較分析機能を使用するために必要です。</li>
          <li>APIキーは安全に保存され、OpenAI APIの呼び出しにのみ使用されます。</li>
          <li>APIキーの使用には、OpenAIの利用規約が適用されます。</li>
          <li>APIの使用量に応じて料金が発生する場合があります。詳細は<a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">OpenAIの料金ページ</a>をご確認ください。</li>
        </ul>
      </div>
    </div>
  );
}