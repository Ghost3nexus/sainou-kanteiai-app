'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import StepIndicator from '@/components/ui/StepIndicator';

interface FortuneTestFormProps {
  userId?: string;
  compact?: boolean;
  onComplete?: (result: any) => void;
}

export default function FortuneTestForm({ 
  userId, 
  compact = false,
  onComplete 
}: FortuneTestFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    birthtime: '',
    birthplace: '',
    mbtiAnswers: {},
    selectedAnimal: '',
    numerologyNumber: '',
    fourPillarsData: {},
    sanmeiData: {}
  });
  const [result, setResult] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const steps = [
    'MBTI診断',
    '動物占い',
    '数秘術',
    '四柱推命',
    '算命学'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 現在のステップに応じた診断APIを呼び出す
      let endpoint = '';
      let requestData = {};

      switch (currentStep) {
        case 1:
          endpoint = '/api/fortune/mbti';
          requestData = { answers: formData.mbtiAnswers };
          break;
        case 2:
          endpoint = '/api/fortune/animalFortune';
          requestData = { animal: formData.selectedAnimal };
          break;
        case 3:
          endpoint = '/api/fortune/numerology';
          requestData = { number: formData.numerologyNumber };
          break;
        case 4:
          endpoint = '/api/fortune/fourPillars';
          requestData = formData.fourPillarsData;
          break;
        case 5:
          endpoint = '/api/fortune/sanmei';
          requestData = formData.sanmeiData;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('診断中にエラーが発生しました');
      }

      const data = await response.json();

      if (currentStep < steps.length) {
        // 次のステップに進む
        setCurrentStep(prev => prev + 1);
        setResult({ ...result, ...data.result });
      } else {
        // 全ステップ完了
        const finalResult = { ...result, ...data.result };
        setResult(finalResult);

        // 結果を保存
        const saveResponse = await fetch('/api/fortune/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            result: finalResult
          }),
        });

        if (!saveResponse.ok) {
          throw new Error('結果の保存中にエラーが発生しました');
        }

        const savedData = await saveResponse.json();
        setSaveSuccess(true);

        // 親コンポーネントに結果を渡す
        if (onComplete) {
          onComplete({
            type: currentStep === 1 ? 'mbti' :
                  currentStep === 2 ? 'animalFortune' :
                  currentStep === 3 ? 'numerology' :
                  currentStep === 4 ? 'fourPillars' : 'sanmei',
            result: finalResult
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-8">
      {!compact && (
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ステップに応じたフォーム内容 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">MBTI性格診断</h2>
            {/* MBTIの質問フォーム */}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">動物占い</h2>
            {/* 動物占いのフォーム */}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">数秘術</h2>
            {/* 数秘術のフォーム */}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">四柱推命</h2>
            {/* 四柱推命のフォーム */}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">算命学</h2>
            {/* 算命学のフォーム */}
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : currentStep === steps.length ? (
              '診断を完了'
            ) : (
              '次へ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
