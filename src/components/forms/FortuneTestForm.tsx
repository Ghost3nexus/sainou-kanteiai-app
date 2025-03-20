'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShareButtons from '@/components/ui/ShareButtons';
import {
  fetchNumerologyFortune,
  fetchFourPillarsFortune,
  fetchSanmeiFortune,
  fetchMbtiFortune,
  fetchAnimalFortune,
  saveFortuneResult,
  generateCharacter
} from '@/lib/api';

// 占いの種類
type FortuneType = 'numerology' | 'fourPillars' | 'sanmei' | 'mbti' | 'animalFortune';

// 占いの情報
const fortuneTypes = [
  { 
    id: 'numerology', 
    name: '数秘術', 
    description: '名前の画数や生年月日から運命数を計算し、相性評価の数値化を行います。' 
  },
  { 
    id: 'fourPillars', 
    name: '四柱推命', 
    description: '天干・地支の組み合わせから性格や運命の傾向を解析します。' 
  },
  { 
    id: 'sanmei', 
    name: '算命学', 
    description: '陰陽五行説や十干・十二支を用いた運勢の評価を行います。' 
  },
  { 
    id: 'mbti', 
    name: 'MBTI', 
    description: '質問結果を基に16タイプに分類し、性格の特徴と相性を示します。' 
  },
  { 
    id: 'animalFortune', 
    name: '動物占い', 
    description: '生年月日から動物キャラクターに分類し、特性や対人相性を評価します。' 
  }
];

// MBTIの質問
const mbtiQuestions = [
  // 外向性(E) vs 内向性(I)
  {
    id: 'q1',
    question: '初対面の人との会話で、あなたは：',
    options: [
      { id: 'e', text: '積極的に話しかけ、会話を広げる' },
      { id: 'i', text: '相手からの話題を待ち、慎重に応答する' }
    ],
    category: 'ei'
  },
  {
    id: 'q2',
    question: '休日の過ごし方として、あなたが好むのは：',
    options: [
      { id: 'e', text: '友人と外出して活動的に過ごす' },
      { id: 'i', text: '家でゆっくりと自分の時間を楽しむ' }
    ],
    category: 'ei'
  },
  {
    id: 'q3',
    question: 'グループ活動で、あなたは：',
    options: [
      { id: 'e', text: '積極的に意見を出し、議論をリードする' },
      { id: 'i', text: '他の人の意見をよく聞き、じっくり考えてから発言する' }
    ],
    category: 'ei'
  },
  {
    id: 'q4',
    question: 'エネルギーを回復するとき、あなたは：',
    options: [
      { id: 'e', text: '人と会って話をすることで元気になる' },
      { id: 'i', text: '一人の時間を持つことでリフレッシュする' }
    ],
    category: 'ei'
  },

  // 感覚(S) vs 直感(N)
  {
    id: 'q5',
    question: '情報を処理する際、あなたは：',
    options: [
      { id: 's', text: '具体的な事実や詳細に注目する' },
      { id: 'n', text: '全体的なパターンや可能性を重視する' }
    ],
    category: 'sn'
  },
  {
    id: 'q6',
    question: '新しいアイデアに対して、あなたは：',
    options: [
      { id: 's', text: '実用性や実現可能性を重視する' },
      { id: 'n', text: '革新性や創造性を重視する' }
    ],
    category: 'sn'
  },
  {
    id: 'q7',
    question: '問題解決において、あなたは：',
    options: [
      { id: 's', text: '過去の経験や実績のある方法を重視する' },
      { id: 'n', text: '新しいアプローチや独創的な解決策を探る' }
    ],
    category: 'sn'
  },
  {
    id: 'q8',
    question: '仕事や学習で、あなたが得意なのは：',
    options: [
      { id: 's', text: '具体的な手順や方法を実践すること' },
      { id: 'n', text: '新しい概念や理論を考えること' }
    ],
    category: 'sn'
  },

  // 思考(T) vs 感情(F)
  {
    id: 'q9',
    question: '決断を下す際、あなたは：',
    options: [
      { id: 't', text: '論理的な分析と客観的な事実に基づいて判断する' },
      { id: 'f', text: '人々の感情や価値観を考慮して判断する' }
    ],
    category: 'tf'
  },
  {
    id: 'q10',
    question: '意見の対立があった場合、あなたは：',
    options: [
      { id: 't', text: '論理的な議論で相手を説得しようとする' },
      { id: 'f', text: '全員が納得できる妥協点を探そうとする' }
    ],
    category: 'tf'
  },
  {
    id: 'q11',
    question: 'フィードバックを与える際、あなたは：',
    options: [
      { id: 't', text: '率直に改善点を指摘する' },
      { id: 'f', text: '相手の気持ちに配慮しながら伝える' }
    ],
    category: 'tf'
  },
  {
    id: 'q12',
    question: 'チーム内での役割として、あなたが得意なのは：',
    options: [
      { id: 't', text: '目標達成のための戦略立案や進捗管理' },
      { id: 'f', text: 'チームの調和を保ち、メンバーをサポートすること' }
    ],
    category: 'tf'
  },

  // 判断(J) vs 知覚(P)
  {
    id: 'q13',
    question: '計画を立てる際、あなたは：',
    options: [
      { id: 'j', text: '詳細な計画を事前に立て、それに従って進める' },
      { id: 'p', text: '大まかな方向性だけ決め、状況に応じて柔軟に対応する' }
    ],
    category: 'jp'
  },
  {
    id: 'q14',
    question: '締め切りのある仕事に対して、あなたは：',
    options: [
      { id: 'j', text: '計画的に進め、余裕を持って完了させる' },
      { id: 'p', text: '締め切り直前に集中して取り組むことが多い' }
    ],
    category: 'jp'
  },
  {
    id: 'q15',
    question: '予定変更に対して、あなたは：',
    options: [
      { id: 'j', text: 'できるだけ避けたい、または早めに知りたい' },
      { id: 'p', text: '柔軟に対応できる、むしろ新鮮に感じる' }
    ],
    category: 'jp'
  },
  {
    id: 'q16',
    question: '仕事や生活環境について、あなたは：',
    options: [
      { id: 'j', text: '整理整頓された、予測可能な状態を好む' },
      { id: 'p', text: '自由で柔軟な、創造的な雰囲気を好む' }
    ],
    category: 'jp'
  }
];

