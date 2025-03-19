'use client';

import { useState } from 'react';

// AIフィードバックの型定義
type AIFeedbackSection = Record<string, string>;

type AIFeedbackData = {
  type: string;
  resultId: string;
  generatedAt: string;
  content: string;
  sections: AIFeedbackSection;
  error?: boolean;
};

// プロップスの型定義
type AIFeedbackProps = {
  feedback: AIFeedbackData;
  userName?: string;
  isLoading?: boolean;
};

export default function AIFeedback({ feedback, userName, isLoading = false }: AIFeedbackProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // 占いタイプに基づく色を取得
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'numerology':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-800',
          accent: 'bg-indigo-600',
          light: 'bg-indigo-100',
        };
      case 'fourPillars':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          accent: 'bg-amber-600',
          light: 'bg-amber-100',
        };
      case 'sanmei':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          accent: 'bg-blue-600',
          light: 'bg-blue-100',
        };
      case 'mbti':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          accent: 'bg-emerald-600',
          light: 'bg-emerald-100',
        };
      case 'animalFortune':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          accent: 'bg-orange-600',
          light: 'bg-orange-100',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          accent: 'bg-gray-600',
          light: 'bg-gray-100',
        };
    }
  };
  
  const typeColor = getTypeColor(feedback.type);
  
  // ローディング表示
  if (isLoading) {
    return (
      <div className={`${typeColor.bg} p-6 rounded-xl shadow-lg border ${typeColor.border} min-h-[300px] flex flex-col items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-700">AIフィードバックを生成中...</p>
      </div>
    );
  }
  
  // エラー表示
  if (feedback.error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl shadow-lg border border-red-200 min-h-[200px]">
        <h2 className="text-2xl font-bold text-red-800 mb-4">AIフィードバック生成エラー</h2>
        <p className="text-gray-700 mb-4">{feedback.content}</p>
        <p className="text-gray-600 text-sm">
          後でもう一度お試しください。OpenAI APIの接続に問題が発生している可能性があります。
        </p>
      </div>
    );
  }
  
  // セクションの展開/折りたたみを切り替える
  const toggleSection = (sectionTitle: string) => {
    if (expandedSection === sectionTitle) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionTitle);
    }
  };
  
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className={`${typeColor.bg} p-6 rounded-xl shadow-lg border ${typeColor.border}`}>
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 rounded-full ${typeColor.accent} text-white flex items-center justify-center text-xl font-bold mr-4`}>
          AI
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AIパーソナルフィードバック</h2>
          <p className={`${typeColor.text}`}>
            {userName ? `${userName}さんへのアドバイス` : 'あなたへのアドバイス'}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">生成日時: {formatDate(feedback.generatedAt)}</span>
          <span className={`px-3 py-1 rounded-full text-xs ${typeColor.light} ${typeColor.text}`}>
            {feedback.type === 'numerology' ? '数秘術' : 
             feedback.type === 'fourPillars' ? '四柱推命' : 
             feedback.type === 'sanmei' ? '算命学' : 
             feedback.type === 'mbti' ? 'MBTI' : 
             feedback.type === 'animalFortune' ? '動物占い' : 
             feedback.type}
          </span>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <p className="text-gray-700 italic">
            このフィードバックは、あなたの診断結果に基づいてAIが生成したものです。
            参考情報としてご活用ください。
          </p>
        </div>
      </div>
      
      {/* セクション一覧 */}
      <div className="space-y-4">
        {Object.entries(feedback.sections).map(([title, content]) => (
          <div key={title} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <button
              className={`w-full px-6 py-4 text-left font-medium flex justify-between items-center ${
                expandedSection === title ? typeColor.text : 'text-gray-800'
              }`}
              onClick={() => toggleSection(title)}
            >
              <span>{title}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  expandedSection === title ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            
            {expandedSection === title && (
              <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-gray-700 whitespace-pre-line">{content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          このフィードバックはOpenAI GPT-4によって生成されました。
        </p>
      </div>
    </div>
  );
}