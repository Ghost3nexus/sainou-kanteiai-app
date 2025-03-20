'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfoFormProps {
  fortuneResult?: {
    type: string;
    result: any;
  };
}

export default function UserInfoForm({ fortuneResult }: UserInfoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    gender: '',
    occupation: '',
    interests: '',
    goals: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 診断結果から推奨される職業や興味を取得
  const getSuggestedOccupations = () => {
    if (!fortuneResult) return [];
    
    switch (fortuneResult.type) {
      case 'mbti':
        return fortuneResult.result.careerSuggestions || [];
      case 'animalFortune':
        return ['リーダー', 'マネージャー', 'コンサルタント'];
      case 'numerology':
        return ['起業家', '研究者', 'クリエイター'];
      case 'fourPillars':
        return fortuneResult.result.strengths || [];
      case 'sanmei':
        return [fortuneResult.result.lifeDirection || ''];
      default:
        return [];
    }
  };

  const getSuggestedInterests = () => {
    if (!fortuneResult) return [];
    
    switch (fortuneResult.type) {
      case 'mbti':
        return fortuneResult.result.strengths || [];
      case 'animalFortune':
        return fortuneResult.result.characteristics || [];
      case 'numerology':
        return ['数学', '科学', '芸術'];
      case 'fourPillars':
        return fortuneResult.result.characteristics || [];
      case 'sanmei':
        return fortuneResult.result.characteristics || [];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fortuneResult
        }),
      });

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      const data = await response.json();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 診断結果からの推奨項目を表示
  const suggestedOccupations = getSuggestedOccupations();
  const suggestedInterests = getSuggestedInterests();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          名前
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
          生年月日
        </label>
        <input
          type="date"
          name="birthdate"
          id="birthdate"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.birthdate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          性別
        </label>
        <select
          name="gender"
          id="gender"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
          職業
        </label>
        <input
          type="text"
          name="occupation"
          id="occupation"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.occupation}
          onChange={handleChange}
        />
        {suggestedOccupations.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">推奨される職業:</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {suggestedOccupations.map((occupation, index) => (
                <button
                  key={index}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setFormData(prev => ({ ...prev, occupation }))}
                >
                  {occupation}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
          興味・関心
        </label>
        <textarea
          name="interests"
          id="interests"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.interests}
          onChange={handleChange}
        />
        {suggestedInterests.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">あなたの特徴に基づく興味・関心:</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {suggestedInterests.map((interest, index) => (
                <button
                  key={index}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    interests: prev.interests ? `${prev.interests}, ${interest}` : interest
                  }))}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
          目標
        </label>
        <textarea
          name="goals"
          id="goals"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.goals}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? '送信中...' : '登録する'}
        </button>
      </div>
    </form>
  );
}