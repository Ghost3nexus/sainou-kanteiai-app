import { NextResponse } from 'next/server';

/**
 * POST /api/fortune/fourPillars
 * 四柱推命の診断を行うエンドポイント
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const data = await request.json();
    
    // バリデーション
    if (!data || !data.birthdate || !data.birthtime || !data.gender) {
      return NextResponse.json(
        { error: '診断に必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // 四柱推命の計算を行う
    const result = calculateFourPillars(data.birthdate, data.birthtime, data.gender);
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('四柱推命診断エラー:', error);
    return NextResponse.json(
      { error: '四柱推命診断の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 四柱推命の計算を行う関数
 * @param birthdate 生年月日
 * @param birthtime 生まれた時間
 * @param gender 性別
 * @returns 四柱推命の診断結果
 */
function calculateFourPillars(birthdate: string, birthtime: string, gender: string) {
  // 生年月日と時間をパース
  const birthdateObj = new Date(birthdate);
  const year = birthdateObj.getFullYear();
  const month = birthdateObj.getMonth() + 1;
  const day = birthdateObj.getDate();
  
  // 時間をパース（HH:MM形式）
  const [hour, minute] = birthtime.split(':').map(Number);
  
  // 天干（じっかん）と地支（じゅうにし）の配列
  const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 五行（ごぎょう）
  const elements = ['木', '火', '土', '金', '水'];
  
  // 年柱、月柱、日柱、時柱の計算（簡易版）
  // 実際の四柱推命ではもっと複雑な計算が必要
  
  // 年柱（生まれた年）
  const yearStem = heavenlyStems[(year - 4) % 10];
  const yearBranch = earthlyBranches[(year - 4) % 12];
  const yearElement = getElement(yearStem, yearBranch);
  
  // 月柱（生まれた月）
  const monthOffset = (year % 10) * 2 + month;
  const monthStem = heavenlyStems[monthOffset % 10];
  const monthBranch = earthlyBranches[(month + 1) % 12];
  const monthElement = getElement(monthStem, monthBranch);
  
  // 日柱（生まれた日）
  // 日干支の計算は非常に複雑なため、ここでは簡易的に計算
  const dayOffset = Math.floor(year * 5.6 + month * 8.2 + day) % 60;
  const dayStem = heavenlyStems[dayOffset % 10];
  const dayBranch = earthlyBranches[dayOffset % 12];
  const dayElement = getElement(dayStem, dayBranch);
  
  // 時柱（生まれた時間）
  const timeIndex = Math.floor(hour / 2) % 12;
  const timeOffset = (dayOffset % 10) * 12 + timeIndex;
  const timeStem = heavenlyStems[timeOffset % 10];
  const timeBranch = earthlyBranches[timeIndex];
  const timeElement = getElement(timeStem, timeBranch);
  
  // 四柱の配列
  const pillars = [
    { heavenlyStem: yearStem, earthlyBranch: yearBranch, element: yearElement },
    { heavenlyStem: monthStem, earthlyBranch: monthBranch, element: monthElement },
    { heavenlyStem: dayStem, earthlyBranch: dayBranch, element: dayElement },
    { heavenlyStem: timeStem, earthlyBranch: timeBranch, element: timeElement }
  ];
  
  // 五行のバランスを計算
  const elementCount = calculateElementBalance(pillars);
  
  // 性格特性を決定（五行のバランスに基づく）
  const characteristics = determineCharacteristics(elementCount, gender);
  
  // 強みと弱みを決定
  const { strengths, weaknesses } = determineStrengthsAndWeaknesses(elementCount, gender);
  
  // 人生の方向性
  const lifeDirection = determineLifeDirection(pillars, gender);
  
  // 相性の良い天干地支
  const compatibility = determineCompatibility(pillars);
  
  // 総合診断
  const summary = generateSummary(pillars, elementCount, gender);
  
  // 結果を返す
  return {
    birthdate,
    birthtime,
    gender,
    pillars,
    elements: elementCount,
    characteristics,
    strengths,
    weaknesses,
    lifeDirection,
    compatibility,
    summary
  };
}

