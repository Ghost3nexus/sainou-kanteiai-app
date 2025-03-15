import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                あなたの才能を最大限に引き出す
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                才能鑑定AIは、あなたの隠れた才能や適性を科学的に分析し、可能性を最大限に引き出す革新的なWebアプリケーションです。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/analysis"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8"
                >
                  診断を始める
                </Link>
                <Link
                  href="/fortune"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-800 bg-pink-100 hover:bg-pink-200 md:py-4 md:text-lg md:px-8"
                >
                  占い・診断テスト
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 md:py-4 md:text-lg md:px-8"
                >
                  詳細を見る
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md overflow-hidden rounded-lg shadow-xl">
                <iframe
                  className="w-full h-64 md:h-80"
                  src="https://www.youtube.com/embed/dr8_D59XxMw"
                  title="未来リーディング紹介動画"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              才能鑑定AIの特徴
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              科学的アプローチと直感的なインターフェースで、人材育成を次のレベルへ
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* 特徴1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">数値解析</h3>
              <p className="text-gray-600">
                従業員のパフォーマンスデータを多角的に分析し、客観的な評価指標を提供します。トレンド分析や比較分析も可能です。
              </p>
            </div>

            {/* 特徴2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">相性診断</h3>
              <p className="text-gray-600">
                チームメンバー間の相性を科学的に分析し、最適なチーム編成や協業パターンを提案します。組織の生産性向上に貢献します。
              </p>
            </div>

            {/* 特徴3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">育成プラン</h3>
              <p className="text-gray-600">
                個々の従業員の強みと弱みを分析し、パーソナライズされた育成プランを自動生成。効率的なスキルアップをサポートします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用方法セクション */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              簡単3ステップで始める
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              未来リーディングは直感的な操作で、すぐに活用できます
            </p>
          </div>

          <div className="relative">
            {/* 接続線 */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* ステップ1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">情報入力</h3>
                <p className="text-gray-600">
                  従業員の基本情報と診断に必要なデータを入力します。既存のデータをインポートすることも可能です。
                </p>
              </div>

              {/* ステップ2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">解析実行</h3>
                <p className="text-gray-600">
                  AIが入力データを分析し、数値解析、時空間解析、心理診断などの多角的な視点から評価を行います。
                </p>
              </div>

              {/* ステップ3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">結果確認</h3>
                <p className="text-gray-600">
                  直感的なグラフやチャートで結果を確認。具体的な改善提案や育成プランも自動生成されます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
            今すぐ才能鑑定AIを始めましょう
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            従業員の潜在能力を引き出し、最適なチーム編成と育成プランで組織のパフォーマンスを向上させましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analysis"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:text-lg"
            >
              無料で診断を始める
            </Link>
            <Link
              href="/fortune"
              className="inline-flex items-center justify-center px-8 py-4 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 md:text-lg"
            >
              占い・診断テストを試す
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
