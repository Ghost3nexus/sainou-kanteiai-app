import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 結果データを保存しているディレクトリ
const RESULTS_DIR = path.join('/tmp', 'fortune-results');

interface AnalyticsData {
  totalTests: number;
  testTypeDistribution: Record<string, number>;
  mbtiDistribution: Record<string, number>;
  animalDistribution: Record<string, { total: number; byColor: Record<string, number> }>;
  averageAge: number;
  genderDistribution: Record<string, number>;
  timeOfDayDistribution: Record<string, number>;
  monthlyTrends: Record<string, number>;
  compatibilityStats: {
    mbti: Record<string, { matches: number; averageScore: number }>;
    animal: Record<string, { matches: number; averageScore: number }>;
  };
}

export async function GET() {
  try {
    // 分析データの初期化
    const analytics: AnalyticsData = {
      totalTests: 0,
      testTypeDistribution: {},
      mbtiDistribution: {},
      animalDistribution: {},
      averageAge: 0,
      genderDistribution: {},
      timeOfDayDistribution: {},
      monthlyTrends: {},
      compatibilityStats: {
        mbti: {},
        animal: {}
      }
    };

    // 結果ファイルが存在しない場合は空のデータを返す
    if (!fs.existsSync(RESULTS_DIR)) {
      return NextResponse.json(analytics);
    }

    // すべての結果ファイルを読み込む
    const files = fs.readdirSync(RESULTS_DIR);
    let totalAge = 0;
    let ageCount = 0;

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(RESULTS_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // 総テスト数をカウント
      analytics.totalTests++;

      // テストタイプの分布を集計
      analytics.testTypeDistribution[data.type] = (analytics.testTypeDistribution[data.type] || 0) + 1;

      // テストタイプ別の詳細分析
      switch (data.type) {
        case 'mbti':
          const personalityType = data.result.personalityType;
          analytics.mbtiDistribution[personalityType] = (analytics.mbtiDistribution[personalityType] || 0) + 1;
          break;

        case 'animalFortune':
          const animal = data.result.animal;
          const color = data.result.color;
          if (!analytics.animalDistribution[animal]) {
            analytics.animalDistribution[animal] = { total: 0, byColor: {} };
          }
          analytics.animalDistribution[animal].total++;
          analytics.animalDistribution[animal].byColor[color] = 
            (analytics.animalDistribution[animal].byColor[color] || 0) + 1;
          break;
      }

      // 年齢データの集計（生年月日から計算）
      if (data.result.birthdate) {
        const birthDate = new Date(data.result.birthdate);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        totalAge += age;
        ageCount++;
      }

      // 性別分布の集計
      if (data.result.gender) {
        analytics.genderDistribution[data.result.gender] = 
          (analytics.genderDistribution[data.result.gender] || 0) + 1;
      }

      // 時間帯分布の集計
      const createdAt = new Date(data.createdAt);
      const hour = createdAt.getHours();
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      analytics.timeOfDayDistribution[timeSlot] = 
        (analytics.timeOfDayDistribution[timeSlot] || 0) + 1;

      // 月別トレンドの集計
      const monthYear = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      analytics.monthlyTrends[monthYear] = 
        (analytics.monthlyTrends[monthYear] || 0) + 1;
    }

    // 平均年齢の計算
    analytics.averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;

    // データを時系列順にソート
    analytics.monthlyTrends = Object.fromEntries(
      Object.entries(analytics.monthlyTrends).sort(([a], [b]) => a.localeCompare(b))
    );

    // 時間帯分布を時間順にソート
    analytics.timeOfDayDistribution = Object.fromEntries(
      Object.entries(analytics.timeOfDayDistribution).sort(([a], [b]) => a.localeCompare(b))
    );

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('分析データの取得エラー:', error);
    return NextResponse.json(
      { error: '分析データの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}