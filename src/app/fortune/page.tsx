import FortuneTestForm from '@/components/forms/FortuneTestForm';

export const metadata = {
  title: '占い・診断テスト | 才能鑑定AI',
  description: '数秘術、四柱推命、算命学、MBTI、動物占いなど、様々な占いや診断テストを試すことができます。',
};

export default function FortunePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            占い・診断テスト
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            様々な占いや診断テストを試して、自分自身の特性や相性を知ることができます。
            結果は保存して、いつでも見返すことができます。
          </p>
        </div>

        <FortuneTestForm />
        
        <div className="mt-16 bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-lg font-medium text-white">
              占い・診断テストについて
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">数秘術</h3>
                <p className="mt-2 text-gray-600">
                  数秘術は、名前の画数や生年月日から運命数を計算し、その人の性格や運命を読み解く占いです。
                  古代ギリシャの哲学者ピタゴラスが考案したとされ、数字には特別な意味があるとされています。
                  運命数、個性数、魂の数などから、あなたの本質や人生の目的を知ることができます。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">四柱推命</h3>
                <p className="mt-2 text-gray-600">
                  四柱推命は、生年月日と生まれた時間から、その人の運命や性格を占う中国の伝統的な占術です。
                  「四柱」とは、年柱・月柱・日柱・時柱の4つの柱のことで、それぞれに天干（てんかん）と地支（ちし）が割り当てられます。
                  これらの組み合わせから、その人の性格や運勢、相性などを読み解きます。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">算命学</h3>
                <p className="mt-2 text-gray-600">
                  算命学は、陰陽五行説や十干・十二支を用いた日本の伝統的な占術です。
                  生年月日から「主星」「体星」「心星」などを算出し、その人の性格や運勢を読み解きます。
                  特に相性や適職、運気の流れなどを詳しく知ることができます。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">MBTI</h3>
                <p className="mt-2 text-gray-600">
                  MBTIは、カール・ユングの心理学理論を基にして開発された性格診断テストです。
                  外向型(E)・内向型(I)、感覚型(S)・直感型(N)、思考型(T)・感情型(F)、判断型(J)・知覚型(P)の
                  4つの指標の組み合わせから、16タイプの性格に分類します。
                  自分の性格の特徴や強み、弱み、適職などを知ることができます。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">動物占い</h3>
                <p className="mt-2 text-gray-600">
                  動物占いは、生年月日からその人の性格を動物に例える占いです。
                  12種類の動物と12色の組み合わせで、その人の性格や行動パターン、相性などを読み解きます。
                  直感的で分かりやすく、人間関係や職場での活かし方などを知ることができます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}