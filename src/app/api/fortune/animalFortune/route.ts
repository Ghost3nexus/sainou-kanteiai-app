import { NextResponse } from 'next/server';

/**
 * POST /api/fortune/animalFortune
 * 動物占いの診断を行うエンドポイント
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const data = await request.json();
    
    // バリデーション
    if (!data || !data.birthdate) {
      return NextResponse.json(
        { error: '診断に必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // 動物占いの計算を行う
    const result = calculateAnimalFortune(data.birthdate, data.gender);
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('動物占い診断エラー:', error);
    return NextResponse.json(
      { error: '動物占い診断の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 動物占いの計算を行う関数
 * @param birthdate 生年月日
 * @param gender 性別（任意）
 * @returns 動物占いの診断結果
 */
function calculateAnimalFortune(birthdate: string, gender?: string) {
  // 生年月日をパース
  const birthdateObj = new Date(birthdate);
  const year = birthdateObj.getFullYear();
  const month = birthdateObj.getMonth() + 1;
  const day = birthdateObj.getDate();
  
  // 生年月日から数値を計算（簡易版）
  const dateValue = (year % 100) + month + day;
  
  // 動物と色の決定
  const animals = [
    'たぬき', 'ひつじ', 'さる', 'こあら', 'とら', 'ぺんぎん', 
    'ちょう', 'おおかみ', 'らいおん', 'ぞう', 'うさぎ', 'りゅう'
  ];
  
  const colors = [
    '赤', '青', '黄', '緑', '紫', '黒', '白', '茶', 'オレンジ', 'ピンク', '金', '銀'
  ];
  
  const types = [
    '社交型', '慎重型', '行動型', '協調型', '指導型', '創造型', '論理型', '感情型'
  ];
  
  // 動物、色、タイプを決定（生年月日に基づく）
  const animalIndex = dateValue % animals.length;
  const colorIndex = (month * day) % colors.length;
  const typeIndex = ((year % 100) + day) % types.length;
  
  const animal = animals[animalIndex];
  const color = colors[colorIndex];
  const animalType = types[typeIndex];
  
  // 性格特性（タイプに基づく）
  const characteristicsMap: Record<string, string[]> = {
    '社交型': [
      '人とのコミュニケーションを楽しみます',
      '明るく前向きな性格です',
      '新しい出会いを大切にします',
      '協調性があり、チームワークに優れています',
      '場の雰囲気を明るくする力があります'
    ],
    '慎重型': [
      '物事を慎重に考え、計画的に行動します',
      '細部に注意を払い、ミスが少ないです',
      '信頼性が高く、約束を守ります',
      '安定を重視し、急な変化を好みません',
      '堅実な判断力を持っています'
    ],
    '行動型': [
      '行動力があり、すぐに実行に移します',
      '目標に向かって積極的に進みます',
      '決断力があり、迷いが少ないです',
      '困難にも立ち向かう勇気があります',
      'エネルギッシュで活動的です'
    ],
    '協調型': [
      '周囲との調和を大切にします',
      '思いやりがあり、人の気持ちを理解します',
      '協力して物事を進めるのが得意です',
      '争いを好まず、平和を求めます',
      '人の話をよく聞き、共感する力があります'
    ],
    '指導型': [
      'リーダーシップがあり、周囲を導く力があります',
      '責任感が強く、任された仕事をやり遂げます',
      '目標達成に向けて努力を惜しみません',
      '組織力があり、チームをまとめる力があります',
      '決断力と実行力を兼ね備えています'
    ],
    '創造型': [
      '創造性豊かで、新しいアイデアを生み出します',
      '想像力が豊かで、独創的な発想ができます',
      '芸術的センスがあります',
      '好奇心旺盛で、新しいことに挑戦します',
      '柔軟な思考ができます'
    ],
    '論理型': [
      '論理的思考に優れ、物事を分析的に捉えます',
      '客観的な視点で状況を判断します',
      '問題解決能力に優れています',
      '知的好奇心が強く、学ぶことを楽しみます',
      '合理的な判断ができます'
    ],
    '感情型': [
      '感受性が豊かで、感情表現が豊かです',
      '人の気持ちを理解するのが得意です',
      '直感力に優れています',
      '芸術や音楽などの感性を必要とする分野に適性があります',
      '共感力があり、人との絆を大切にします'
    ]
  };
  
  // 動物の特性
  const animalCharacteristics: Record<string, string> = {
    'たぬき': '賢く機転が利き、臨機応変に対応できます。好奇心旺盛で、新しいことに興味を持ちます。',
    'ひつじ': '温厚で優しく、周囲との調和を大切にします。協調性があり、チームワークに優れています。',
    'さる': '知的好奇心が強く、様々なことに挑戦します。社交的で、コミュニケーション能力に優れています。',
    'こあら': '穏やかで落ち着いた性格です。マイペースで、自分のリズムを大切にします。',
    'とら': '勇敢で決断力があり、リーダーシップを発揮します。目標に向かって積極的に行動します。',
    'ぺんぎん': '忍耐強く、困難にも立ち向かう力があります。協調性があり、集団行動が得意です。',
    'ちょう': '自由を愛し、美しいものに惹かれます。創造性豊かで、芸術的センスがあります。',
    'おおかみ': '忠誠心が強く、仲間を大切にします。直感力に優れ、状況判断が的確です。',
    'らいおん': '威厳があり、周囲から尊敬されます。責任感が強く、任された仕事をやり遂げます。',
    'ぞう': '記憶力に優れ、経験から学ぶ力があります。忍耐強く、長期的な視点で物事を考えます。',
    'うさぎ': '機敏で行動力があります。直感力に優れ、素早い判断ができます。',
    'りゅう': '強い意志と情熱を持っています。創造性豊かで、大きな目標に向かって努力します。'
  };
  
  // 色の特性
  const colorCharacteristics: Record<string, string> = {
    '赤': '情熱的でエネルギッシュ。行動力があり、目標に向かって積極的に進みます。',
    '青': '冷静で論理的。物事を客観的に捉え、合理的な判断ができます。',
    '黄': '明るく前向き。社交的で、周囲を明るくする力があります。',
    '緑': '調和と成長を象徴。安定を求め、周囲との調和を大切にします。',
    '紫': '神秘的で直感力に優れています。創造性豊かで、芸術的センスがあります。',
    '黒': '力強さと威厳を象徴。意志が強く、目標達成に向けて努力します。',
    '白': '純粋で誠実。正直で、信頼関係を大切にします。',
    '茶': '安定と信頼を象徴。実用的で、地に足のついた判断ができます。',
    'オレンジ': '活力と社交性を象徴。明るく社交的で、人との交流を楽しみます。',
    'ピンク': '優しさと思いやりを象徴。感受性豊かで、人の気持ちを理解します。',
    '金': '成功と豊かさを象徴。目標達成に向けて努力し、成功を収めます。',
    '銀': '知性と洞察力を象徴。冷静な判断力と適応力があります。'
  };
  
  // 相性の良い・悪い動物
  const getCompatibility = (animalName: string) => {
    const compatibilityMap: Record<string, { good: string[], bad: string[] }> = {
      'たぬき': { good: ['さる', 'ちょう'], bad: ['とら', 'おおかみ'] },
      'ひつじ': { good: ['こあら', 'ぺんぎん'], bad: ['らいおん', 'りゅう'] },
      'さる': { good: ['たぬき', 'ちょう'], bad: ['おおかみ', 'ぞう'] },
      'こあら': { good: ['ひつじ', 'うさぎ'], bad: ['とら', 'りゅう'] },
      'とら': { good: ['らいおん', 'りゅう'], bad: ['たぬき', 'こあら'] },
      'ぺんぎん': { good: ['ひつじ', 'ぞう'], bad: ['ちょう', 'うさぎ'] },
      'ちょう': { good: ['たぬき', 'さる'], bad: ['ぺんぎん', 'おおかみ'] },
      'おおかみ': { good: ['とら', 'らいおん'], bad: ['さる', 'ちょう'] },
      'らいおん': { good: ['とら', 'おおかみ'], bad: ['ひつじ', 'うさぎ'] },
      'ぞう': { good: ['ぺんぎん', 'りゅう'], bad: ['さる', 'うさぎ'] },
      'うさぎ': { good: ['こあら', 'ちょう'], bad: ['らいおん', 'ぞう'] },
      'りゅう': { good: ['とら', 'ぞう'], bad: ['ひつじ', 'こあら'] }
    };
    
    const compatibility = compatibilityMap[animalName] || { good: [], bad: [] };
    
    return {
      good: compatibility.good.map(animal => ({
        animal,
        color: colors[Math.floor(Math.random() * colors.length)]
      })),
      bad: compatibility.bad.map(animal => ({
        animal,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    };
  };
  
  // アドバイス（タイプに基づく）
  const adviceMap: Record<string, string> = {
    '社交型': `${color}${animal}の社交性を活かして、人とのつながりを大切にしましょう。コミュニケーションを通じて、新しい可能性が広がります。`,
    '慎重型': `${color}${animal}の慎重さを活かして、計画的に行動しましょう。細部に注意を払うことで、確実に目標を達成できます。`,
    '行動型': `${color}${animal}の行動力を活かして、積極的に挑戦しましょう。行動することで、新たな可能性が広がります。`,
    '協調型': `${color}${animal}の協調性を活かして、チームワークを大切にしましょう。周囲との調和を保ちながら、共に成長していくことができます。`,
    '指導型': `${color}${animal}のリーダーシップを活かして、周囲を導く役割を担いましょう。責任感を持って行動することで、信頼を得ることができます。`,
    '創造型': `${color}${animal}の創造性を活かして、新しいアイデアを積極的に提案しましょう。独創的な発想が、周囲に新たな風を吹き込みます。`,
    '論理型': `${color}${animal}の論理的思考を活かして、物事を分析的に捉えましょう。客観的な視点で状況を判断することで、適切な解決策を見つけることができます。`,
    '感情型': `${color}${animal}の感受性を活かして、人の気持ちを理解することを大切にしましょう。共感力が、人との絆を深めます。`
  };
  
  // 結果を返す
  return {
    animal,
    color,
    type: animalType,
    characteristics: characteristicsMap[animalType],
    animalCharacteristic: animalCharacteristics[animal],
    colorCharacteristic: colorCharacteristics[color],
    compatibility: getCompatibility(animal),
    advice: adviceMap[animalType],
    description: `あなたは${color}${animal}（${animalType}タイプ）です。
${animalCharacteristics[animal]}
${colorCharacteristics[color]}
${animalType}タイプの特徴として、${characteristicsMap[animalType].join('、')}などが挙げられます。`,
    summary: `${color}${animal}（${animalType}タイプ）の特徴を活かして、自分らしく生きていくことが大切です。
相性の良い動物は${getCompatibility(animal).good.map(g => g.color + g.animal).join('、')}です。
${adviceMap[animalType]}`
  };
}