import { NextResponse } from 'next/server';

/**
 * POST /api/parse/number
 * 数値解析を行うエンドポイント
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const data = await request.json();
    
    // バリデーション
    if (!data || !data.name) {
      return NextResponse.json(
        { error: '解析に必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // 実際のプロジェクトでは、ここで本物の解析エンジンを呼び出します
    // このモックでは、ランダムなデータを生成して返します
    
    // 遅延をシミュレート（解析処理の時間）
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // モックの解析結果を生成
    const analysisResult = generateMockNumberAnalysis(data);
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result: analysisResult,
    });
  } catch (error) {
    console.error('数値解析エラー:', error);
    return NextResponse.json(
      { error: '数値解析の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * モックの数値解析結果を生成する関数
 */
function generateMockNumberAnalysis(data: any) {
  // 入力データに基づいて、一貫性のあるランダムな結果を生成
  const nameHash = hashString(data.name); // 名前からハッシュ値を生成
  
  // パフォーマンススコアの基本値（60〜95の範囲）
  const basePerformanceScore = 60 + (nameHash % 36);
  
  // 各カテゴリのスコア（基本値の±15%の範囲でランダム）
  const generateCategoryScore = () => {
    const variance = basePerformanceScore * 0.15;
    return Math.min(100, Math.max(40, Math.round(basePerformanceScore + (Math.random() * 2 - 1) * variance)));
  };
  
  // 時系列データ（過去6ヶ月のパフォーマンス推移）
  const generateTimeSeriesData = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const startValue = basePerformanceScore - 10;
    
    return months.map((month, index) => {
      // 徐々に向上するトレンドを作成（ランダム要素あり）
      const improvement = index * 2 + (Math.random() * 4 - 2);
      const value = Math.min(100, Math.max(40, Math.round(startValue + improvement)));
      return { month, value };
    });
  };
  
  // 強みと弱みの分析
  const strengths = [];
  const weaknesses = [];
  
  // 入力データから強みと弱みを取得（存在する場合）
  if (data.strengths && Array.isArray(data.strengths)) {
    strengths.push(...data.strengths);
  }
  
  if (data.weaknesses && Array.isArray(data.weaknesses)) {
    weaknesses.push(...data.weaknesses);
  }
  
  // 足りない場合はデフォルト値を追加
  const defaultStrengths = ['分析力', 'コミュニケーション力', 'リーダーシップ', '創造性', '問題解決能力'];
  const defaultWeaknesses = ['優柔不断', '完璧主義', '批判に弱い', '過度な自己批判', '過度な競争心'];
  
  while (strengths.length < 3) {
    const randomStrength = defaultStrengths[Math.floor(Math.random() * defaultStrengths.length)];
    if (!strengths.includes(randomStrength)) {
      strengths.push(randomStrength);
    }
  }
  
  while (weaknesses.length < 2) {
    const randomWeakness = defaultWeaknesses[Math.floor(Math.random() * defaultWeaknesses.length)];
    if (!weaknesses.includes(randomWeakness)) {
      weaknesses.push(randomWeakness);
    }
  }
  
  // 解析結果オブジェクトを作成
  return {
    performanceScore: basePerformanceScore,
    categoryScores: {
      leadership: generateCategoryScore(),
      communication: generateCategoryScore(),
      technicalSkills: generateCategoryScore(),
      problemSolving: generateCategoryScore(),
      teamwork: generateCategoryScore(),
      creativity: generateCategoryScore(),
    },
    timeSeriesData: generateTimeSeriesData(),
    strengths,
    weaknesses,
    recommendations: [
      '定期的なフィードバックセッションを設けることで、コミュニケーションスキルをさらに向上させることができます。',
      'チーム内での役割を明確にし、リーダーシップを発揮する機会を増やすことが効果的です。',
      '新しい技術トレーニングに参加することで、専門知識を深めることができます。',
    ],
    potentialScore: Math.min(100, basePerformanceScore + 10 + Math.floor(Math.random() * 5)),
  };
}

/**
 * 文字列からシンプルなハッシュ値を生成する関数
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}