// 数秘術の入力フォーム
const NumerologyForm = ({ onSubmit, userId }: { onSubmit: (data: any) => void, userId?: string }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, birthdate, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          氏名（漢字）<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          placeholder="山田 太郎"
        />
        <p className="mt-1 text-sm text-gray-500">
          姓名判断に使用します。本名をご入力ください。
        </p>
      </div>
      
      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
          生年月日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">
          数秘術の計算に使用します。
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          結果を見る
        </button>
      </div>
    </form>
  );
};

// 四柱推命の入力フォーム
const FourPillarsForm = ({ onSubmit, userId }: { onSubmit: (data: any) => void, userId?: string }) => {
  const [birthdate, setBirthdate] = useState('');
  const [birthtime, setBirthtime] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ birthdate, birthtime, gender, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
          生年月日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
      </div>
      
      <div>
        <label htmlFor="birthtime" className="block text-sm font-medium text-gray-700 mb-1">
          生まれた時間（任意）
        </label>
        <input
          type="time"
          id="birthtime"
          value={birthtime}
          onChange={(e) => setBirthtime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">
          時間帯によって命式が変わります。できるだけ正確な時間をご入力ください。
        </p>
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          性別 <span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          結果を見る
        </button>
      </div>
    </form>
  );
};

// 算命学の入力フォーム
const SanmeiForm = ({ onSubmit, userId }: { onSubmit: (data: any) => void, userId?: string }) => {
  const [birthdate, setBirthdate] = useState('');
  const [birthtime, setBirthtime] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ birthdate, birthtime, gender, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
          生年月日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
      </div>
      
      <div>
        <label htmlFor="birthtime" className="block text-sm font-medium text-gray-700 mb-1">
          生まれた時間
        </label>
        <input
          type="time"
          id="birthtime"
          value={birthtime}
          onChange={(e) => setBirthtime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">
          より詳細な鑑定のために入力をお勧めします（任意）。
        </p>
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          性別 <span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          結果を見る
        </button>
      </div>
    </form>
  );
};

// MBTIの質問フォーム
const MbtiForm = ({ onSubmit, userId }: { onSubmit: (data: any) => void, userId?: string }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 回答から性格タイプを計算
    const counts = {
      e: 0, i: 0,
      s: 0, n: 0,
      t: 0, f: 0,
      j: 0, p: 0
    };
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = mbtiQuestions.find(q => q.id === questionId);
      if (question) {
        counts[answer as keyof typeof counts]++;
      }
    });
    
    const personalityType = 
      (counts.e > counts.i ? 'E' : 'I') +
      (counts.s > counts.n ? 'S' : 'N') +
      (counts.t > counts.f ? 'T' : 'F') +
      (counts.j > counts.p ? 'J' : 'P');
    
    onSubmit({ answers, personalityType, userId });
  };

  const isComplete = mbtiQuestions.every(q => answers[q.id]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-gray-700">
        以下の質問に回答して、あなたのMBTIタイプを診断します。各質問で、あなたにより当てはまる選択肢を選んでください。
      </p>
      
      {mbtiQuestions.map((question) => (
        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}-${option.id}`}
                  name={question.id}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => handleOptionSelect(question.id, option.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor={`${question.id}-${option.id}`} className="ml-3 text-gray-700">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isComplete}
          className={`px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            !isComplete ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isComplete ? '結果を見る' : 'すべての質問に回答してください'}
        </button>
      </div>
    </form>
  );
};

