import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 結果を保存するディレクトリ
const RESULTS_DIR = path.join(process.cwd(), 'data', 'fortune-results');

export async function POST(request: Request) {
  try {
    const { resultIds } = await request.json();
    
    if (!resultIds || !Array.isArray(resultIds) || resultIds.length < 2) {
      return NextResponse.json(
        { error: '比較するには2つ以上の結果IDが必要です' },
        { status: 400 }
      );
    }
    
    const results = [];
    
    // 各結果を取得
    for (const resultId of resultIds) {
      const filePath = path.join(RESULTS_DIR, `${resultId}.json`);
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: `結果ID ${resultId} が見つかりません` },
          { status: 404 }
        );
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const result = JSON.parse(fileContent);
      results.push(result);
    }
    
    // 結果の比較分析
    const comparison = analyzeResults(results);
    
    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error('比較分析エラー:', error);
    return NextResponse.json(
      { error: '結果の比較中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 結果を比較分析する関数
function analyzeResults(results: any[]) {
  // 結果のタイプに基づいて適切な比較を行う
  const firstResult = results[0];
  const type = firstResult.type;
  
  switch (type) {
    case 'numerology':
      return compareNumerology(results);
    case 'fourPillars':
      return compareFourPillars(results);
    case 'sanmei':
      return compareSanmei(results);
    case 'mbti':
      return compareMbti(results);
    case 'animalFortune':
      return compareAnimalFortune(results);
    default:
      return {
        message: '未対応の占いタイプです',
        results: results.map(r => ({ id: r.id, type: r.type })),
      };
  }
}

// 数秘術の結果を比較する関数
function compareNumerology(results: any[]) {
  const comparison = {
    type: 'numerology',
    title: '数秘術比較分析',
    users: results.map(r => ({
      id: r.id,
      name: r.result.result.name || '名前なし',
      destinyNumber: r.result.result.destinyNumber,
      personalityNumber: r.result.result.personalityNumber,
      soulNumber: r.result.result.soulNumber,
    })),
    compatibility: [],
    analysis: '',
    teamSuggestion: '',
  };
  
  // 相性分析
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const user1 = comparison.users[i];
      const user2 = comparison.users[j];
      
      // 運命数の相性を計算（例: 差が小さいほど相性が良い）
      const destinyDiff = Math.abs(user1.destinyNumber - user2.destinyNumber);
      const compatibilityScore = 100 - (destinyDiff * 10);
      
      comparison.compatibility.push({
        user1: user1.name,
        user2: user2.name,
        score: Math.max(0, compatibilityScore),
        comment: getCompatibilityComment(compatibilityScore),
      });
    }
  }
  
  // 全体分析
  comparison.analysis = `${comparison.users.length}人の数秘術診断結果を比較しました。`;
  
  // チーム編成の提案
  comparison.teamSuggestion = generateTeamSuggestion(comparison.users, comparison.compatibility);
  
  return comparison;
}

// 相性コメントを取得する関数
function getCompatibilityComment(score: number) {
  if (score >= 90) return '非常に相性が良いです。互いに補完し合える関係です。';
  if (score >= 70) return '相性が良いです。協力することで高い成果が期待できます。';
  if (score >= 50) return '普通の相性です。コミュニケーションを大切にすることで関係が向上します。';
  if (score >= 30) return 'やや相性に課題があります。互いの違いを理解することが重要です。';
  return '相性に注意が必要です。異なる価値観や考え方を尊重し合うことが大切です。';
}

// チーム編成の提案を生成する関数
function generateTeamSuggestion(users: any[], compatibility: any[]) {
  if (users.length < 3) {
    return '効果的なチーム編成の提案には3人以上の診断結果が必要です。';
  }
  
  // 相性スコアの平均が高いユーザーを見つける
  const userScores = users.map(user => {
    const userCompatibilities = compatibility.filter(c => 
      c.user1 === user.name || c.user2 === user.name
    );
    
    const avgScore = userCompatibilities.reduce((sum, c) => sum + c.score, 0) / userCompatibilities.length;
    
    return {
      name: user.name,
      avgScore,
    };
  });
  
  // 相性スコアでソート
  userScores.sort((a, b) => b.avgScore - a.avgScore);
  
  // チーム編成の提案
  let suggestion = '相性分析に基づくチーム編成の提案：\n\n';
  
  // リーダー候補
  const leaderCandidates = userScores.slice(0, Math.min(2, userScores.length));
  suggestion += `リーダー候補: ${leaderCandidates.map(u => u.name).join('、')}\n`;
  
  // チームメンバー
  suggestion += `チームメンバー: ${userScores.slice(2).map(u => u.name).join('、')}\n\n`;
  
  // 協業のアドバイス
  suggestion += '効果的な協業のためのアドバイス：\n';
  suggestion += '- 定期的なコミュニケーションを心がけましょう\n';
  suggestion += '- お互いの強みを活かし、弱みをサポートし合いましょう\n';
  suggestion += '- 意見の相違があった場合は、建設的な議論を心がけましょう\n';
  
  return suggestion;
}

