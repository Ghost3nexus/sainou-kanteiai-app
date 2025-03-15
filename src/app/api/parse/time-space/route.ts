import { NextResponse } from 'next/server';

/**
 * POST /api/parse/time-space
 * 時空間解析を行うエンドポイント
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // モックの解析結果を生成
    const analysisResult = generateMockTimeSpaceAnalysis(data);
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result: analysisResult,
    });
  } catch (error) {
    console.error('時空間解析エラー:', error);
    return NextResponse.json(
      { error: '時空間解析の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * モックの時空間解析結果を生成する関数
 */
function generateMockTimeSpaceAnalysis(data: any) {
  // 入力データに基づいて、一貫性のあるランダムな結果を生成
  const nameHash = hashString(data.name); // 名前からハッシュ値を生成
  
  // 基本的な適応性スコア（60〜95の範囲）
  const baseAdaptabilityScore = 60 + (nameHash % 36);
  
  // 各環境での適応性スコア（基本値の±15%の範囲でランダム）
  const generateEnvironmentScore = () => {
    const variance = baseAdaptabilityScore * 0.15;
    return Math.min(100, Math.max(40, Math.round(baseAdaptabilityScore + (Math.random() * 2 - 1) * variance)));
  };
  
  // 時間帯別のパフォーマンス
  const timePerformance = [
    { time: '午前（9:00-12:00）', score: generateEnvironmentScore() },
    { time: '午後（13:00-16:00）', score: generateEnvironmentScore() },
    { time: '夕方（16:00-19:00）', score: generateEnvironmentScore() },
  ];
  
  // 最適な時間帯を特定
  const optimalTimeIndex = timePerformance.reduce(
    (maxIndex, current, index, array) => 
      current.score > array[maxIndex].score ? index : maxIndex, 
    0
  );
  
  // 環境別のパフォーマンス
  const environmentPerformance = [
    { environment: 'オフィス（デスクワーク）', score: generateEnvironmentScore() },
    { environment: 'オフィス（会議・打ち合わせ）', score: generateEnvironmentScore() },
    { environment: 'リモートワーク', score: generateEnvironmentScore() },
    { environment: '出張・外回り', score: generateEnvironmentScore() },
  ];
  
  // 最適な環境を特定
  const optimalEnvironmentIndex = environmentPerformance.reduce(
    (maxIndex, current, index, array) => 
      current.score > array[maxIndex].score ? index : maxIndex, 
    0
  );
  
  // チーム規模別のパフォーマンス
  const teamSizePerformance = [
    { size: '小規模（1-3人）', score: generateEnvironmentScore() },
    { size: '中規模（4-10人）', score: generateEnvironmentScore() },
    { size: '大規模（11人以上）', score: generateEnvironmentScore() },
  ];
  
  // 最適なチーム規模を特定
  const optimalTeamSizeIndex = teamSizePerformance.reduce(
    (maxIndex, current, index, array) => 
      current.score > array[maxIndex].score ? index : maxIndex, 
    0
  );
  
  // 季節別のパフォーマンス
  const seasonalPerformance = [
    { season: '春（3-5月）', score: generateEnvironmentScore() },
    { season: '夏（6-8月）', score: generateEnvironmentScore() },
    { season: '秋（9-11月）', score: generateEnvironmentScore() },
    { season: '冬（12-2月）', score: generateEnvironmentScore() },
  ];
  
  // 最適な季節を特定
  const optimalSeasonIndex = seasonalPerformance.reduce(
    (maxIndex, current, index, array) => 
      current.score > array[maxIndex].score ? index : maxIndex, 
    0
  );
  
  // 解析結果オブジェクトを作成
  return {
    adaptabilityScore: baseAdaptabilityScore,
    timePerformance,
    optimalTime: timePerformance[optimalTimeIndex].time,
    environmentPerformance,
    optimalEnvironment: environmentPerformance[optimalEnvironmentIndex].environment,
    teamSizePerformance,
    optimalTeamSize: teamSizePerformance[optimalTeamSizeIndex].size,
    seasonalPerformance,
    optimalSeason: seasonalPerformance[optimalSeasonIndex].season,
    recommendations: [
      `${timePerformance[optimalTimeIndex].time}の時間帯に重要なタスクをスケジュールすることで、パフォーマンスを最大化できます。`,
      `${environmentPerformance[optimalEnvironmentIndex].environment}環境での作業が最も効果的です。可能な限りこの環境を活用しましょう。`,
      `${teamSizePerformance[optimalTeamSizeIndex].size}のチーム構成で最高のパフォーマンスを発揮します。プロジェクト編成の参考にしてください。`,
    ],
    adaptabilityTrend: [
      { month: '1月', value: 70 + Math.floor(Math.random() * 10) },
      { month: '2月', value: 72 + Math.floor(Math.random() * 10) },
      { month: '3月', value: 75 + Math.floor(Math.random() * 10) },
      { month: '4月', value: 73 + Math.floor(Math.random() * 10) },
      { month: '5月', value: 78 + Math.floor(Math.random() * 10) },
      { month: '6月', value: 80 + Math.floor(Math.random() * 10) },
    ],
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