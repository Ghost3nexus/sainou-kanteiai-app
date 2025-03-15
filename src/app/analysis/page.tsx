import UserInfoForm from '@/components/forms/UserInfoForm';
import FortuneTestForm from '@/components/forms/FortuneTestForm';
import { Suspense } from 'react';

export const metadata = {
  title: '診断・分析 | 才能鑑定AI',
  description: 'あなたの才能や適性を科学的に分析し、可能性を最大限に引き出すための情報を入力してください',
};

export default function AnalysisPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            診断・分析
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            あなたの情報を入力して、才能診断や適性分析、可能性の発掘を行いましょう
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-medium text-white">
                個人情報入力フォーム
              </h2>
            </div>
            <div className="p-6">
              <UserInfoForm />
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-purple-600 px-6 py-4">
              <h2 className="text-lg font-medium text-white">
                占い診断テスト
              </h2>
            </div>
            <div className="p-6">
              <Suspense fallback={<div>占い診断テストを読み込み中...</div>}>
                <FortuneTestForm compact={true} />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-lg font-medium text-white">
              診断の流れ
            </h2>
          </div>
          <div className="p-6">
            <ol className="space-y-6">
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    1
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">情報入力</h3>
                  <p className="mt-2 text-gray-600">
                    上記フォームにあなたの基本情報と特性を入力します。正確な才能診断結果を得るためには、できるだけ詳細な情報を入力してください。
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    2
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">AIによる解析</h3>
                  <p className="mt-2 text-gray-600">
                    入力された情報をもとに、数値解析、時空間解析、心理診断などの複数の解析エンジンが連携して多角的な分析を行います。また、占い診断テストでは、数秘術やMBTIなどの手法を用いた分析も可能です。
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    3
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">結果の表示</h3>
                  <p className="mt-2 text-gray-600">
                    解析結果は、グラフやチャートを用いて視覚的にわかりやすく表示されます。また、具体的な改善提案や育成プランも自動生成されます。占い診断結果も詳細に表示され、あなたの特性をより深く理解するのに役立ちます。
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    4
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">データの活用</h3>
                  <p className="mt-2 text-gray-600">
                    診断結果は保存され、ダッシュボードで過去の診断との比較や、時系列での変化を確認することができます。自己成長や適性に合ったキャリア選択にお役立てください。占い診断結果も保存でき、いつでも参照することができます。
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}