// 天干地支から五行を取得する関数
function getElement(stem: string, branch: string) {
  // 天干の五行
  const stemElements: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  
  // 地支の五行
  const branchElements: Record<string, string> = {
    '子': '水', '丑': '土',
    '寅': '木', '卯': '木',
    '辰': '土', '巳': '火',
    '午': '火', '未': '土',
    '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
  };
  
  // 組み合わせて主な五行を返す（簡易版）
  return stemElements[stem] || branchElements[branch] || '土';
}

// 五行のバランスを計算する関数
function calculateElementBalance(pillars: any[]) {
  const elementCount: Record<string, number> = {
    '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
  };
  
  // 各柱の五行をカウント
  pillars.forEach(pillar => {
    elementCount[pillar.element] += 1;
  });
  
  // パーセンテージに変換
  const total = Object.values(elementCount).reduce((sum, count) => sum + count, 0);
  const elementPercentage: Record<string, number> = {};
  
  Object.entries(elementCount).forEach(([element, count]) => {
    elementPercentage[element] = Math.round(count / total * 100);
  });
  
  return elementPercentage;
}

// 性格特性を決定する関数
function determineCharacteristics(elementCount: Record<string, number>, gender: string) {
  // 最も強い五行を特定
  const dominantElement = Object.entries(elementCount)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // 五行ごとの性格特性（男女別）
  const characteristicsMap: Record<string, string[]> = {
    '木': [
      '創造性が高く、成長を好みます',
      '正義感が強く、公平さを重んじます',
      '計画的で、目標達成に向けて努力します',
      '新しいことに挑戦する意欲があります',
      '柔軟性と適応力に優れています'
    ],
    '火': [
      '情熱的で、エネルギッシュです',
      '社交的で、人との交流を楽しみます',
      '直感力に優れ、決断が早いです',
      '表現力豊かで、創造的です',
      '明るく楽観的な性格です'
    ],
    '土': [
      '誠実で、信頼性があります',
      '実務的で、地に足がついています',
      '安定を重視し、忍耐強いです',
      '思いやりがあり、人の世話をすることが得意です',
      '責任感が強く、義務を果たします'
    ],
    '金': [
      '論理的で、分析力に優れています',
      '正確さと効率を重視します',
      '決断力があり、リーダーシップがあります',
      '原則を守り、規律を重んじます',
      '完璧主義の傾向があります'
    ],
    '水': [
      '知的好奇心が強く、深い思考を好みます',
      '直感力と洞察力に優れています',
      '適応力があり、変化に対応できます',
      'コミュニケーション能力が高いです',
      '記憶力に優れ、学習能力が高いです'
    ]
  };
  
  // 性格特性を返す
  return characteristicsMap[dominantElement] || [];
}

// 強みと弱みを決定する関数
function determineStrengthsAndWeaknesses(elementCount: Record<string, number>, gender: string) {
  // 最も強い五行と最も弱い五行を特定
  const sortedElements = Object.entries(elementCount).sort((a, b) => b[1] - a[1]);
  const dominantElement = sortedElements[0][0];
  const weakestElement = sortedElements[4][0];
  
  // 五行ごとの強み
  const strengthsMap: Record<string, string[]> = {
    '木': [
      '創造性と革新性',
      '成長志向と向上心',
      '適応力と柔軟性',
      '計画立案能力',
      '公平さと正義感'
    ],
    '火': [
      '情熱と活力',
      '社交性とコミュニケーション能力',
      '直感力と決断力',
      '創造性と表現力',
      '楽観性と熱意'
    ],
    '土': [
      '信頼性と誠実さ',
      '実用的な問題解決能力',
      '忍耐力と粘り強さ',
      '責任感と献身',
      '思いやりと共感力'
    ],
    '金': [
      '論理的思考と分析力',
      '効率性と整理能力',
      'リーダーシップと決断力',
      '精度と完璧主義',
      '規律と原則'
    ],
    '水': [
      '知的好奇心と学習意欲',
      '直感力と洞察力',
      '適応力と柔軟性',
      'コミュニケーション能力',
      '記憶力と集中力'
    ]
  };
  
  // 五行ごとの弱み
  const weaknessesMap: Record<string, string[]> = {
    '木': [
      '頑固さと強情さ',
      '競争心が強すぎる場合がある',
      '計画変更に抵抗することがある',
      '理想主義に走りすぎる傾向',
      '批判的になりすぎることがある'
    ],
    '火': [
      '短気で衝動的になることがある',
      '落ち着きがなく、集中力が散漫になりやすい',
      '過度に楽観的になることがある',
      '感情的になりすぎる傾向',
      '刺激を求めすぎる場合がある'
    ],
    '土': [
      '変化に抵抗する保守的な傾向',
      '優柔不断になることがある',
      '心配性で不安になりやすい',
      '他者に依存しすぎる場合がある',
      '物質的な安定を過度に重視する'
    ],
    '金': [
      '批判的で冷たく見られることがある',
      '完璧主義で柔軟性に欠ける場合がある',
      '感情表現が苦手なことがある',
      '権威主義的になりすぎる傾向',
      '過度に現実的で創造性が制限される'
    ],
    '水': [
      '内向的で引きこもりがちになる',
      '過度に思考的で行動が遅れる',
      '不安や恐怖に囚われやすい',
      '秘密主義で人を信頼しにくい',
      '現実逃避的な傾向がある'
    ]
  };
  
  // 結果を返す
  return {
    strengths: strengthsMap[dominantElement] || [],
    weaknesses: weaknessesMap[weakestElement] || []
  };
}

