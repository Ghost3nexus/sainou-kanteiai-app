'use client';

import { useState } from 'react';
import Link from 'next/link';

// 比較結果の型定義
type ComparisonUser = {
  id: string;
  name: string;
  [key: string]: any;
};

type CompatibilityItem = {
  user1: string;
  user2: string;
  score: number;
  comment: string;
};

type ComparisonResult = {
  type: string;
  title: string;
  users: ComparisonUser[];
  compatibility: CompatibilityItem[];
  analysis: string;
  teamSuggestion: string;
};

// プロップスの型定義
type ComparisonResultProps = {
  comparison: ComparisonResult;
  onRequestAIFeedback?: (userId: string) => void;
};

export default function ComparisonResult({ comparison, onRequestAIFeedback }: ComparisonResultProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'compatibility' | 'team'>('overview');
  
  // 相性スコアに基づく色を取得
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };
  
  // 占いタイプに基づく色を取得
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'numerology':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-800',
          accent: 'bg-indigo-600',
        };
      case 'fourPillars':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          accent: 'bg-amber-600',
        };
      case 'sanmei':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          accent: 'bg-blue-600',
        };
      case 'mbti':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          accent: 'bg-emerald-600',
        };
      case 'animalFortune':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          accent: 'bg-orange-600',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          accent: 'bg-gray-600',
        };
    }
  };
  
  const typeColor = getTypeColor(comparison.type);
  
  return (
    <div className={`${typeColor.bg} p-6 rounded-xl shadow-lg border ${typeColor.border}`}>
      <h2 className={`text-2xl font-bold ${typeColor.text} mb-6`}>{comparison.title}</h2>
      
      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'overview'
              ? `${typeColor.text} border-b-2 ${typeColor.border.replace('border', 'border-b')}`
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          概要
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'compatibility'
              ? `${typeColor.text} border-b-2 ${typeColor.border.replace('border', 'border-b')}`
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('compatibility')}
        >
          相性分析
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'team'
              ? `${typeColor.text} border-b-2 ${typeColor.border.replace('border', 'border-b')}`
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('team')}
        >
          チーム編成
        </button>
      </div>
      
      {/* 概要タブ */}
      {activeTab === 'overview' && (
        <div>
          <p className="text-gray-700 mb-6">{comparison.analysis}</p>
          
          <h3 className={`text-xl font-semibold ${typeColor.text} mb-4`}>診断結果一覧</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {comparison.users.map((user) => (
              <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-lg text-gray-800 mb-2">{user.name}</h4>
                
                {/* 占いタイプに応じた表示内容 */}
                {comparison.type === 'numerology' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">運命数:</span> {user.destinyNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">個性数:</span> {user.personalityNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">魂の数:</span> {user.soulNumber}
                    </p>
                  </div>
                )}
                
                {comparison.type === 'mbti' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">タイプ:</span> {user.personalityType}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">強み:</span> {user.strengths?.slice(0, 2).join(', ')}
                    </p>
                  </div>
                )}
                
                {comparison.type === 'animalFortune' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">動物:</span> {user.color}{user.animal}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">タイプ:</span> {user.animalType}
                    </p>
                  </div>
                )}
                
                {comparison.type === 'fourPillars' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">五行:</span> {user.elements && Object.entries(user.elements)
                        .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                        .slice(0, 2)
                        .map(([element, value]: [string, any]) => `${element}(${value}%)`)
                        .join(', ')}
                    </p>
                  </div>
                )}
                
                {comparison.type === 'sanmei' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">主星:</span> {user.mainStar}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">体星:</span> {user.bodyStar}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">心星:</span> {user.spiritStar}
                    </p>
                  </div>
                )}
                
                {/* AIフィードバックボタン */}
                {onRequestAIFeedback && (
                  <button
                    onClick={() => onRequestAIFeedback(user.id)}
                    className={`mt-4 px-3 py-1 text-sm text-white ${typeColor.accent} rounded hover:opacity-90 transition-opacity`}
                  >
                    AIフィードバック
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 相性分析タブ */}
      {activeTab === 'compatibility' && (
        <div>
          <h3 className={`text-xl font-semibold ${typeColor.text} mb-4`}>相性分析</h3>
          
          <div className="space-y-4 mb-6">
            {comparison.compatibility.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getScoreColor(item.score)} hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">
                    {item.user1} ＆ {item.user2}
                  </h4>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-50">
                    相性スコア: {item.score}%
                  </span>
                </div>
                <p className="text-gray-700">{item.comment}</p>
              </div>
            ))}
          </div>
          
          {/* 相性マトリックス */}
          {comparison.users.length > 2 && (
            <div className="mt-8">
              <h3 className={`text-xl font-semibold ${typeColor.text} mb-4`}>相性マトリックス</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200"></th>
                      {comparison.users.map((user) => (
                        <th key={user.id} className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                          {user.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.users.map((user1) => (
                      <tr key={user1.id}>
                        <td className="py-2 px-4 border-b border-gray-200 font-medium text-sm text-gray-700">
                          {user1.name}
                        </td>
                        {comparison.users.map((user2) => {
                          // 同じユーザーの場合は「-」を表示
                          if (user1.id === user2.id) {
                            return (
                              <td key={user2.id} className="py-2 px-4 border-b border-gray-200 text-center text-gray-500">
                                -
                              </td>
                            );
                          }
                          
                          // 相性スコアを検索
                          const compatItem = comparison.compatibility.find(
                            (item) => 
                              (item.user1 === user1.name && item.user2 === user2.name) ||
                              (item.user1 === user2.name && item.user2 === user1.name)
                          );
                          
                          const score = compatItem?.score || 0;
                          const scoreColor = getScoreColor(score);
                          
                          return (
                            <td key={user2.id} className="py-2 px-4 border-b border-gray-200">
                              <div className={`px-2 py-1 rounded text-center ${scoreColor}`}>
                                {score}%
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* チーム編成タブ */}
      {activeTab === 'team' && (
        <div>
          <h3 className={`text-xl font-semibold ${typeColor.text} mb-4`}>チーム編成の提案</h3>
          
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans">
              {comparison.teamSuggestion}
            </pre>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-lg font-medium text-blue-800 mb-2">チーム編成のヒント</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>相性スコアが高いメンバー同士でペアを組むことで、効率的な協業が期待できます。</li>
              <li>異なる特性を持つメンバーをバランスよく配置することで、多様な視点からの意見が得られます。</li>
              <li>チームのリーダーは、コミュニケーション能力が高く、全体を俯瞰できる人物が適しています。</li>
              <li>定期的なフィードバックの機会を設けることで、チームの相互理解が深まります。</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}