// MBTIの結果を比較する関数
function compareMbti(results: any[]) {
  const comparison = {
    type: 'mbti',
    title: 'MBTI比較分析',
    users: results.map(r => ({
      id: r.id,
      name: r.result.result.name || '名前なし',
      personalityType: r.result.result.personalityType,
      strengths: r.result.result.strengths,
      weaknesses: r.result.result.weaknesses,
    })),
    compatibility: [],
    analysis: '',
    teamSuggestion: '',
  };
  
  // MBTIタイプの相性マトリックス（簡易版）
  const mbtiCompatibility: Record<string, Record<string, number>> = {
    'INTJ': { 'ENFP': 90, 'ENTP': 85, 'INFJ': 75, 'INFP': 70 },
    'INTP': { 'ENFJ': 90, 'ENTJ': 85, 'INFJ': 70, 'ENFP': 65 },
    'ENTJ': { 'INFP': 90, 'INTP': 85, 'ENFJ': 70, 'ENTP': 65 },
    'ENTP': { 'INFJ': 90, 'INTJ': 85, 'ENFJ': 70, 'INFP': 65 },
    'INFJ': { 'ENTP': 90, 'ENFP': 85, 'INTJ': 75, 'INTP': 70 },
    'INFP': { 'ENTJ': 90, 'ENFJ': 85, 'INTJ': 70, 'ENTP': 65 },
    'ENFJ': { 'INTP': 90, 'INFP': 85, 'ENTJ': 70, 'ENTP': 65 },
    'ENFP': { 'INTJ': 90, 'INFJ': 85, 'INTP': 65, 'INFP': 60 },
    'ISTJ': { 'ESFP': 85, 'ESTP': 80, 'ISFJ': 75, 'ESTJ': 70 },
    'ISFJ': { 'ESTP': 85, 'ESFP': 80, 'ISTJ': 75, 'ESTJ': 70 },
    'ESTJ': { 'ISFP': 85, 'ISTP': 80, 'ISTJ': 70, 'ISFJ': 65 },
    'ESFJ': { 'ISTP': 85, 'ISFP': 80, 'ISFJ': 70, 'ISTJ': 65 },
    'ISTP': { 'ESFJ': 85, 'ESTJ': 80, 'ISFP': 75, 'ESTP': 70 },
    'ISFP': { 'ESTJ': 85, 'ESFJ': 80, 'ISTP': 75, 'ESFP': 70 },
    'ESTP': { 'ISFJ': 85, 'ISTJ': 80, 'ISTP': 70, 'ISFP': 65 },
    'ESFP': { 'ISTJ': 85, 'ISFJ': 80, 'ISFP': 70, 'ISTP': 65 },
  };
  
  // 相性分析
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const user1 = comparison.users[i];
      const user2 = comparison.users[j];
      
      // MBTIタイプの相性を計算
      let compatibilityScore = 50; // デフォルトの相性スコア
      
      const type1 = user1.personalityType;
      const type2 = user2.personalityType;
      
      if (type1 && type2) {
        if (mbtiCompatibility[type1] && mbtiCompatibility[type1][type2]) {
          compatibilityScore = mbtiCompatibility[type1][type2];
        } else if (mbtiCompatibility[type2] && mbtiCompatibility[type2][type1]) {
          compatibilityScore = mbtiCompatibility[type2][type1];
        } else {
          // 同じタイプ同士は相性が良い
          if (type1 === type2) {
            compatibilityScore = 75;
          } else {
            // 共通する文字数に基づいて相性を計算
            let commonChars = 0;
            for (let k = 0; k < 4; k++) {
              if (type1[k] === type2[k]) {
                commonChars++;
              }
            }
            compatibilityScore = 50 + (commonChars * 10);
          }
        }
      }
      
      comparison.compatibility.push({
        user1: user1.name,
        user2: user2.name,
        score: compatibilityScore,
        comment: getMbtiCompatibilityComment(type1, type2, compatibilityScore),
      });
    }
  }
  
  // 全体分析
  comparison.analysis = `${comparison.users.length}人のMBTI診断結果を比較しました。`;
  
  // チーム編成の提案
  comparison.teamSuggestion = generateMbtiTeamSuggestion(comparison.users, comparison.compatibility);
  
  return comparison;
}