// 人生の方向性を決定する関数
function determineLifeDirection(pillars: any[], gender: string) {
  // 日柱（自分自身を表す）と時柱（将来を表す）から方向性を導く
  const dayStem = pillars[2].heavenlyStem;
  const dayBranch = pillars[2].earthlyBranch;
  const timeStem = pillars[3].heavenlyStem;
  
  // 天干の組み合わせから方向性を決定（簡易版）
  const directions: Record<string, string> = {
    '甲甲': '自己実現と独立の道を進むべきです。リーダーシップを発揮し、新しい分野を開拓していくことで成功します。',
    '甲乙': '創造性を活かした仕事や、自然と調和する分野で力を発揮できます。',
    '甲丙': 'クリエイティブな分野や、情熱を活かした活動で成功できるでしょう。',
    '甲丁': '人と協力しながら新しいプロジェクトを推進する役割に適しています。',
    '甲戊': '安定した基盤を作りながら、新しいアイデアを形にしていく道が開けています。',
    '甲己': '社会貢献や教育分野で、あなたの創造性を活かせるでしょう。',
    '甲庚': '革新的なアイデアを実用的な形にしていく分野で力を発揮できます。',
    '甲辛': '芸術や美的センスを要する分野、または分析力を活かした職業が適しています。',
    '甲壬': '先見性と創造性を組み合わせた分野で成功できるでしょう。',
    '甲癸': '直感と創造性を活かした分野で、独自の道を切り開けます。',
    
    '乙甲': '協力的な環境で、あなたの細やかな感性を活かせる道が開けています。',
    '乙乙': '芸術や美的センスを要する分野、またはカウンセリングなどの対人支援の仕事が適しています。',
    '乙丙': '創造性とコミュニケーション能力を活かした分野で成功できるでしょう。',
    '乙丁': '人との絆を大切にする仕事や、精神的な成長を支援する活動が向いています。',
    '乙戊': '安定を求めながらも、細やかな配慮を必要とする分野で力を発揮できます。',
    '乙己': '教育や福祉など、人を支援する分野であなたの才能を活かせるでしょう。',
    '乙庚': '細部への配慮と効率を両立させる仕事が適しています。',
    '乙辛': '美的センスと分析力を組み合わせた分野で、独自の価値を生み出せます。',
    '乙壬': '柔軟な思考と適応力を活かした分野で成功できるでしょう。',
    '乙癸': '直感と細やかな感性を活かした創造的な活動が向いています。'
  };
  
  // 存在しない組み合わせの場合はデフォルトの方向性を返す
  const key = dayStem + timeStem;
  return directions[key] || '多様な才能を持っているあなたは、様々な分野で活躍できる可能性を秘めています。直感を信じて進む道を選びましょう。';
}

