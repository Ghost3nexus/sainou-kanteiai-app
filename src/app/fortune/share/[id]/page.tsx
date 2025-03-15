import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// 結果を保存するディレクトリ
const RESULTS_DIR = path.join(process.cwd(), 'data', 'fortune-results');

// 結果の型定義
type FortuneResult = {
  id: string;
  type: string;
  result: any;
  userId: string | null;
  createdAt: string;
};

// パラメータの型定義
type PageParams = {
  params: {
    id: string;
  };
};

// 動的メタデータ
export async function generateMetadata({ params }: PageParams) {
  const resultId = params.id;
  
  try {
    const result = await getFortuneResult(resultId);
    
    if (!result) {
      return {
        title: '結果が見つかりません | 才能鑑定AI',
        description: '指定された占い結果が見つかりませんでした。',
      };
    }
    
    const typeNames: Record<string, string> = {
      'numerology': '数秘術',
      'fourPillars': '四柱推命',
      'sanmei': '算命学',
      'mbti': 'MBTI',
      'animalFortune': '動物占い',
    };
    
    return {
      title: `${typeNames[result.type] || '占い'}の結果 | 才能鑑定AI`,
      description: `才能鑑定AIで実施した${typeNames[result.type] || '占い'}の結果を共有します。`,
    };
  } catch (error) {
    return {
      title: 'エラー | 才能鑑定AI',
      description: '占い結果の取得中にエラーが発生しました。',
    };
  }
}

// 結果を取得する関数
async function getFortuneResult(id: string): Promise<FortuneResult | null> {
  try {
    const filePath = path.join(RESULTS_DIR, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as FortuneResult;
  } catch (error) {
    console.error('結果取得エラー:', error);
    return null;
  }
}

// 結果表示コンポーネント
function FortuneResultDisplay({ type, result }: { type: string; result: any }) {
  // 数秘術の結果表示
  if (type === 'numerology') {
    const { name, destinyNumber, personalityNumber, soulNumber, compatibility, destinyDescription, personalityDescription, soulDescription, summary } = result;
    
    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-800 mb-4">数秘術診断結果</h3>
          <p className="text-gray-700 mb-4">
            {name}さんの数秘術による診断結果です。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">運命数</h4>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                  {destinyNumber}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                あなたの人生の目的や使命を表す数です。
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">個性数</h4>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                  {personalityNumber}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                あなたの外面的な性格や特徴を表す数です。
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">魂の数</h4>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                  {soulNumber}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                あなたの内面的な欲求や願望を表す数です。
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">相性の良い数</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {compatibility.map((num: number) => (
                <div key={num} className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-lg font-bold">
                  {num}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600">
              これらの運命数を持つ人とは特に良い相性が期待できます。
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">総合診断</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {summary}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // MBTIの結果表示
  else if (type === 'mbti') {
    const { personalityType, description, strengths, weaknesses, compatibleTypes, careerSuggestions, summary } = result;
    
    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-800 mb-4">MBTI診断結果</h3>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                {personalityType}
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-semibold text-indigo-800">
                  {personalityType}型
                </h4>
                <p className="text-gray-600">
                  {description.title}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700">
              {description.full}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">強み</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">弱み</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {weaknesses.map((weakness: string, index: number) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">相性の良いタイプ</h4>
              <div className="space-y-3">
                {compatibleTypes.map((type: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-indigo-600">{type.type}型</span>
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                        相性 {type.compatibility}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{type.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">キャリア適性</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {careerSuggestions.map((career: string, index: number) => (
                  <li key={index}>{career}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">総合診断</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {summary}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // 動物占いの結果表示
  else if (type === 'animalFortune') {
    const { animal, color, animalType, characteristics, animalCharacteristic, colorCharacteristic, compatibility, advice, description, summary } = result;
    
    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-800 mb-4">動物占い診断結果</h3>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
                {animal}
              </div>
              <h4 className="text-xl font-semibold text-indigo-800">
                {color}{animal}（{animalType}タイプ）
              </h4>
            </div>
            
            <p className="text-gray-700 mb-4">
              {description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">性格特性</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {characteristics.map((trait: string, index: number) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">相性</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-green-600 mb-2">相性の良い動物</h5>
                  <div className="flex flex-wrap gap-2">
                    {compatibility.good.map((item: any, index: number) => (
                      <div key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {item.color}{item.animal}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-red-600 mb-2">相性の悪い動物</h5>
                  <div className="flex flex-wrap gap-2">
                    {compatibility.bad.map((item: any, index: number) => (
                      <div key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {item.color}{item.animal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">アドバイス</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {summary}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // その他の占いの結果表示（デフォルト）
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">診断結果</h3>
        <pre className="bg-white p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ページコンポーネント
export default async function FortuneSharePage({ params }: PageParams) {
  const resultId = params.id;
  const result = await getFortuneResult(resultId);
  
  if (!result) {
    notFound();
  }
  
  const typeNames: Record<string, string> = {
    'numerology': '数秘術',
    'fourPillars': '四柱推命',
    'sanmei': '算命学',
    'mbti': 'MBTI',
    'animalFortune': '動物占い',
  };
  
  const formattedDate = new Date(result.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {typeNames[result.type] || '占い'}の結果
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            {formattedDate}に実施した診断結果です
          </p>
        </div>
        
        <FortuneResultDisplay type={result.type} result={result.result} />
        
        <div className="mt-12 text-center">
          <Link
            href="/fortune"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            自分も才能診断を試してみる
          </Link>
        </div>
      </div>
    </div>
  );
}
