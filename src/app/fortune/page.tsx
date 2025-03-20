'use client';

import { useState } from 'react';
import FortuneTestForm from '@/components/forms/FortuneTestForm';
import UserInfoForm from '@/components/forms/UserInfoForm';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

export default function FortunePage() {
  const [fortuneResult, setFortuneResult] = useState<{
    type: string;
    result: any;
  } | null>(null);

  const handleFortuneComplete = (result: any) => {
    setFortuneResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            才能診断テスト
          </h1>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {!fortuneResult ? (
                <AnimatedTransition isVisible={true} direction="right">
                  <div className="space-y-6">
                    <FortuneTestForm />
                  </div>
                </AnimatedTransition>
              ) : (
                <AnimatedTransition isVisible={true} direction="left">
                  <div className="space-y-8">
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            診断が完了しました！続いて、個人情報を入力してください。
                          </p>
                        </div>
                      </div>
                    </div>

                    <UserInfoForm fortuneResult={fortuneResult} />
                  </div>
                </AnimatedTransition>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}