// 相性の良い天干地支を決定する関数
function determineCompatibility(pillars: any[]) {
  // 日柱（自分自身を表す）から相性を判断
  const dayStem = pillars[2].heavenlyStem;
  const dayBranch = pillars[2].earthlyBranch;
  
  // 相性の良い天干地支（簡易版）
  const compatibilityMap: Record<string, string[]> = {
    '甲': ['丙', '丁', '己', '辛'],
    '乙': ['戊', '庚', '壬'],
    '丙': ['甲', '己', '辛'],
    '丁': ['甲', '戊', '庚'],
    '戊': ['乙', '丁', '辛', '癸'],
    '己': ['甲', '丙', '庚', '壬'],
    '庚': ['乙', '丁', '己', '癸'],
    '辛': ['甲', '丙', '戊', '壬'],
    '壬': ['乙', '己', '辛'],
    '癸': ['戊', '庚']
  };
  
  // 相性の良い天干を返す
  return compatibilityMap[dayStem] || [];
}

// 総合診断を生成する関数
function generateSummary(pillars: any[], elementCount: Record<string, number>, gender: string) {
  // 最も強い五行を特定
  const dominantElement = Object.entries(elementCount)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // 日柱から自分の本質を把握
  const dayStem = pillars[2].heavenlyStem;
  const dayBranch = pillars[2].earthlyBranch;
  
  // 五行ごとの総合診断
  const summaryMap: Record<string, string> = {
    '木': `あなたは創造性に富み、成長と発展を求める性質を持っています。「木」の気が強いことから、計画性があり、目標に向かって着実に進む力があります。常に新しいアイデアを生み出し、それを形にしていく才能があります。

理想を追求し、より良い未来を創造することに喜びを感じるでしょう。ただし、時には頑固になりすぎたり、理想と現実のギャップに悩むことがあるかもしれません。

柔軟性を保ちながらも、あなたの創造力と成長志向を活かして、周囲にポジティブな影響を与えていくことができるでしょう。特に教育、環境、デザイン、コンサルティングなどの分野で力を発揮できます。`,
    
    '火': `あなたは情熱的でエネルギッシュ、社交性に富む性質を持っています。「火」の気が強いことから、明るく前向きで、人を鼓舞する力があります。直感的な判断力と表現力に優れ、周囲に活力を与えることができます。

人との交流を楽しみ、新しい挑戦に積極的に取り組むでしょう。ただし、時には興奮しやすく、感情的になりすぎることがあるかもしれません。

あなたの情熱とカリスマ性を活かして、人々を導き、刺激を与えていくことができるでしょう。特にエンターテイメント、マーケティング、セールス、リーダーシップを要する分野で力を発揮できます。`,
    
    '土': `あなたは誠実で信頼性があり、実務的な性質を持っています。「土」の気が強いことから、安定を重視し、責任感が強く、周囲への配慮ができます。忍耐強く、着実に物事を進める力があります。

人の世話をしたり、実用的な問題を解決することに喜びを感じるでしょう。ただし、時には保守的になりすぎたり、変化を恐れることがあるかもしれません。

あなたの安定感と誠実さを活かして、周囲に安心と信頼を提供していくことができるでしょう。特に管理、サポート、サービス、不動産などの分野で力を発揮できます。`,
    
    '金': `あなたは論理的で効率を重視し、精密さを持つ性質があります。「金」の気が強いことから、分析力と決断力に優れ、物事を明確に整理する能力があります。規律と原則を重んじ、高い基準を持っています。

正確さと効率を追求し、組織や構造を整えることに喜びを感じるでしょう。ただし、時には批判的になりすぎたり、感情面を軽視することがあるかもしれません。

あなたの論理性と精密さを活かして、物事を整理し、効率化していくことができるでしょう。特に財務、法律、エンジニアリング、品質管理などの分野で力を発揮できます。`,
    
    '水': `あなたは知的好奇心が強く、直感力と洞察力に優れた性質を持っています。「水」の気が強いことから、深い思考力と適応力があり、物事の本質を見抜く力があります。コミュニケーション能力に優れ、柔軟に対応できます。

知識を深め、理解を広げることに喜びを感じるでしょう。ただし、時には考えすぎたり、現実から離れた思考に陥ることがあるかもしれません。

あなたの知性と直感力を活かして、複雑な問題を解決し、新しい視点を提供していくことができるでしょう。特に研究、コミュニケーション、カウンセリング、創作活動などの分野で力を発揮できます。`
  };
  
  // 総合診断を返す
  return summaryMap[dominantElement] || '五行のバランスから見るあなたの性質と可能性について、さらに詳しい鑑定が必要です。四柱推命の専門家に相談されることをお勧めします。';
}