import Link from 'next/link';
import DashboardChart from '@/components/ui/DashboardChart';

export const metadata = {
  title: 'ダッシュボード | 才能鑑定AI',
  description: '個人の才能や適性の統計情報や傾向分析を確認できるダッシュボード',
};

// モックデータ
const departmentPerformanceData = {
  labels: ['営業部', '技術開発部', 'マーケティング部', '人事部', '財務部', 'カスタマーサポート部'],
  datasets: [
    {
      label: 'パフォーマンススコア',
      data: [78, 82, 75, 86, 80, 88],
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1,
    },
  ],
};

const personalityDistributionData = {
  labels: ['分析型', '外交型', '管理型', '探索型'],
  datasets: [
    {
      label: '従業員数',
      data: [42, 28, 35, 15],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
      borderWidth: 1,
    },
  ],
};

const skillGapData = {
  labels: ['リーダーシップ', 'コミュニケーション', '技術スキル', '問題解決', '創造性', '適応力'],
  datasets: [
    {
      label: '現在のスキルレベル',
      data: [65, 75, 80, 72, 68, 70],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
      fill: true,
    },
    {
      label: '目標スキルレベル',
      data: [85, 90, 90, 85, 80, 85],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
      fill: true,
    },
  ],
};

const teamCompatibilityData = {
  labels: ['チームA', 'チームB', 'チームC', 'チームD', 'チームE'],
  datasets: [
    {
      label: '相性スコア',
      data: [92, 78, 85, 90, 72],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgb(153, 102, 255)',
      borderWidth: 1,
    },
  ],
};

const performanceTrendData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '全社平均',
      data: [72, 75, 74, 78, 82, 85],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            才能分析ダッシュボード
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500">
            あなたの才能や適性の統計情報や傾向分析を確認できます
          </p>
        </div>

        {/* フィルターと期間選択 */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">データフィルター</h2>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              設定
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリーフィルター
              </label>
              <select
                id="category-filter"
                name="category-filter"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">すべて</option>
                <option value="numerology">数秘術</option>
                <option value="mbti">MBTI</option>
                <option value="animalFortune">動物占い</option>
                <option value="skills">スキル分析</option>
                <option value="personality">性格診断</option>
              </select>
            </div>
            <div>
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                期間
              </label>
              <select
                id="date-range"
                name="date-range"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="last-month">過去1ヶ月</option>
                <option value="last-quarter">過去3ヶ月</option>
                <option value="last-half">過去6ヶ月</option>
                <option value="last-year" selected>過去1年</option>
                <option value="custom">カスタム期間</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                フィルターを適用
              </button>
            </div>
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">診断実施回数</h3>
            <p className="text-3xl font-bold text-indigo-600">12</p>
            <p className="text-sm text-gray-500 mt-1">前月比 +5%</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">才能スコア</h3>
            <p className="text-3xl font-bold text-indigo-600">82%</p>
            <p className="text-sm text-gray-500 mt-1">前月比 +3%</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">適性マッチ度</h3>
            <p className="text-3xl font-bold text-indigo-600">78%</p>
            <p className="text-sm text-gray-500 mt-1">前月比 +2%</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">成長ポテンシャル</h3>
            <p className="text-3xl font-bold text-indigo-600">85%</p>
            <p className="text-sm text-gray-500 mt-1">前月比 +8%</p>
          </div>
        </div>

        {/* チャートグリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DashboardChart
            type="bar"
            data={departmentPerformanceData}
            title="カテゴリー別才能スコア"
            height={300}
            className="col-span-1"
          />
          <DashboardChart
            type="pie"
            data={personalityDistributionData}
            title="性格タイプ分布"
            height={300}
            className="col-span-1"
          />
          <DashboardChart
            type="radar"
            data={skillGapData}
            title="スキルギャップ分析"
            height={300}
            className="col-span-1"
          />
          <DashboardChart
            type="bar"
            data={teamCompatibilityData}
            title="適性マッチング分析"
            height={300}
            className="col-span-1"
          />
          <DashboardChart
            type="line"
            data={performanceTrendData}
            title="才能スコア推移"
            height={300}
            className="col-span-2"
          />
        </div>

        {/* 最近の診断結果 */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-lg font-medium text-white">最近の才能診断結果</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    名前
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    診断タイプ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    診断日
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    才能スコア
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    詳細
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    山田 太郎
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    数秘術
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025/03/05
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      85%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <a href="#">詳細を見る</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    佐藤 花子
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    MBTI
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025/03/04
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      92%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <a href="#">詳細を見る</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    鈴木 一郎
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    動物占い
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025/03/03
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      78%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <a href="#">詳細を見る</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    田中 健太
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    数秘術
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025/03/02
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      65%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <a href="#">詳細を見る</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    伊藤 美咲
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    MBTI
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025/03/01
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      88%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <a href="#">詳細を見る</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              5件中 1-5件を表示
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled
              >
                前へ
              </button>
              <button
                type="button"
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                次へ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}