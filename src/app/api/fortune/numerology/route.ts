import { NextResponse } from 'next/server';

/**
 * POST /api/fortune/numerology
 * 数秘術の診断を行うエンドポイント
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const data = await request.json();
    
    // バリデーション
    if (!data || !data.name || !data.birthdate) {
      return NextResponse.json(
        { error: '診断に必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // 数秘術の計算を行う
    const result = calculateNumerology(data.name, data.birthdate);
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('数秘術診断エラー:', error);
    return NextResponse.json(
      { error: '数秘術診断の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 数秘術の計算を行う関数
 * @param name 名前
 * @param birthdate 生年月日
 * @returns 数秘術の診断結果
 */
function calculateNumerology(name: string, birthdate: string) {
  // 生年月日から運命数を計算
  const birthdateObj = new Date(birthdate);
  const day = birthdateObj.getDate();
  const month = birthdateObj.getMonth() + 1;
  const year = birthdateObj.getFullYear();
  
  // 各桁の数字を足し合わせて一桁になるまで計算
  const calculateSingleDigit = (num: number): number => {
    if (num <= 9) return num;
    return calculateSingleDigit(
      num
        .toString()
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0)
    );
  };
  
  // 生年月日の各数字を足し合わせる
  const dateSum = day + month + calculateSingleDigit(year);
  const destinyNumber = calculateSingleDigit(dateSum);
  
  // 名前から個性数を計算（簡易版）
  const nameValue = name
    .split('')
    .reduce((sum, char) => sum + (char.charCodeAt(0) % 9 || 9), 0);
  const personalityNumber = calculateSingleDigit(nameValue);
  
  // 魂の数（運命数と個性数の合計）
  const soulNumber = calculateSingleDigit(destinyNumber + personalityNumber);
  
  // 相性の良い数
  const compatibility = [
    ((destinyNumber + 1) % 9) || 9,
    ((destinyNumber + 3) % 9) || 9,
    ((destinyNumber + 5) % 9) || 9,
  ];
  
  // 運命数の説明
  const destinyDescriptions: Record<number, string> = {
    1: '情熱的でリーダーシップがあり、独立心が強い性格です。目標に向かって突き進む力があります。',
    2: '協調性があり、繊細で思いやりのある性格です。人間関係を大切にし、調和を重んじます。',
    3: '創造性豊かで表現力があり、社交的な性格です。明るく前向きな姿勢で人を魅了します。',
    4: '実務的で勤勉、安定を求める性格です。地道な努力を惜しまず、確実に成果を上げます。',
    5: '自由を愛し、変化を求める冒険的な性格です。好奇心旺盛で、新しい経験を楽しみます。',
    6: '責任感が強く、家族や周囲の人を大切にする性格です。調和と美を重んじ、奉仕の精神があります。',
    7: '分析力に優れ、知的好奇心が強い性格です。深い洞察力で物事の本質を見抜きます。',
    8: '現実的で実行力があり、目標達成に向けて努力する性格です。組織力と管理能力に優れています。',
    9: '博愛精神があり、思いやりと寛容さを持つ性格です。精神的な成長を重視し、人々を助けることに喜びを感じます。',
  };
  
  // 個性数の説明
  const personalityDescriptions: Record<number, string> = {
    1: '自信に満ち、独立心が強く、リーダーシップを発揮します。',
    2: '協力的で思いやりがあり、人間関係を大切にします。',
    3: '創造的で表現力豊かな性格で、コミュニケーション能力に優れています。',
    4: '実務的で信頼性があり、地道な努力を惜しみません。',
    5: '冒険心があり、自由を愛し、変化を楽しむ柔軟性があります。',
    6: '責任感が強く、面倒見が良く、調和を重んじます。',
    7: '分析力と直感力に優れ、内省的で知的好奇心が旺盛です。',
    8: '実行力と決断力があり、目標達成に向けて努力します。',
    9: '理想主義的で寛容、広い視野を持ち、人々を助けることに喜びを感じます。',
  };
  
  // 魂の数の説明
  const soulDescriptions: Record<number, string> = {
    1: '自己実現と独立を求める魂です。自分の道を切り開くことに喜びを感じます。',
    2: '協力と調和を求める魂です。人との絆を深めることに喜びを感じます。',
    3: '自己表現と創造性を求める魂です。芸術や表現活動に喜びを感じます。',
    4: '安定と秩序を求める魂です。着実に物事を進めることに喜びを感じます。',
    5: '自由と変化を求める魂です。新しい経験や冒険に喜びを感じます。',
    6: '責任と奉仕を求める魂です。人の役に立つことに喜びを感じます。',
    7: '知恵と真理を求める魂です。学びや探究に喜びを感じます。',
    8: '成功と達成を求める魂です。目標を達成することに喜びを感じます。',
    9: '愛と調和を求める魂です。世界の平和と調和に貢献することに喜びを感じます。',
  };
  
  // 結果を返す
  return {
    name,
    destinyNumber,
    personalityNumber,
    soulNumber,
    compatibility,
    destinyDescription: destinyDescriptions[destinyNumber],
    personalityDescription: personalityDescriptions[personalityNumber],
    soulDescription: soulDescriptions[soulNumber],
    summary: `${name}さんは、運命数${destinyNumber}、個性数${personalityNumber}、魂の数${soulNumber}を持っています。
運命数${destinyNumber}の特徴として、${destinyDescriptions[destinyNumber]}
個性数${personalityNumber}の特徴として、${personalityDescriptions[personalityNumber]}
魂の数${soulNumber}の特徴として、${soulDescriptions[soulNumber]}
相性の良い数は${compatibility.join('、')}です。これらの数を持つ人とは特に良い関係を築くことができるでしょう。`,
  };
}