// MBTIの相性コメントを取得する関数
function getMbtiCompatibilityComment(type1: string, type2: string, score: number) {
  if (score >= 90) return `${type1}と${type2}は理想的な相性です。互いの強みを補完し合える関係です。`;
  if (score >= 70) return `${type1}と${type2}は良い相性です。異なる視点を持ちながらも協力できます。`;
  if (score >= 50) return `${type1}と${type2}は普通の相性です。コミュニケーションを意識することで関係が向上します。`;
  return `${type1}と${type2}は相性に課題があります。互いの違いを理解し尊重することが重要です。`;
}

// MBTIに基づくチーム編成の提案を生成する関数
function generateMbtiTeamSuggestion(users: any[], compatibility: any[]) {
  if (users.length < 3) {
    return '効果的なチーム編成の提案には3人以上の診断結果が必要です。';
  }
  
  // MBTIタイプの分類
  const analysts = users.filter(u => ['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(u.personalityType));
  const diplomats = users.filter(u => ['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(u.personalityType));
  const sentinels = users.filter(u => ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(u.personalityType));
  const explorers = users.filter(u => ['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(u.personalityType));
  
  // チーム編成の提案
  let suggestion = 'MBTIタイプに基づくチーム編成の提案：\n\n';
  
  // リーダー候補
  const leaderCandidates = [...analysts.filter(u => u.personalityType.startsWith('E')), ...diplomats.filter(u => u.personalityType.startsWith('E'))];
  suggestion += `リーダー候補: ${leaderCandidates.map(u => `${u.name}(${u.personalityType})`).join('、') || 'なし'}\n`;
  
  // 戦略立案担当
  suggestion += `戦略立案担当: ${analysts.map(u => `${u.name}(${u.personalityType})`).join('、') || 'なし'}\n`;
  
  // チームビルディング担当
  suggestion += `チームビルディング担当: ${diplomats.map(u => `${u.name}(${u.personalityType})`).join('、') || 'なし'}\n`;
  
  // 実行・管理担当
  suggestion += `実行・管理担当: ${sentinels.map(u => `${u.name}(${u.personalityType})`).join('、') || 'なし'}\n`;
  
  // 問題解決担当
  suggestion += `問題解決担当: ${explorers.map(u => `${u.name}(${u.personalityType})`).join('、') || 'なし'}\n\n`;
  
  // 協業のアドバイス
  suggestion += '効果的な協業のためのアドバイス：\n';
  suggestion += '- 各メンバーのMBTIタイプに基づく強みを活かしましょう\n';
  suggestion += '- 意思決定の際は、異なるタイプの視点を取り入れましょう\n';
  suggestion += '- コミュニケーションスタイルの違いを理解し、調整しましょう\n';
  
  return suggestion;
}

// 四柱推命の結果を比較する関数
function compareFourPillars(results: any[]) {
  // 四柱推命の比較ロジック（簡易版）
  return { 
    type: 'fourPillars', 
    title: '四柱推命比較分析',
    users: results.map(r => ({
      id: r.id,
      name: r.result.result.name || '名前なし',
      elements: r.result.result.elements,
      pillars: r.result.result.pillars,
    })),
    compatibility: [],
    analysis: `${results.length}人の四柱推命診断結果を比較しました。`,
    teamSuggestion: '四柱推命に基づくチーム編成の提案は現在開発中です。'
  };
}

// 算命学の結果を比較する関数
function compareSanmei(results: any[]) {
  // 算命学の比較ロジック（簡易版）
  return { 
    type: 'sanmei', 
    title: '算命学比較分析',
    users: results.map(r => ({
      id: r.id,
      name: r.result.result.name || '名前なし',
      mainStar: r.result.result.mainStar,
      bodyStar: r.result.result.bodyStar,
      spiritStar: r.result.result.spiritStar,
    })),
    compatibility: [],
    analysis: `${results.length}人の算命学診断結果を比較しました。`,
    teamSuggestion: '算命学に基づくチーム編成の提案は現在開発中です。'
  };
}

// 動物占いの結果を比較する関数
function compareAnimalFortune(results: any[]) {
  const comparison = {
    type: 'animalFortune',
    title: '動物占い比較分析',
    users: results.map(r => ({
      id: r.id,
      name: r.result.result.name || '名前なし',
      animal: r.result.result.animal,
      color: r.result.result.color,
      animalType: r.result.result.animalType,
    })),
    compatibility: [],
    analysis: '',
    teamSuggestion: '',
  };
  
  // 動物占いの相性マトリックス（簡易版）
  const animalCompatibility: Record<string, string[]> = {
    '虎': ['猿', '狼', '猫'],
    '猿': ['虎', '狸', '兎'],
    '狼': ['虎', '羊', '鹿'],
    '猫': ['虎', '牛', '馬'],
    '狸': ['猿', '兎', '羊'],
    '兎': ['猿', '狸', '鹿'],
    '羊': ['狼', '狸', '牛'],
    '鹿': ['狼', '兎', '馬'],
    '牛': ['猫', '羊', '象'],
    '馬': ['猫', '鹿', '鷲'],
    '象': ['牛', '鷲'],
    '鷲': ['馬', '象'],
  };
  
  // 相性分析
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const user1 = comparison.users[i];
      const user2 = comparison.users[j];
      
      // 動物の相性を計算
      let compatibilityScore = 50; // デフォルトの相性スコア
      
      const animal1 = user1.animal;
      const animal2 = user2.animal;
      
      if (animal1 && animal2) {
        // 同じ動物同士は相性が良い
        if (animal1 === animal2) {
          compatibilityScore = 80;
        } 
        // 相性の良い動物かどうかをチェック
        else if (animalCompatibility[animal1] && animalCompatibility[animal1].includes(animal2)) {
          compatibilityScore = 90;
        } else if (animalCompatibility[animal2] && animalCompatibility[animal2].includes(animal1)) {
          compatibilityScore = 90;
        } else {
          compatibilityScore = 60;
        }
        
        // 色が同じ場合はボーナス
        if (user1.color === user2.color) {
          compatibilityScore += 10;
        }
      }
      
      comparison.compatibility.push({
        user1: user1.name,
        user2: user2.name,
        score: Math.min(100, compatibilityScore),
        comment: getAnimalCompatibilityComment(animal1, animal2, compatibilityScore),
      });
    }
  }
  
  // 全体分析
  comparison.analysis = `${comparison.users.length}人の動物占い診断結果を比較しました。`;
  
  // チーム編成の提案
  comparison.teamSuggestion = generateAnimalTeamSuggestion(comparison.users, comparison.compatibility);
  
  return comparison;
}

// 動物占いの相性コメントを取得する関数
function getAnimalCompatibilityComment(animal1: string, animal2: string, score: number) {
  if (score >= 90) return `${animal1}と${animal2}は理想的な相性です。互いに良い影響を与え合えます。`;
  if (score >= 70) return `${animal1}と${animal2}は良い相性です。協力することで高い成果が期待できます。`;
  if (score >= 50) return `${animal1}と${animal2}は普通の相性です。コミュニケーションを大切にしましょう。`;
  return `${animal1}と${animal2}は相性に課題があります。互いの特性を理解することが重要です。`;
}

// 動物占いに基づくチーム編成の提案を生成する関数
function generateAnimalTeamSuggestion(users: any[], compatibility: any[]) {
  if (users.length < 3) {
    return '効果的なチーム編成の提案には3人以上の診断結果が必要です。';
  }
  
  // 動物タイプの分類
  const leaders = users.filter(u => ['虎', '狼', '鷲'].includes(u.animal));
  const supporters = users.filter(u => ['猿', '猫', '羊'].includes(u.animal));
  const creatives = users.filter(u => ['狸', '兎', '鹿'].includes(u.animal));
  const stabilizers = users.filter(u => ['牛', '馬', '象'].includes(u.animal));
  
  // チーム編成の提案
  let suggestion = '動物占いに基づくチーム編成の提案：\n\n';
  
  // リーダー候補
  suggestion += `リーダー候補: ${leaders.map(u => `${u.name}(${u.color}${u.animal})`).join('、') || 'なし'}\n`;
  
  // サポート役
  suggestion += `サポート役: ${supporters.map(u => `${u.name}(${u.color}${u.animal})`).join('、') || 'なし'}\n`;
  
  // クリエイティブ担当
  suggestion += `クリエイティブ担当: ${creatives.map(u => `${u.name}(${u.color}${u.animal})`).join('、') || 'なし'}\n`;
  
  // 安定化担当
  suggestion += `安定化担当: ${stabilizers.map(u => `${u.name}(${u.color}${u.animal})`).join('、') || 'なし'}\n\n`;
  
  // 協業のアドバイス
  suggestion += '効果的な協業のためのアドバイス：\n';
  suggestion += '- 各メンバーの動物特性を活かした役割分担を行いましょう\n';
  suggestion += '- 相性の良いメンバー同士でペアを組んで作業を進めましょう\n';
  suggestion += '- 異なる色の特性を理解し、多様な視点を取り入れましょう\n';
  
  return suggestion;
}