// 結果表示コンポーネント
const FortuneResultDisplay = ({ type, result }: { type: string | null; result: any }) => {
// デバッグ用
console.log('FortuneResultDisplay - 開始:', type);
console.log('FortuneResultDisplay - 結果データ:', result);
if (result && result.result) {
  console.log('FortuneResultDisplay - result.result:', result.result);
} else {
  console.log('FortuneResultDisplay - result.resultが存在しません');
}

// 数秘術の結果表示
if (type === 'numerology') {
  // APIレスポンスの構造に合わせて、データを取得
  // result.resultが存在する場合はそれを使用し、存在しない場合はresult自体を使用
  console.log('数秘術の結果表示 - 開始');
  
  let resultData;
  if (result.result) {
    console.log('数秘術 - result.resultを使用');
    resultData = result.result;
  } else {
    console.log('数秘術 - result自体を使用');
    resultData = result;
  }
  
  console.log('数秘術 - 使用するデータ:', resultData);
  
  if (!resultData) {
    console.log('数秘術 - resultDataがnull');
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        結果データが見つかりません。もう一度お試しください。
      </div>
    );
  }
    const { name, destinyNumber, personalityNumber, soulNumber, compatibility, destinyDescription, personalityDescription, soulDescription, summary } = resultData;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-xl shadow-xl border border-indigo-100 relative overflow-hidden">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 -mr-32 -mt-32 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full opacity-20 -ml-32 -mb-32 z-0"></div>
          
          {/* 神秘的な数字の装飾 */}
          <div className="absolute top-10 left-10 text-6xl font-bold text-indigo-100 opacity-30 transform -rotate-12 z-0">1</div>
          <div className="absolute bottom-10 right-10 text-6xl font-bold text-purple-100 opacity-30 transform rotate-12 z-0">9</div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-lg">
                <span className="transform rotate-12">数</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-800">数秘術診断結果</h3>
                <p className="text-indigo-600">
                  {name}さんの数秘術による診断結果
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 border border-indigo-100 hover:border-indigo-300">
                <h4 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 text-sm font-bold">運</span>
                  運命数
                </h4>
                <div className="flex items-center justify-center my-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    {destinyNumber}
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-center">
                  あなたの人生の目的や使命を表す数です。
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 border border-blue-100 hover:border-blue-300">
                <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">個</span>
                  個性数
                </h4>
                <div className="flex items-center justify-center my-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    {personalityNumber}
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-center">
                  あなたの外面的な性格や特徴を表す数です。
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 border border-purple-100 hover:border-purple-300">
                <h4 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2 text-sm font-bold">魂</span>
                  魂の数
                </h4>
                <div className="flex items-center justify-center my-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    {soulNumber}
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-center">
                  あなたの内面的な欲求や願望を表す数です。
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-green-100">
              <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-sm font-bold">相</span>
                相性の良い数
              </h4>
              <div className="flex flex-wrap gap-4 justify-center my-4">
                {compatibility.map((num: number) => (
                  <div key={num} className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-md transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                    {num}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-gray-600 text-center">
                これらの運命数を持つ人とは特に良い相性が期待できます。
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-indigo-100">
              <h4 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 text-sm font-bold">診</span>
                総合診断
              </h4>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 四柱推命の結果表示
  else if (type === 'fourPillars') {
    // APIレスポンスの構造に合わせて、データを取得
    console.log('四柱推命の結果表示 - 開始');
    
    let resultData;
    if (result.result) {
      console.log('四柱推命 - result.resultを使用');
      resultData = result.result;
    } else {
      console.log('四柱推命 - result自体を使用');
      resultData = result;
    }
    
    console.log('四柱推命 - 使用するデータ:', resultData);
    
    if (!resultData) {
      console.log('四柱推命 - resultDataがnull');
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          結果データが見つかりません。もう一度お試しください。
        </div>
      );
    }
    const { name, birthdate, birthtime, gender, elements, pillars, characteristics, strengths, weaknesses, lifeDirection, compatibility, summary } = resultData;
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50 p-8 rounded-xl shadow-xl border border-amber-100 relative overflow-hidden">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-200 to-amber-200 rounded-full opacity-20 -mr-32 -mt-32 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-200 to-yellow-200 rounded-full opacity-20 -ml-32 -mb-32 z-0"></div>
          
          {/* 四柱推命の装飾 */}
          <div className="absolute top-10 left-10 text-6xl font-bold text-red-100 opacity-20 z-0">四</div>
          <div className="absolute bottom-10 right-10 text-6xl font-bold text-amber-100 opacity-20 z-0">命</div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-lg">
                <span className="transform rotate-12">四</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-800">四柱推命診断結果</h3>
                <p className="text-amber-600">
                  天干・地支による命式分析
                </p>
              </div>
            </div>
            
            {/* 四柱の表示 */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-amber-100">
              <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">命</span>
                四柱（天干・地支）
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {pillars && pillars.map((pillar: any, index: number) => {
                  const titles = ['年柱', '月柱', '日柱', '時柱'];
                  const bgColors = [
                    'bg-gradient-to-br from-amber-600 to-red-600',
                    'bg-gradient-to-br from-emerald-600 to-teal-600',
                    'bg-gradient-to-br from-blue-600 to-indigo-600',
                    'bg-gradient-to-br from-purple-600 to-pink-600'
                  ];
                  const borderColors = [
                    'border-amber-200',
                    'border-emerald-200',
                    'border-blue-200',
                    'border-purple-200'
                  ];
                  
                  return (
                    <div key={index} className={`bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 border ${borderColors[index]}`}>
                      <h5 className="text-center font-semibold text-gray-800 mb-3">{titles[index]}</h5>
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-full ${bgColors[index]} text-white flex items-center justify-center text-2xl font-bold mb-3 shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                          {pillar.heavenlyStem}
                        </div>
                        <div className={`w-20 h-20 rounded-full ${bgColors[index]} bg-opacity-80 text-white flex items-center justify-center text-2xl font-bold shadow-lg transform hover:-rotate-12 transition-transform duration-300`}>
                          {pillar.earthlyBranch}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-center text-gray-600 font-medium">
                        {pillar.element}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">五</span>
                  五行バランス
                </h4>
                <div className="space-y-4">
                  {elements && Object.entries(elements).map(([element, value]: [string, any]) => {
                    const elementColors: Record<string, { bg: string, text: string, border: string }> = {
                      '木': { bg: 'bg-green-500', text: 'text-green-800', border: 'border-green-300' },
                      '火': { bg: 'bg-red-500', text: 'text-red-800', border: 'border-red-300' },
                      '土': { bg: 'bg-yellow-500', text: 'text-yellow-800', border: 'border-yellow-300' },
                      '金': { bg: 'bg-amber-500', text: 'text-amber-800', border: 'border-amber-300' },
                      '水': { bg: 'bg-blue-500', text: 'text-blue-800', border: 'border-blue-300' }
                    };
                    
                    const elementColor = elementColors[element] || { bg: 'bg-gray-500', text: 'text-gray-800', border: 'border-gray-300' };
                    const percentage = typeof value === 'number' ? value : 0;
                    
                    return (
                      <div key={element} className={`p-3 rounded-lg border ${elementColor.border} hover:shadow-md transition-shadow duration-300`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium ${elementColor.text}`}>{element}の気</span>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-full bg-opacity-20 ${elementColor.text} ${elementColor.bg.replace('500', '100')}`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${elementColor.bg}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">性</span>
                  性格特性
                </h4>
                <ul className="list-none space-y-3">
                  {characteristics && characteristics.map((trait: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                      <span className="text-gray-700">{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-100 hover:border-green-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-sm font-bold">強</span>
                  強み
                </h4>
                <ul className="list-none space-y-3">
                  {strengths && strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-red-100 hover:border-red-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-sm font-bold">弱</span>
                  弱み
                </h4>
                <ul className="list-none space-y-3">
                  {weaknesses && weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">!</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-300">
              <h4 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">診</span>
                総合診断
              </h4>
              <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 算命学の結果表示
  else if (type === 'sanmei') {
    // APIレスポンスの構造に合わせて、result.resultからデータを取得
    const resultData = result.result;
    if (!resultData) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          結果データが見つかりません。もう一度お試しください。
        </div>
      );
    }
    const { name, birthdate, birthtime, gender, mainStar, bodyStar, spiritStar, characteristics, strengths, weaknesses, lifeDirection, compatibility, summary, elements, fourPillars, majorFortunes, annualFortunes } = resultData;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8 rounded-xl shadow-xl border border-blue-100 relative overflow-hidden">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 -mr-32 -mt-32 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-200 to-teal-200 rounded-full opacity-20 -ml-32 -mb-32 z-0"></div>
          
          {/* 算命学の装飾 */}
          <div className="absolute top-10 left-10 text-6xl font-bold text-blue-100 opacity-20 z-0">算</div>
          <div className="absolute bottom-10 right-10 text-6xl font-bold text-cyan-100 opacity-20 z-0">命</div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-lg">
                <span className="transform rotate-12">算</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-800">算命学診断結果</h3>
                <p className="text-blue-600">
                  陰陽五行による運命分析
                </p>
              </div>
            </div>
            
            {/* 四柱の表示 */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">命</span>
                四柱（天干・地支）
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {fourPillars && Object.entries(fourPillars).map(([key, pillar]: [string, any], index: number) => {
                  const titles = ['年柱', '月柱', '日柱', '時柱'];
                  const keys = ['year', 'month', 'day', 'hour'];
                  const bgColors = [
                    'bg-gradient-to-br from-blue-600 to-cyan-600',
                    'bg-gradient-to-br from-emerald-600 to-teal-600',
                    'bg-gradient-to-br from-indigo-600 to-blue-600',
                    'bg-gradient-to-br from-purple-600 to-pink-600'
                  ];
                  const borderColors = [
                    'border-blue-200',
                    'border-emerald-200',
                    'border-indigo-200',
                    'border-purple-200'
                  ];
                  
                  const keyIndex = keys.indexOf(key);
                  if (keyIndex === -1) return null;
                  
                  return (
                    <div key={key} className={`bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 border ${borderColors[keyIndex]}`}>
                      <h5 className="text-center font-semibold text-gray-800 mb-3">{titles[keyIndex]}</h5>
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-full ${bgColors[keyIndex]} text-white flex items-center justify-center text-2xl font-bold mb-3 shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                          {pillar.stem}
                        </div>
                        <div className={`w-20 h-20 rounded-full ${bgColors[keyIndex]} bg-opacity-80 text-white flex items-center justify-center text-2xl font-bold shadow-lg transform hover:-rotate-12 transition-transform duration-300`}>
                          {pillar.branch}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 三星の表示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 border border-blue-100 hover:border-blue-300">
                <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">主</span>
                  主星
                </h4>
                <div className="flex items-center justify-center my-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    {mainStar}
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-center">
                  あなたの本質を表す星
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 border border-teal-100 hover:border-teal-300">
                <h4 className="text-lg font-semibold text-teal-700 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mr-2 text-sm font-bold">体</span>
                  体星
                </h4>
                <div className="flex items-center justify-center my-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    {bodyStar}
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-center">
                  あなたの行動傾向を表す星
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 border border-purple-100 hover:border-purple-300">
                <h4 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2 text-sm font-bold">心</span>
                  心星
                </h4>
                <div className="flex items-center justify-center my-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    {spiritStar}
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-center">
                  あなたの内面や感情を表す星
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:border-blue-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">五</span>
                  五行バランス
                </h4>
                <div className="space-y-4">
                  {elements && Object.entries(elements).map(([element, value]: [string, any]) => {
                    const elementColors: Record<string, { bg: string, text: string, border: string }> = {
                      '木': { bg: 'bg-green-500', text: 'text-green-800', border: 'border-green-300' },
                      '火': { bg: 'bg-red-500', text: 'text-red-800', border: 'border-red-300' },
                      '土': { bg: 'bg-yellow-500', text: 'text-yellow-800', border: 'border-yellow-300' },
                      '金': { bg: 'bg-amber-500', text: 'text-amber-800', border: 'border-amber-300' },
                      '水': { bg: 'bg-blue-500', text: 'text-blue-800', border: 'border-blue-300' }
                    };
                    
                    const elementColor = elementColors[element] || { bg: 'bg-gray-500', text: 'text-gray-800', border: 'border-gray-300' };
                    const percentage = typeof value === 'number' ? Math.round(value * 10) : 0;
                    
                    return (
                      <div key={element} className={`p-3 rounded-lg border ${elementColor.border} hover:shadow-md transition-shadow duration-300`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium ${elementColor.text}`}>{element}の気</span>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-full bg-opacity-20 ${elementColor.text} ${elementColor.bg.replace('500', '100')}`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${elementColor.bg}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:border-blue-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">性</span>
                  性格特性
                </h4>
                <ul className="list-none space-y-3">
                  {characteristics && characteristics.map((trait: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                      <span className="text-gray-700">{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-cyan-100 hover:border-cyan-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-cyan-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mr-2 text-sm font-bold">相</span>
                  相性
                </h4>
                <div className="space-y-4">
                  {compatibility && (
                    <div>
                      <h5 className="text-sm font-medium text-cyan-600 mb-3 flex items-center">
                        <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mr-2 text-xs">◎</span>
                        相性の良い星
                      </h5>
                      <div className="flex flex-wrap gap-2 ml-7">
                        {compatibility.good && compatibility.good.map((star: string, index: number) => (
                          <div key={index} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm hover:bg-cyan-200 transition-colors duration-300 transform hover:scale-105">
                            {star}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-teal-100 hover:border-teal-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mr-2 text-sm font-bold">方</span>
                  人生の方向性
                </h4>
                <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {lifeDirection}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-100 hover:border-green-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-sm font-bold">強</span>
                  強み
                </h4>
                <ul className="list-none space-y-3">
                  {strengths && strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-red-100 hover:border-red-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-sm font-bold">弱</span>
                  弱み
                </h4>
                <ul className="list-none space-y-3">
                  {weaknesses && weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">!</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* 大運（10年ごとの運勢）の表示 */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-indigo-100 hover:border-indigo-300 transition-colors duration-300">
              <h4 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 text-sm font-bold">大</span>
                大運（10年ごとの運勢）
              </h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年齢</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">西暦</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">干支</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">解説</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {majorFortunes && majorFortunes.map((fortune: any, index: number) => (
                      <tr key={index} className={fortune.isCurrent ? 'bg-indigo-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {fortune.age}〜{fortune.age + 9}歳
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fortune.year}〜{fortune.year + 9}年
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {fortune.stem}{fortune.branch}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fortune.isCurrent ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              現在
                            </span>
                          ) : fortune.year > new Date().getFullYear() ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              未来
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              過去
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-lg">
                            {fortune.description}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 年運（今年と来年の運勢）の表示 */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-teal-100 hover:border-teal-300 transition-colors duration-300">
              <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mr-2 text-sm font-bold">年</span>
                年運（今年と来年の運勢）
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {annualFortunes && annualFortunes.map((fortune: any, index: number) => {
                  const compatibilityColors: Record<string, string> = {
                    '良い': 'bg-green-100 text-green-800',
                    '普通': 'bg-blue-100 text-blue-800',
                    '注意': 'bg-amber-100 text-amber-800'
                  };
                  const compatibilityColor = compatibilityColors[fortune.compatibility] || 'bg-gray-100 text-gray-800';
                  
                  return (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-lg font-medium text-gray-900">{fortune.year}年</h5>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${compatibilityColor}`}>
                          相性: {fortune.compatibility}
                        </span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mr-2">
                          {fortune.stem}{fortune.branch}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        {fortune.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 hover:border-blue-300 transition-colors duration-300">
              <h4 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">診</span>
                総合診断
              </h4>
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // MBTIの結果表示
  else if (type === 'mbti') {
    // APIレスポンスの構造に合わせて、result.resultからデータを取得
    const resultData = result.result;
    if (!resultData) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          結果データが見つかりません。もう一度お試しください。
        </div>
      );
    }
    const { personalityType, description, strengths, weaknesses, compatibleTypes, careerSuggestions, summary } = resultData;
    
    // MBTIタイプごとの色を設定
    const typeColors: Record<string, { bg: string, text: string, gradient: string }> = {
      'INTJ': { bg: 'bg-indigo-100', text: 'text-indigo-800', gradient: 'from-indigo-600 to-purple-600' },
      'INTP': { bg: 'bg-blue-100', text: 'text-blue-800', gradient: 'from-blue-600 to-indigo-600' },
      'ENTJ': { bg: 'bg-purple-100', text: 'text-purple-800', gradient: 'from-purple-600 to-indigo-600' },
      'ENTP': { bg: 'bg-violet-100', text: 'text-violet-800', gradient: 'from-violet-600 to-purple-600' },
      'INFJ': { bg: 'bg-teal-100', text: 'text-teal-800', gradient: 'from-teal-600 to-emerald-600' },
      'INFP': { bg: 'bg-emerald-100', text: 'text-emerald-800', gradient: 'from-emerald-600 to-teal-600' },
      'ENFJ': { bg: 'bg-green-100', text: 'text-green-800', gradient: 'from-green-600 to-teal-600' },
      'ENFP': { bg: 'bg-lime-100', text: 'text-lime-800', gradient: 'from-lime-600 to-green-600' },
      'ISTJ': { bg: 'bg-slate-100', text: 'text-slate-800', gradient: 'from-slate-600 to-gray-600' },
      'ISFJ': { bg: 'bg-cyan-100', text: 'text-cyan-800', gradient: 'from-cyan-600 to-blue-600' },
      'ESTJ': { bg: 'bg-amber-100', text: 'text-amber-800', gradient: 'from-amber-600 to-orange-600' },
      'ESFJ': { bg: 'bg-orange-100', text: 'text-orange-800', gradient: 'from-orange-600 to-amber-600' },
      'ISTP': { bg: 'bg-gray-100', text: 'text-gray-800', gradient: 'from-gray-600 to-slate-600' },
      'ISFP': { bg: 'bg-rose-100', text: 'text-rose-800', gradient: 'from-rose-600 to-pink-600' },
      'ESTP': { bg: 'bg-red-100', text: 'text-red-800', gradient: 'from-red-600 to-rose-600' },
      'ESFP': { bg: 'bg-pink-100', text: 'text-pink-800', gradient: 'from-pink-600 to-rose-600' }
    };
    
    // デフォルトの色
    const defaultColor = { bg: 'bg-indigo-100', text: 'text-indigo-800', gradient: 'from-indigo-600 to-blue-600' };
    
    // 該当するタイプの色を取得（personalityTypeがnullの場合に対応）
    const typeColor = personalityType ? typeColors[personalityType] || defaultColor : defaultColor;
    
    // MBTIの4つの指標を分解
    const dimensions = personalityType ? [
      { label: 'エネルギーの方向', value: personalityType[0], description: personalityType[0] === 'E' ? '外向型 (Extraversion)' : '内向型 (Introversion)' },
      { label: '情報の取得方法', value: personalityType[1], description: personalityType[1] === 'S' ? '感覚型 (Sensing)' : '直感型 (iNtuition)' },
      { label: '判断の仕方', value: personalityType[2], description: personalityType[2] === 'T' ? '思考型 (Thinking)' : '感情型 (Feeling)' },
      { label: '外界への接し方', value: personalityType[3], description: personalityType[3] === 'J' ? '判断型 (Judging)' : '知覚型 (Perceiving)' }
    ] : [];
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-8 rounded-xl shadow-xl border border-indigo-200 relative overflow-hidden">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-violet-200 rounded-full opacity-20 -mr-32 -mt-32 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-200 to-purple-200 rounded-full opacity-20 -ml-32 -mb-32 z-0"></div>
          
          {/* MBTIの装飾 */}
          <div className="absolute top-10 left-10 text-6xl font-bold text-indigo-100 opacity-20 z-0">M</div>
          <div className="absolute bottom-10 right-10 text-6xl font-bold text-purple-100 opacity-20 z-0">I</div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xl font-bold mr-4 shadow-lg">
                MBTI
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-800">MBTI診断結果</h3>
                <p className="text-indigo-600">
                  あなたの性格タイプ分析
                </p>
              </div>
            </div>
            
            {/* パーソナリティタイプの表示 */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full opacity-30 -mr-20 -mt-20"></div>
              
              <div className="flex flex-col md:flex-row items-center mb-6 relative z-10">
                <div className="w-32 h-32 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center text-4xl font-bold mb-6 md:mb-0 md:mr-8 shadow-lg transform hover:rotate-3 transition-transform duration-300">
                  {personalityType}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-indigo-800 mb-2">
                    {personalityType}型
                  </h4>
                  <p className="text-lg text-indigo-600 font-medium">
                    {description && description.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {dimensions.map((dim, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {dim.value}: {dim.description}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                  <p className="text-gray-700 leading-relaxed">
                    {description && description.full}
                  </p>
                </div>

                {result.character && (
                  <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
                    <h4 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 text-sm font-bold">キ</span>
                      キャラクター設定
                    </h4>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img
                          src={result.character.imageUrl}
                          alt="Character illustration"
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {result.character.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-100 hover:border-green-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-sm font-bold">強</span>
                  強み
                </h4>
                <ul className="list-none space-y-3">
                  {strengths && strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-red-100 hover:border-red-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-sm font-bold">弱</span>
                  弱み
                </h4>
                <ul className="list-none space-y-3">
                  {weaknesses && weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">!</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:border-blue-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">相</span>
                  相性の良いタイプ
                </h4>
                <div className="space-y-4">
                  {compatibleTypes && compatibleTypes.map((type: any, index: number) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 hover:shadow-md transition-shadow duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-blue-800">{type.type}型</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          相性 {type.compatibility}%
                        </span>
                      </div>
                      <p className="text-gray-700">{type.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 hover:border-purple-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2 text-sm font-bold">職</span>
                  キャリア適性
                </h4>
                <ul className="list-none space-y-3">
                  {careerSuggestions && careerSuggestions.map((career: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">★</span>
                      <span className="text-gray-700">{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-indigo-100 hover:border-indigo-300 transition-colors duration-300">
              <h4 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 text-sm font-bold">診</span>
                総合診断
              </h4>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 動物占いの結果表示
  else if (type === 'animalFortune') {
    // APIレスポンスの構造に合わせて、result.resultからデータを取得
    const resultData = result.result;
    if (!resultData) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          結果データが見つかりません。もう一度お試しください。
        </div>
      );
    }
    const { animal, color, animalType, characteristics, animalCharacteristic, colorCharacteristic, compatibility, advice, description, summary } = resultData;
    
    // 動物ごとの色を設定
    const animalColors: Record<string, { bg: string, text: string, gradient: string }> = {
      '虎': { bg: 'bg-amber-100', text: 'text-amber-800', gradient: 'from-amber-600 to-yellow-600' },
      '猿': { bg: 'bg-orange-100', text: 'text-orange-800', gradient: 'from-orange-600 to-amber-600' },
      '狼': { bg: 'bg-gray-100', text: 'text-gray-800', gradient: 'from-gray-600 to-slate-600' },
      '猫': { bg: 'bg-slate-100', text: 'text-slate-800', gradient: 'from-slate-600 to-gray-600' },
      '狸': { bg: 'bg-brown-100', text: 'text-yellow-800', gradient: 'from-yellow-600 to-amber-600' },
      '兎': { bg: 'bg-pink-100', text: 'text-pink-800', gradient: 'from-pink-600 to-rose-600' },
      '羊': { bg: 'bg-emerald-100', text: 'text-emerald-800', gradient: 'from-emerald-600 to-teal-600' },
      '鹿': { bg: 'bg-lime-100', text: 'text-lime-800', gradient: 'from-lime-600 to-green-600' },
      '牛': { bg: 'bg-blue-100', text: 'text-blue-800', gradient: 'from-blue-600 to-indigo-600' },
      '馬': { bg: 'bg-red-100', text: 'text-red-800', gradient: 'from-red-600 to-rose-600' },
      '象': { bg: 'bg-purple-100', text: 'text-purple-800', gradient: 'from-purple-600 to-indigo-600' },
      '鷲': { bg: 'bg-indigo-100', text: 'text-indigo-800', gradient: 'from-indigo-600 to-blue-600' }
    };
    
    // 色ごとの色を設定
    const colorStyles: Record<string, { bg: string, text: string }> = {
      '赤': { bg: 'bg-red-100', text: 'text-red-800' },
      '青': { bg: 'bg-blue-100', text: 'text-blue-800' },
      '黄': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      '緑': { bg: 'bg-green-100', text: 'text-green-800' },
      '紫': { bg: 'bg-purple-100', text: 'text-purple-800' },
      '茶': { bg: 'bg-amber-100', text: 'text-amber-800' },
      '黒': { bg: 'bg-gray-100', text: 'text-gray-800' },
      '白': { bg: 'bg-slate-100', text: 'text-slate-800' },
      '金': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      '銀': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'ピンク': { bg: 'bg-pink-100', text: 'text-pink-800' },
      'オレンジ': { bg: 'bg-orange-100', text: 'text-orange-800' }
    };
    
    // デフォルトの色
    const defaultColor = { bg: 'bg-indigo-100', text: 'text-indigo-800', gradient: 'from-indigo-600 to-blue-600' };
    const defaultColorStyle = { bg: 'bg-indigo-100', text: 'text-indigo-800' };
    
    // 該当する動物と色の色を取得
    const animalColor = animalColors[animal] || defaultColor;
    const colorStyle = colorStyles[color] || defaultColorStyle;
    
    // 動物のカラーコードを取得
    const animalColorCode = animalColor.gradient || 'from-amber-600 to-orange-600';
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8 rounded-xl shadow-xl border border-amber-200 relative overflow-hidden">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-20 -mr-32 -mt-32 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-200 to-yellow-200 rounded-full opacity-20 -ml-32 -mb-32 z-0"></div>
          
          {/* 動物の装飾 */}
          <div className="absolute top-10 left-10 text-6xl font-bold text-amber-100 opacity-20 z-0">動</div>
          <div className="absolute bottom-10 right-10 text-6xl font-bold text-orange-100 opacity-20 z-0">物</div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-lg">
                <span className="transform rotate-12">動</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-800">動物占い診断結果</h3>
                <p className="text-amber-600">
                  あなたの動物キャラクター分析
                </p>
              </div>
            </div>
            
            {/* 動物キャラクターの表示 */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-amber-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-30 -mr-20 -mt-20"></div>
              
              <div className="flex flex-col items-center mb-6 relative z-10">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${animalColorCode} text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                  {animal}
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-amber-800 mb-2">
                    {color}{animal}
                  </h4>
                  <p className="text-lg text-amber-600 font-medium">
                    {animalType}タイプ
                  </p>
                  <div className={`inline-block px-4 py-1 ${colorStyle.bg} ${colorStyle.text} rounded-full text-sm font-medium mt-2`}>
                    {color}色
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                <p className="text-gray-700 leading-relaxed text-center">
                  {description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">性</span>
                  性格特性
                </h4>
                <ul className="list-none space-y-3">
                  {characteristics && characteristics.map((trait: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                      <span className="text-gray-700">{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-300">
                <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">相</span>
                  相性
                </h4>
                <div className="space-y-4">
                  {compatibility && (
                    <>
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-green-600 mb-3 flex items-center">
                          <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">◎</span>
                          相性の良い動物
                        </h5>
                        <div className="flex flex-wrap gap-2 ml-7">
                          {compatibility.good && compatibility.good.map((item: any, index: number) => (
                            <div key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors duration-300 transform hover:scale-105">
                              {item.color}{item.animal}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-red-600 mb-3 flex items-center">
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2 text-xs">×</span>
                          相性の悪い動物
                        </h5>
                        <div className="flex flex-wrap gap-2 ml-7">
                          {compatibility.bad && compatibility.bad.map((item: any, index: number) => (
                            <div key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors duration-300 transform hover:scale-105">
                              {item.color}{item.animal}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-xl shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-300">
                <h4 className="text-xl font-semibold text-amber-700 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">診</span>
                  アドバイス
                </h4>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>

              {result.character && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                  <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 text-sm font-bold">キ</span>
                    キャラクター設定
                  </h4>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img
                        src={result.character.imageUrl}
                        alt="Character illustration"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {result.character.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // その他の占いの結果表示（デフォルト）
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">診断結果</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

// 動物占いの入力フォーム
const AnimalFortuneForm = ({ onSubmit, userId }: { onSubmit: (data: any) => void, userId?: string }) => {
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ birthdate, gender, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
          生年月日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">
          生年月日から、あなたの動物キャラクターを判定します。
        </p>
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          性別 <span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          結果を見る
        </button>
      </div>
    </form>
  );
};

// メインコンポーネント
function FortuneTestForm({ userId, compact = false }: { userId?: string, compact?: boolean }) {
  const [selectedType, setSelectedType] = useState<FortuneType | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  
  const handleTypeSelect = (type: FortuneType) => {
    setSelectedType(type);
    setResult(null);
    setSaveSuccess(false);
    setSaveError('');
    setShareUrl('');
  };
  
  const handleFormSubmit = async (data: any) => {
    if (!selectedType) return;
    
    // 結果をリセット
    setResult(null);
    setSaveError('');
    
    try {
      // APIクライアント関数を使用して結果を取得
      let response;
      
      switch (selectedType) {
        case 'numerology':
          response = await fetchNumerologyFortune(data);
          break;
        case 'fourPillars':
          response = await fetchFourPillarsFortune(data);
          break;
        case 'sanmei':
          response = await fetchSanmeiFortune(data);
          break;
        case 'mbti':
          response = await fetchMbtiFortune(data);
          break;
        case 'animalFortune':
          response = await fetchAnimalFortune(data);
          break;
        default:
          throw new Error('不明な占いタイプです');
      }
      
      if (!response) {
        throw new Error('結果データが見つかりません');
      }
      
      if (!response.success) {
        throw new Error(response.error || '診断結果の取得に失敗しました');
      }
      
      // 結果を設定
      const resultData = response.result;
      setResult(resultData);

      // MBTIと動物占いの場合はキャラクターを生成
      if ((selectedType === 'mbti' || selectedType === 'animalFortune') && resultData) {
        try {
          const characterResult = await generateCharacter(selectedType, resultData);
          if (characterResult.success) {
            if (characterResult.result) {
              setResult({
                ...resultData,
                character: {
                  description: characterResult.result.description,
                  imageUrl: characterResult.result.imageUrl
                }
              });
            }
          }
        } catch (error) {
          console.error('キャラクター生成エラー:', error);
        }
      }
    } catch (error) {
      console.error('エラー詳細:', error);
      setSaveError(`診断結果の取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };
  
  const handleSaveResult = async () => {
    if (!result || !selectedType) return;
    
    setIsSaving(true);
    setSaveError('');
    
    try {
      // APIクライアント関数を使用して結果を保存
      const saveData = {
        type: selectedType,
        result: result, // 既にhandleFormSubmitで実際の結果データを設定済み
        userId,
      };
      
      const saveResult = await saveFortuneResult(saveData);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || '結果の保存に失敗しました');
      }
      
      setSaveSuccess(true);
      
      // 共有用URLを生成
      if (saveResult.result && saveResult.result.id) {
        setShareUrl(`${window.location.origin}/fortune/share/${saveResult.result.id}`);
      }
    } catch (error) {
      console.error('エラー:', error);
      setSaveError('結果の保存に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setSaveSuccess(false);
    setSaveError('');
    setShareUrl('');
  };
  
  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('共有URLをコピーしました！');
  };
  
  // コンパクトモード用のスタイル
  const compactStyles = {
    container: compact ? "p-4" : "p-6 max-w-4xl mx-auto",
    title: compact ? "text-xl" : "text-2xl",
    grid: compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6",
    cardSize: compact ? "p-4" : "p-6",
    iconSize: compact ? "w-16 h-16 text-2xl" : "w-20 h-20 text-3xl",
  };
  
  return (
    <div className={`bg-white shadow-md rounded-lg ${compactStyles.container}`}>
      <h2 className={`${compactStyles.title} font-bold text-gray-800 mb-6`}>占い・診断テスト</h2>
      
      {!selectedType && !result && (
        <div className="space-y-6">
          <p className="text-gray-700">
            以下の占いや診断テストから、試してみたいものを選んでください。
          </p>
          <div className={`grid ${compactStyles.grid}`}>
            {fortuneTypes.map((type) => {
              // 占いタイプごとの色とアイコンを設定
              const typeStyles: Record<string, { bg: string, gradient: string, shadow: string }> = {
                'numerology': {
                  bg: 'bg-indigo-50',
                  gradient: 'from-indigo-500 to-purple-500',
                  shadow: 'shadow-indigo-200'
                },
                'fourPillars': {
                  bg: 'bg-amber-50',
                  gradient: 'from-amber-500 to-red-500',
                  shadow: 'shadow-amber-200'
                },
                'sanmei': {
                  bg: 'bg-blue-50',
                  gradient: 'from-blue-500 to-cyan-500',
                  shadow: 'shadow-blue-200'
                },
                'mbti': {
                  bg: 'bg-emerald-50',
                  gradient: 'from-emerald-500 to-teal-500',
                  shadow: 'shadow-emerald-200'
                },
                'animalFortune': {
                  bg: 'bg-orange-50',
                  gradient: 'from-orange-500 to-amber-500',
                  shadow: 'shadow-orange-200'
                }
              };
              
              const style = typeStyles[type.id] || {
                bg: 'bg-gray-50',
                gradient: 'from-gray-500 to-slate-500',
                shadow: 'shadow-gray-200'
              };
              
              return (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id as FortuneType)}
                  className={`${style.bg} rounded-xl ${compactStyles.cardSize} text-left hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group ${style.shadow} border border-transparent hover:border-${type.id === 'numerology' ? 'indigo' : type.id === 'fourPillars' ? 'amber' : type.id === 'sanmei' ? 'blue' : type.id === 'mbti' ? 'emerald' : 'orange'}-200`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* カスタムアイコン */}
                  {type.id === 'numerology' && (
                    <div className={`${compactStyles.iconSize} rounded-full bg-gradient-to-r ${style.gradient} text-white flex items-center justify-center font-bold mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <span className="transform group-hover:scale-110 transition-transform duration-300">数</span>
                    </div>
                  )}
                  {type.id === 'fourPillars' && (
                    <div className={`${compactStyles.iconSize} rounded-full bg-gradient-to-r ${style.gradient} text-white flex items-center justify-center font-bold mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <span className="transform group-hover:scale-110 transition-transform duration-300">四</span>
                    </div>
                  )}
                  {type.id === 'sanmei' && (
                    <div className={`${compactStyles.iconSize} rounded-full bg-gradient-to-r ${style.gradient} text-white flex items-center justify-center font-bold mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <span className="transform group-hover:scale-110 transition-transform duration-300">算</span>
                    </div>
                  )}
                  {type.id === 'mbti' && (
                    <div className={`${compactStyles.iconSize} rounded-full bg-gradient-to-r ${style.gradient} text-white flex items-center justify-center font-bold mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <span className="transform group-hover:scale-110 transition-transform duration-300">MBTI</span>
                    </div>
                  )}
                  {type.id === 'animalFortune' && (
                    <div className={`${compactStyles.iconSize} rounded-full bg-gradient-to-r ${style.gradient} text-white flex items-center justify-center font-bold mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <span className="transform group-hover:scale-110 transition-transform duration-300">動</span>
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors duration-300">{type.name}</h3>
                  {!compact && (
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{type.description}</p>
                  )}
                  
                  <div className={`absolute bottom-0 right-0 w-32 h-32 -mb-16 -mr-16 rounded-full bg-gradient-to-br ${style.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform group-hover:scale-110 transition-transform duration-300`}></div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {selectedType && !result && (
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedType(null)}
              className="mr-4 text-indigo-600 hover:text-indigo-800"
            >
              ← 戻る
            </button>
            <h3 className="text-xl font-semibold text-gray-800">
              {fortuneTypes.find(t => t.id === selectedType)?.name}
            </h3>
          </div>
          
          {saveError && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
              {saveError}
            </div>
          )}
          
          {selectedType === 'numerology' && (
            <NumerologyForm onSubmit={handleFormSubmit} userId={userId} />
          )}
          
          {selectedType === 'fourPillars' && (
            <FourPillarsForm onSubmit={handleFormSubmit} userId={userId} />
          )}
          
          {selectedType === 'sanmei' && (
            <SanmeiForm onSubmit={handleFormSubmit} userId={userId} />
          )}
          
          {selectedType === 'mbti' && (
            <MbtiForm onSubmit={handleFormSubmit} userId={userId} />
          )}
          
          {selectedType === 'animalFortune' && (
            <AnimalFortuneForm onSubmit={handleFormSubmit} userId={userId} />
          )}
          
          {!compact && (
            <div className="mt-4 text-center">
              <Link href="/fortune" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                占い一覧に戻る
              </Link>
            </div>
          )}
        </div>
      )}
      
      {result && result.success && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center">
              <button
                onClick={handleReset}
                className="mr-4 text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                新しい診断を開始
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {fortuneTypes.find(t => t.id === selectedType)?.name}の結果
              </h3>
              {!compact && (
                <Link href="/fortune" className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  占い一覧に戻る
                </Link>
              )}
            </div>
          </div>
          
          {/* 結果表示 */}
          <FortuneResultDisplay type={selectedType} result={result} />
          
          {/* 保存と共有のセクション */}
          <div className="space-y-6">
            {/* 保存ボタン */}
            <div className="flex justify-end">
              {!saveSuccess && (
                <button
                  onClick={handleSaveResult}
                  disabled={isSaving}
                  className={`px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? '保存中...' : '結果を保存する'}
                </button>
              )}
            </div>

            {/* シェアボタン */}
            {saveSuccess && shareUrl && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
                <ShareButtons
                  url={shareUrl}
                  title={`${fortuneTypes.find(t => t.id === selectedType)?.name}の診断結果`}
                  description={`才能鑑定AIで${fortuneTypes.find(t => t.id === selectedType)?.name}の診断を行いました！`}
                  imageUrl={result?.character?.imageUrl}
                />
              </div>
            )}
          </div>
          
          {saveSuccess && (
            <div className="p-4 bg-green-100 text-green-700 rounded-md">
              結果が正常に保存されました。マイページから確認できます。
            </div>
          )}
          
          {saveError && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {saveError}
            </div>
          )}
          
          {!compact && (
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/fortune" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                占い一覧に戻る
              </Link>
              
              {userId && (
                <Link href="/mypage" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  マイページで保存した結果を見る
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default FortuneTestForm;
