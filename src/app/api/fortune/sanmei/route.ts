import { NextResponse } from 'next/server';

// 算命学で使用する定数
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']; // 十干
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']; // 十二支
const ELEMENTS = ['木', '火', '土', '金', '水']; // 五行
const YIN_YANG = ['陽', '陰']; // 陰陽
const STARS = ['水星', '海王星', '冥王星', '木星', '土星', '金星', '太陽', '月星', '火星']; // 九星

// 十二支と五行の対応
const BRANCH_TO_ELEMENT: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 干と五行・陰陽の対応
const STEM_INFO: Record<string, { element: string, yinYang: string }> = {
  '甲': { element: '木', yinYang: '陽' },
  '乙': { element: '木', yinYang: '陰' },
  '丙': { element: '火', yinYang: '陽' },
  '丁': { element: '火', yinYang: '陰' },
  '戊': { element: '土', yinYang: '陽' },
  '己': { element: '土', yinYang: '陰' },
  '庚': { element: '金', yinYang: '陽' },
  '辛': { element: '金', yinYang: '陰' },
  '壬': { element: '水', yinYang: '陽' },
  '癸': { element: '水', yinYang: '陰' }
};

/**
 * POST /api/fortune/sanmei
 * 算命学の診断を行うエンドポイント
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const data = await request.json();
    
    // バリデーション
    if (!data || !data.birthdate || !data.gender) {
      return NextResponse.json(
        { error: '診断に必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // 算命学の計算を行う
    const result = calculateSanmei(data.birthdate, data.birthtime || '', data.gender, data.name || '');
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('算命学診断エラー:', error);
    return NextResponse.json(
      { error: '算命学診断の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 算命学の計算を行う関数
 * @param birthdate 生年月日
 * @param birthtime 生まれた時間（任意）
 * @param gender 性別
 * @param name 名前（任意）
 * @returns 算命学の診断結果
 */
function calculateSanmei(birthdate: string, birthtime: string, gender: string, name: string = '') {
  // 生年月日をパース
  const birthdateObj = new Date(birthdate);
  const year = birthdateObj.getFullYear();
  const month = birthdateObj.getMonth() + 1;
  const day = birthdateObj.getDate();
  
  // 時間帯をパース（HH:MM形式）
  let hour = 12; // デフォルトは正午
  let minute = 0;
  if (birthtime) {
    const [hourStr, minuteStr] = birthtime.split(':');
    hour = parseInt(hourStr, 10);
    minute = parseInt(minuteStr || '0', 10);
  }
  
  // 干支の計算
  const yearStem = calculateYearStem(year);
  const yearBranch = calculateYearBranch(year);
  const monthStem = calculateMonthStem(year, month);
  const monthBranch = calculateMonthBranch(month);
  const dayStem = calculateDayStem(year, month, day);
  const dayBranch = calculateDayBranch(year, month, day);
  const hourStem = calculateHourStem(dayStem, hour);
  const hourBranch = calculateHourBranch(hour);
  
  // 四柱（年月日時の干支）
  const fourPillars = {
    year: { stem: yearStem, branch: yearBranch },
    month: { stem: monthStem, branch: monthBranch },
    day: { stem: dayStem, branch: dayBranch },
    hour: { stem: hourStem, branch: hourBranch }
  };
  
  // 五行の算出
  const elements = calculateElements(fourPillars);
  
  // 宿命星（主星、体星、心星）の計算
  // 実際の算命学では干支の組み合わせから計算する
  const mainStar = calculateMainStar(yearStem, yearBranch);
  const bodyStar = calculateBodyStar(monthStem, monthBranch);
  const spiritStar = calculateSpiritStar(dayStem, dayBranch);
  
  // 大運（10年ごとの運勢）の計算
  const majorFortunes = calculateMajorFortunes(fourPillars, gender, year);
  
  // 年運（今年と来年の運勢）の計算
  const currentYear = new Date().getFullYear();
  const annualFortunes = calculateAnnualFortunes(fourPillars, currentYear);
  
  // 性格特性（主星に基づく）
  const characteristics = getCharacteristicsByMainStar(mainStar, gender);
  
  // 強みと弱みを決定
  const { strengths, weaknesses } = getStrengthsAndWeaknesses(mainStar, bodyStar, spiritStar);
  
  // 人生の方向性
  const lifeDirection = getLifeDirection(mainStar, bodyStar, gender);
  
  // 相性の良い星
  const compatibility = getCompatibility(mainStar);
  
  // 総合診断
  const summary = generateSummary(mainStar, bodyStar, spiritStar, gender, elements);
  
  // 結果を返す
  return {
    name,
    birthdate,
    birthtime,
    gender,
    fourPillars, // 四柱（年月日時の干支）
    elements,    // 五行の分布
    mainStar,    // 主星
    bodyStar,    // 体星
    spiritStar,  // 心星
    characteristics,
    strengths,
    weaknesses,
    lifeDirection,
    compatibility,
    majorFortunes, // 大運
    annualFortunes, // 年運
    summary
  };
}

/**
 * 年の干（十干）を計算する関数
 * @param year 西暦年
 * @returns 十干
 */
function calculateYearStem(year: number): string {
  // 1924年は甲子の始まり（甲：十干の1番目）
  const baseYear = 1924;
  const stemIndex = (year - baseYear) % 10;
  return STEMS[(stemIndex + 10) % 10]; // 負の値対応のため+10して%10
}

/**
 * 年の支（十二支）を計算する関数
 * @param year 西暦年
 * @returns 十二支
 */
function calculateYearBranch(year: number): string {
  // 1924年は甲子の始まり（子：十二支の1番目）
  const baseYear = 1924;
  const branchIndex = (year - baseYear) % 12;
  return BRANCHES[(branchIndex + 12) % 12]; // 負の値対応のため+12して%12
}

/**
 * 月の干（十干）を計算する関数
 * @param year 西暦年
 * @param month 月（1-12）
 * @returns 十干
 */
function calculateMonthStem(year: number, month: number): string {
  // 年の干によって月の干の始まりが変わる
  const yearStem = calculateYearStem(year);
  const stemOrder = {
    '甲': 0, '乙': 2, '丙': 4, '丁': 6, '戊': 8,
    '己': 0, '庚': 2, '辛': 4, '壬': 6, '癸': 8
  }[yearStem] || 0;
  
  // 月ごとの干の計算（節月に基づく補正が必要だが簡略化）
  const stemIndex = (stemOrder + month - 1) % 10;
  return STEMS[stemIndex];
}

/**
 * 月の支（十二支）を計算する関数
 * @param month 月（1-12）
 * @returns 十二支
 */
function calculateMonthBranch(month: number): string {
  // 月の支（正確には節月で計算するが簡略化）
  const branchMapping = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  return branchMapping[(month - 1) % 12];
}

/**
 * 日の干（十干）を計算する関数
 * @param year 西暦年
 * @param month 月（1-12）
 * @param day 日
 * @returns 十干
 */
function calculateDayStem(year: number, month: number, day: number): string {
  // 日の干の計算（実際には複雑な計算式があるが簡略化）
  // 1924年1月1日は甲子
  const baseDate = new Date(1924, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  
  // 日数差を計算
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 60日周期で繰り返す干支のうち、干（十干）の部分を計算
  const stemIndex = (diffDays % 10 + 10) % 10;
  return STEMS[stemIndex];
}

/**
 * 日の支（十二支）を計算する関数
 * @param year 西暦年
 * @param month 月（1-12）
 * @param day 日
 * @returns 十二支
 */
function calculateDayBranch(year: number, month: number, day: number): string {
  // 日の支の計算（実際には複雑な計算式があるが簡略化）
  // 1924年1月1日は甲子
  const baseDate = new Date(1924, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  
  // 日数差を計算
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 60日周期で繰り返す干支のうち、支（十二支）の部分を計算
  const branchIndex = (diffDays % 12 + 12) % 12;
  return BRANCHES[branchIndex];
}

/**
 * 時の干（十干）を計算する関数
 * @param dayStem 日の干
 * @param hour 時間（0-23）
 * @returns 十干
 */
function calculateHourStem(dayStem: string, hour: number): string {
  // 日の干によって時の干の始まりが変わる
  const stemOffset = {
    '甲': 0, '己': 0,
    '乙': 2, '庚': 2,
    '丙': 4, '辛': 4,
    '丁': 6, '壬': 6,
    '戊': 8, '癸': 8
  }[dayStem] || 0;
  
  // 時間帯（時柱）の計算
  const timeIndex = Math.floor((hour + 1) / 2) % 12;
  // 時の干の計算
  const stemIndex = (stemOffset + timeIndex) % 10;
  return STEMS[stemIndex];
}

/**
 * 時の支（十二支）を計算する関数
 * @param hour 時間（0-23）
 * @returns 十二支
 */
function calculateHourBranch(hour: number): string {
  // 時間帯（時柱）の対応表
  const hourToBranch = [
    '子', '子', // 23時-1時
    '丑', '丑', // 1時-3時
    '寅', '寅', // 3時-5時
    '卯', '卯', // 5時-7時
    '辰', '辰', // 7時-9時
    '巳', '巳', // 9時-11時
    '午', '午', // 11時-13時
    '未', '未', // 13時-15時
    '申', '申', // 15時-17時
    '酉', '酉', // 17時-19時
    '戌', '戌', // 19時-21時
    '亥', '亥'  // 21時-23時
  ];
  
  // 23時を0とする調整（23時は子の刻の始まり）
  const adjustedHour = (hour + 1) % 24;
  return hourToBranch[Math.floor(adjustedHour / 2)];
}

/**
 * 四柱から五行の分布を計算する関数
 * @param fourPillars 四柱（年月日時の干支）
 * @returns 五行の分布
 */
function calculateElements(fourPillars: any): Record<string, number> {
  // 五行の初期カウント
  const elements: Record<string, number> = {
    '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
  };
  
  // 各柱の干支から五行をカウント
  Object.values(fourPillars).forEach((pillar: any) => {
    // 干の五行をカウント
    if (STEM_INFO[pillar.stem]) {
      elements[STEM_INFO[pillar.stem].element]++;
    }
    
    // 支の五行をカウント
    if (BRANCH_TO_ELEMENT[pillar.branch]) {
      elements[BRANCH_TO_ELEMENT[pillar.branch]]++;
    }
  });
  
  return elements;
}

/**
 * 主星（性格の中心）を計算する関数
 * @param yearStem 年の干
 * @param yearBranch 年の支
 * @returns 主星
 */
function calculateMainStar(yearStem: string, yearBranch: string): string {
  // 年の干支による主星の決定（実際はもっと複雑）
  // 簡略化のため、年の干と支の組み合わせに基づく簡易計算
  const stemIndex = STEMS.indexOf(yearStem);
  const branchIndex = BRANCHES.indexOf(yearBranch);
  
  // 干支の組み合わせから九星への変換（簡易版）
  const starIndex = (stemIndex + branchIndex) % 9;
  return STARS[starIndex];
}

/**
 * 体星（行動面）を計算する関数
 * @param monthStem 月の干
 * @param monthBranch 月の支
 * @returns 体星
 */
function calculateBodyStar(monthStem: string, monthBranch: string): string {
  // 月の干支による体星の決定（実際はもっと複雑）
  const stemIndex = STEMS.indexOf(monthStem);
  const branchIndex = BRANCHES.indexOf(monthBranch);
  
  // 干支の組み合わせから九星への変換（簡易版）
  const starIndex = (stemIndex + branchIndex * 2) % 9;
  return STARS[starIndex];
}

/**
 * 心星（精神面）を計算する関数
 * @param dayStem 日の干
 * @param dayBranch 日の支
 * @returns 心星
 */
function calculateSpiritStar(dayStem: string, dayBranch: string): string {
  // 日の干支による心星の決定（実際はもっと複雑）
  const stemIndex = STEMS.indexOf(dayStem);
  const branchIndex = BRANCHES.indexOf(dayBranch);
  
  // 干支の組み合わせから九星への変換（簡易版）
  const starIndex = (stemIndex * 2 + branchIndex) % 9;
  return STARS[starIndex];
}

/**
 * 大運（10年ごとの運勢）を計算する関数
 * @param fourPillars 四柱
 * @param gender 性別
 * @param birthYear 生年
 * @returns 大運（10年ごとの運勢）
 */
function calculateMajorFortunes(fourPillars: any, gender: string, birthYear: number): any[] {
  const majorFortunes = [];
  const currentYear = new Date().getFullYear();
  
  // 大運の起点となる年齢（性別によって異なる）
  const startAge = gender.toLowerCase() === 'male' ? 10 : 8;
  
  // 10年ごとの大運を計算
  for (let i = 0; i < 8; i++) {
    const age = startAge + i * 10;
    const year = birthYear + age;
    
    // 大運の干支（簡易計算）
    const stem = STEMS[(i + STEMS.indexOf(fourPillars.year.stem)) % 10];
    const branch = BRANCHES[(i + BRANCHES.indexOf(fourPillars.year.branch)) % 12];
    
    // この大運期間に入っているかどうか
    const isCurrent = (year <= currentYear && currentYear < year + 10);
    
    // 大運の解説（干支の組み合わせによる）
    const description = getMajorFortuneDescription(stem, branch);
    
    majorFortunes.push({
      age,
      year,
      stem,
      branch,
      isCurrent,
      description
    });
  }
  
  return majorFortunes;
}

/**
 * 大運の解説を生成する関数
 * @param stem 干
 * @param branch 支
 * @returns 大運の解説
 */
function getMajorFortuneDescription(stem: string, branch: string): string {
  // 干と支の組み合わせによる運勢の解説
  const stemElement = STEM_INFO[stem]?.element || '';
  const branchElement = BRANCH_TO_ELEMENT[branch] || '';
  
  // 五行の相生相克関係に基づく解説
  if (isPromoting(stemElement, branchElement)) {
    return `${stem}${branch}の大運では、${stemElement}と${branchElement}の相生関係により、安定と成長が期待できます。自分の強みを活かし、チャンスを掴む時期でしょう。人間関係も良好で、サポートを得られやすい時期です。`;
  } else if (isConflicting(stemElement, branchElement)) {
    return `${stem}${branch}の大運では、${stemElement}と${branchElement}の相克関係により、変化と挑戦の時期となります。困難に直面することもありますが、それを乗り越えることで大きな成長が見込めます。忍耐と適応力を養いましょう。`;
  } else {
    return `${stem}${branch}の大運では、バランスの取れた時期となります。計画的に行動し、基盤を固めることが大切です。人との縁を大切にし、長期的な視点で物事を進めると良いでしょう。`;
  }
}

/**
 * 五行の相生関係（促進関係）をチェック
 * @param element1 五行1
 * @param element2 五行2
 * @returns 相生関係にあるかどうか
 */
function isPromoting(element1: string, element2: string): boolean {
  const promotions = {
    '木': '火', // 木は火を生む
    '火': '土', // 火は土を生む
    '土': '金', // 土は金を生む
    '金': '水', // 金は水を生む
    '水': '木'  // 水は木を生む
  };
  
  return promotions[element1 as keyof typeof promotions] === element2;
}

/**
 * 五行の相克関係（抑制関係）をチェック
 * @param element1 五行1
 * @param element2 五行2
 * @returns 相克関係にあるかどうか
 */
function isConflicting(element1: string, element2: string): boolean {
  const conflicts = {
    '木': '土', // 木は土を克する
    '土': '水', // 土は水を克する
    '水': '火', // 水は火を克する
    '火': '金', // 火は金を克する
    '金': '木'  // 金は木を克する
  };
  
  return conflicts[element1 as keyof typeof conflicts] === element2;
}

/**
 * 年運（1年ごとの運勢）を計算する関数
 * @param fourPillars 四柱
 * @param currentYear 現在の年
 * @returns 年運（今年と来年の運勢）
 */
function calculateAnnualFortunes(fourPillars: any, currentYear: number): any[] {
  const annualFortunes = [];
  
  // 今年と来年の年運
  for (let i = 0; i < 2; i++) {
    const year = currentYear + i;
    
    // 年の干支
    const stem = calculateYearStem(year);
    const branch = calculateYearBranch(year);
    
    // 本命との相性
    const compatibility = calculateYearCompatibility(fourPillars, stem, branch);
    
    // 年運の解説
    const description = getAnnualFortuneDescription(stem, branch, compatibility);
    
    annualFortunes.push({
      year,
      stem,
      branch,
      compatibility,
      description
    });
  }
  
  return annualFortunes;
}

/**
 * 年の干支と本命との相性を計算
 * @param fourPillars 四柱（本命）
 * @param yearStem 年の干
 * @param yearBranch 年の支
 * @returns 相性（"良い" | "普通" | "注意"）
 */
function calculateYearCompatibility(fourPillars: any, yearStem: string, yearBranch: string): string {
  // 本命の日柱と年の干支の相性
  const dayElement = STEM_INFO[fourPillars.day.stem]?.element || '';
  const yearStemElement = STEM_INFO[yearStem]?.element || '';
  const yearBranchElement = BRANCH_TO_ELEMENT[yearBranch] || '';
  
  // 相生関係なら良い
  if (isPromoting(dayElement, yearStemElement) || isPromoting(dayElement, yearBranchElement)) {
    return "良い";
  }
  
  // 相克関係なら注意
  if (isConflicting(dayElement, yearStemElement) || isConflicting(dayElement, yearBranchElement)) {
    return "注意";
  }
  
  // それ以外は普通
  return "普通";
}

/**
 * 年運の解説を生成する関数
 * @param stem 干
 * @param branch 支
 * @param compatibility 相性
 * @returns 年運の解説
 */
function getAnnualFortuneDescription(stem: string, branch: string, compatibility: string): string {
  const stemElement = STEM_INFO[stem]?.element || '';
  const branchElement = BRANCH_TO_ELEMENT[branch] || '';
  
  switch (compatibility) {
    case "良い":
      return `${stem}${branch}の年は、あなたにとって運気の良い年となるでしょう。${stemElement}と${branchElement}のエネルギーがあなたの本質を支え、新しい機会や良い出会いが期待できます。積極的に行動し、チャンスを掴むと良いでしょう。`;
    case "注意":
      return `${stem}${branch}の年は、変化や挑戦が多く訪れる可能性があります。${stemElement}と${branchElement}のエネルギーが変化をもたらすため、柔軟な対応が求められます。健康管理に気を配り、慎重に行動することが大切です。`;
    default:
      return `${stem}${branch}の年は、安定の中にも変化がある一年となるでしょう。${stemElement}と${branchElement}のエネルギーがバランスをもたらし、堅実に行動することで着実な進展が期待できます。`;
  }
}

// 主星に基づく性格特性を取得する関数
function getCharacteristicsByMainStar(mainStar: string, gender: string) {
  const characteristicsMap: Record<string, string[]> = {
    '水星': [
      '知的好奇心が旺盛で、学ぶことを楽しみます',
      'コミュニケーション能力に優れています',
      '柔軟性があり、変化に適応できます',
      '多様な情報を収集・整理する力があります',
      '冷静な判断ができます'
    ],
    '海王星': [
      '直感力と霊感に優れています',
      '芸術的センスがあり、創造性豊かです',
      '優しく思いやりがあります',
      '理想を追求する傾向があります',
      '共感能力が高いです'
    ],
    '冥王星': [
      '意志力が強く、変革を好みます',
      '深い洞察力を持っています',
      '情熱的で、全力で取り組みます',
      '直観力に優れています',
      '困難を乗り越える強さがあります'
    ],
    '木星': [
      '楽観的で前向きな姿勢を持っています',
      '公平さと正義を重んじます',
      '寛大で、思いやりがあります',
      '社交的で人との関わりを大切にします',
      '成長と発展を志向します'
    ],
    '土星': [
      '責任感が強く、信頼されます',
      '規律を重んじ、忍耐強いです',
      '計画的で、着実に物事を進めます',
      '実用的で、現実的な判断ができます',
      '努力を惜しまず、粘り強いです'
    ],
    '金星': [
      '審美眼に優れ、美しいものを大切にします',
      '調和を好み、対立を避けます',
      '親切で思いやりがあります',
      '社交性があり、人間関係を円滑にします',
      '協調性と柔軟性を持っています'
    ],
    '太陽': [
      'リーダーシップがあり、周囲を導きます',
      '自信と明るさを持っています',
      '創造性に富み、表現力があります',
      '目標に向かって前進する力があります',
      '他者を励まし、活力を与えます'
    ],
    '月星': [
      '感受性が強く、直感力に優れています',
      '共感力があり、人の気持ちを理解します',
      '記憶力が良く、細部にも気を配ります',
      '家族や親しい人を大切にします',
      '保護者的な役割を担うことが多いです'
    ],
    '火星': [
      '行動力があり、エネルギッシュです',
      '決断力に優れ、リーダーシップがあります',
      '競争心が強く、目標達成に向けて努力します',
      '勇気があり、新しいことに挑戦します',
      '情熱的で、活力に満ちています'
    ]
  };
  
  return characteristicsMap[mainStar] || [];
}

// 強みと弱みを取得する関数
function getStrengthsAndWeaknesses(mainStar: string, bodyStar: string, spiritStar: string) {
  // 各星の強み
  const strengthsMap: Record<string, string[]> = {
    '水星': [
      '知的適応力', 'コミュニケーション能力', '分析力', '柔軟性', '学習能力'
    ],
    '海王星': [
      '直感力', '創造性', '共感能力', '芸術的センス', '精神性'
    ],
    '冥王星': [
      '意志力', '洞察力', '変革力', '回復力', '集中力'
    ],
    '木星': [
      '楽観性', '寛容さ', '公正さ', '社交性', '成長志向'
    ],
    '土星': [
      '忍耐力', '責任感', '計画性', '実行力', '規律性'
    ],
    '金星': [
      '協調性', '調和を作る能力', '審美眼', '人間関係構築力', '親切さ'
    ],
    '太陽': [
      'リーダーシップ', '自己表現力', '自信', '創造性', '活力'
    ],
    '月星': [
      '感受性', '共感力', '記憶力', '直感力', '保護本能'
    ],
    '火星': [
      '行動力', '決断力', '競争力', '勇気', '情熱'
    ]
  };
  
  // 各星の弱み
  const weaknessesMap: Record<string, string[]> = {
    '水星': [
      '落ち着きのなさ', '神経質になりやすい', '優柔不断', '集中力散漫', '心配性'
    ],
    '海王星': [
      '現実逃避', '混乱しやすい', '境界線の曖昧さ', '幻想に囚われる', '依存傾向'
    ],
    '冥王星': [
      '執着', '極端な思考', '支配欲', '秘密主義', '疑い深さ'
    ],
    '木星': [
      '過度の楽観主義', '浪費', '過剰な自信', '誇張', '批判的思考の不足'
    ],
    '土星': [
      '頑固さ', '悲観主義', '過度の自己抑制', '柔軟性の欠如', '感情表現の難しさ'
    ],
    '金星': [
      '葛藤回避', '現実逃避', '過度の依存', '優柔不断', '自己犠牲'
    ],
    '太陽': [
      '傲慢さ', '独断的', '権威主義', '自己中心的', '他者の軽視'
    ],
    '月星': [
      '感情の波', '過度の敏感さ', '依存性', '過去への執着', '気分の変動'
    ],
    '火星': [
      '短気', '攻撃性', '衝動性', '忍耐不足', '慎重さの欠如'
    ]
  };
  
  // 主星に基づく強みと、体星と心星の組み合わせに基づく弱みを返す
  return {
    strengths: strengthsMap[mainStar] || [],
    weaknesses: weaknessesMap[spiritStar] || []
  };
}

// 人生の方向性を取得する関数
function getLifeDirection(mainStar: string, bodyStar: string, gender: string) {
  const directionsMap: Record<string, string> = {
    '水星': '知識や情報を扱う分野、コミュニケーションを活かせる仕事が適しています。教育、メディア、IT、コンサルティングなどの分野で才能を発揮できるでしょう。常に学び続け、知識を広げることで成長します。',
    '海王星': '直感力と創造性を活かせる分野が適しています。芸術、音楽、映像、スピリチュアルな分野、カウンセリングなどで才能を発揮できるでしょう。感性を磨き、理想を追求することで成長します。',
    '冥王星': '変革や革新を起こせる分野が適しています。研究、心理学、医療、改革を必要とする分野で才能を発揮できるでしょう。深い専門性を身につけ、本質を追求することで成長します。',
    '木星': '人との関わりや社会貢献ができる分野が適しています。教育、法律、宗教、国際関係などの分野で才能を発揮できるでしょう。視野を広げ、公正さを持って行動することで成長します。',
    '土星': '組織や制度を支える分野が適しています。管理職、財務、不動産、建築などの分野で才能を発揮できるでしょう。責任を持って計画的に取り組み、着実に進むことで成長します。',
    '金星': '美や調和に関わる分野が適しています。芸術、デザイン、ファッション、対人サービスなどの分野で才能を発揮できるでしょう。人間関係を大切にし、美的センスを磨くことで成長します。',
    '太陽': 'リーダーシップを発揮できる分野が適しています。経営、政治、エンターテイメント、創造的な分野で才能を発揮できるでしょう。自己表現を大切にし、目標に向かって行動することで成長します。',
    '月星': '人を支援したり、感情に関わる分野が適しています。医療、福祉、カウンセリング、料理、家族に関わる分野で才能を発揮できるでしょう。感受性を大切にし、他者をケアすることで成長します。',
    '火星': '行動力や決断力を活かせる分野が適しています。スポーツ、軍事、競争の激しいビジネス、起業家として才能を発揮できるでしょう。目標に向かって積極的に行動し、挑戦し続けることで成長します。'
  };
  
  return directionsMap[mainStar] || '多様な才能を持つあなたは、様々な分野で活躍できる可能性を秘めています。直感を信じて進む道を選びましょう。';
}

// 相性の良い星を取得する関数
function getCompatibility(mainStar: string) {
  const compatibilityMap: Record<string, { good: string[] }> = {
    '水星': { good: ['木星', '月星', '海王星'] },
    '海王星': { good: ['水星', '月星', '冥王星'] },
    '冥王星': { good: ['火星', '海王星', '太陽'] },
    '木星': { good: ['水星', '太陽', '金星'] },
    '土星': { good: ['金星', '火星', '太陽'] },
    '金星': { good: ['木星', '土星', '月星'] },
    '太陽': { good: ['木星', '火星', '冥王星'] },
    '月星': { good: ['水星', '金星', '海王星'] },
    '火星': { good: ['土星', '太陽', '冥王星'] }
  };
  
  return compatibilityMap[mainStar] || { good: [] };
}

// 総合診断を生成する関数
function generateSummary(mainStar: string, bodyStar: string, spiritStar: string, gender: string, elements: Record<string, number>) {
  // 五行の分布を分析
  const elementAnalysis = analyzeElements(elements);
  
  const summaryMap: Record<string, string> = {
    '水星': `あなたは「水星」を主星に持ち、知的好奇心と適応力に優れた性質を持っています。多様な情報を取り入れ、柔軟に対応する能力があります。コミュニケーション能力が高く、言葉や情報を扱うことが得意です。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは情報収集と分析が得意で、様々な状況に適応できる柔軟性を持っています。知識を広げ、コミュニケーション能力を活かすことで、教育やメディア、IT関連の分野で才能を発揮できるでしょう。

ただし、落ち着きがなく、神経質になりすぎる傾向があるため、時には静かに内省する時間を持つことが大切です。多くの可能性を秘めているあなたは、知的好奇心を持ち続けることで、さらなる成長を遂げることができるでしょう。`,

    '海王星': `あなたは「海王星」を主星に持ち、直感力と創造性に優れた性質を持っています。繊細な感受性を持ち、芸術的なセンスや霊的な感覚に恵まれています。理想を追求し、美しいものや意味のあるものに惹かれます。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは芸術や創造的な分野、あるいは人を癒す職業に適性があります。豊かな想像力と共感能力を活かして、音楽、芸術、カウンセリング、スピリチュアルな分野で才能を発揮できるでしょう。

ただし、現実から逃避しやすい傾向があるため、地に足をつけて行動することも大切です。感性豊かなあなたは、創造性を発揮しながらも現実とのバランスを保つことで、より充実した人生を送ることができるでしょう。`,

    '冥王星': `あなたは「冥王星」を主星に持ち、強い意志力と変革の力を秘めた性質を持っています。深い洞察力があり、物事の本質を見抜く力に優れています。困難に立ち向かう強さと、再生する力を持っています。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは研究や専門分野、あるいは改革を必要とする領域で才能を発揮できます。集中力と探求心を活かして、医学、心理学、研究職、あるいは組織の改革者として活躍できるでしょう。

ただし、時に極端な思考や執着に陥る傾向があるため、バランスを保つことが大切です。変革の力を持つあなたは、その力を建設的に用いることで、自分自身と周囲に良い影響を与えることができるでしょう。`,

    '木星': `あなたは「木星」を主星に持ち、楽観的で寛大な性質を持っています。公正さを重んじ、成長と発展を志向します。人との関わりを大切にし、社交的な面を持っています。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは教育や法律、国際関係などの分野で才能を発揮できます。広い視野と公正さを活かして、人を導いたり、社会に貢献したりする役割に適しています。

ただし、時に楽観的すぎたり、自己抑制が足りなくなる傾向があるため、現実的な判断も心がけることが大切です。可能性を広げるあなたは、バランスの取れた判断力を養うことで、より大きな成功を収めることができるでしょう。`,

    '土星': `あなたは「土星」を主星に持ち、責任感と忍耐力に優れた性質を持っています。規律を重んじ、着実に物事を進める力があります。実用的で現実的な判断ができ、信頼される存在です。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは管理職や専門職、不動産や建築などの分野で才能を発揮できます。計画性と実行力を活かして、組織や制度を支える役割に適しています。

ただし、時に頑固になったり、悲観的になる傾向があるため、柔軟性を持つことも大切です。安定を作り出すあなたは、少しずつ変化を受け入れながら成長することで、より充実した人生を送ることができるでしょう。`,

    '金星': `あなたは「金星」を主星に持ち、調和と美を重んじる性質を持っています。人間関係を大切にし、協調性があります。審美眼に優れ、美しいものや快適な環境を好みます。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは芸術やデザイン、対人サービスなどの分野で才能を発揮できます。美的センスと人間関係構築力を活かして、人に喜びや美を提供する役割に適しています。

ただし、時に葛藤を避けすぎたり、他者に依存しすぎる傾向があるため、自立性を養うことも大切です。調和を作り出すあなたは、自分の価値観も大切にすることで、より充実した関係性を築くことができるでしょう。`,

    '太陽': `あなたは「太陽」を主星に持ち、リーダーシップと自己表現力に優れた性質を持っています。明るく活力があり、他者を励ます力があります。創造性に富み、目標に向かって進む力があります。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは経営やエンターテイメント、創造的な分野で才能を発揮できます。自信と表現力を活かして、人を導いたり、刺激を与えたりする役割に適しています。

ただし、時に傲慢になったり、自己中心的になる傾向があるため、謙虚さを持つことも大切です。輝きを放つあなたは、他者の光も認めることで、より大きな影響力を持つことができるでしょう。`,

    '月星': `あなたは「月星」を主星に持ち、感受性と直感力に優れた性質を持っています。共感力があり、人の気持ちを理解する力に長けています。家族や親しい人を大切にし、保護者的な役割を担うことが多いです。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたは医療や福祉、カウンセリングなどの分野で才能を発揮できます。感受性と共感力を活かして、人を支援したり、癒したりする役割に適しています。

ただし、時に感情の波が大きくなったり、過度に敏感になる傾向があるため、感情のバランスを保つことも大切です。優しさを持つあなたは、自分自身も大切にすることで、より良いサポートを提供できるでしょう。`,

    '火星': `あなたは「火星」を主星に持ち、行動力と決断力に優れた性質を持っています。エネルギッシュで、目標に向かって積極的に進む力があります。競争心が強く、困難に立ち向かう勇気があります。

体星は「${bodyStar}」で、行動面では${getBodyStarDescription(bodyStar)}
また、心星は「${spiritStar}」であり、内面では${getSpiritStarDescription(spiritStar)}

${elementAnalysis}

この組み合わせから、あなたはスポーツや競争の激しいビジネス、起業などの分野で才能を発揮できます。行動力と情熱を活かして、新しい道を切り開いたり、目標を達成したりする力があります。

ただし、時に短気になったり、衝動的になる傾向があるため、忍耐力を養うことも大切です。エネルギッシュなあなたは、その力を建設的に用いることで、大きな成果を上げることができるでしょう。`
  };
  
  return summaryMap[mainStar] || '算命学の詳細な鑑定には、専門家による分析が必要です。この結果はあくまで参考程度にとどめ、より詳しい解釈は算命学の専門家に相談されることをお勧めします。';
}

/**
 * 五行の分布を分析する関数
 * @param elements 五行の分布
 * @returns 五行の分析結果
 */
function analyzeElements(elements: Record<string, number>): string {
  // 五行の合計数を計算
  const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
  
  // 最も多い五行と最も少ない五行を特定
  let maxElement = '';
  let maxCount = 0;
  let minElement = '';
  let minCount = Infinity;
  
  for (const [element, count] of Object.entries(elements)) {
    if (count > maxCount) {
      maxElement = element;
      maxCount = count;
    }
    if (count < minCount) {
      minElement = element;
      minCount = count;
    }
  }
  
  // 五行の特性マップ
  const elementTraits: Record<string, { strength: string, weakness: string, balance: string }> = {
    '木': {
      strength: '創造性、成長力、柔軟性、決断力に優れています',
      weakness: '時に頑固になったり、自己主張が強くなりすぎることがあります',
      balance: '計画性を持ち、他者の意見も尊重することで、より良い結果を得られるでしょう'
    },
    '火': {
      strength: '情熱、活力、表現力、リーダーシップに優れています',
      weakness: '時に短気になったり、衝動的になることがあります',
      balance: '冷静さを保ち、長期的な視点を持つことで、より安定した成果を上げられるでしょう'
    },
    '土': {
      strength: '安定性、忍耐力、実用性、信頼性に優れています',
      weakness: '時に保守的すぎたり、変化を恐れることがあります',
      balance: '新しいアイデアにも柔軟に対応することで、より充実した人生を送れるでしょう'
    },
    '金': {
      strength: '精密さ、効率性、判断力、公正さに優れています',
      weakness: '時に批判的になりすぎたり、感情を抑え込むことがあります',
      balance: '感情も大切にし、柔軟性を持つことで、より良い人間関係を築けるでしょう'
    },
    '水': {
      strength: '知性、直感力、適応力、コミュニケーション能力に優れています',
      weakness: '時に優柔不断になったり、不安になりやすいことがあります',
      balance: '自信を持って決断し、行動することで、より多くの可能性を実現できるでしょう'
    }
  };
  
  // 五行のバランス状態を判断
  let balanceState = '';
  const maxPercentage = (maxCount / total) * 100;
  const minPercentage = (minCount / total) * 100;
  
  if (maxPercentage > 40) {
    balanceState = '偏り';
  } else if (maxPercentage - minPercentage < 10) {
    balanceState = '均衡';
  } else {
    balanceState = '適度な変化';
  }
  
  // 分析結果を生成
  let analysis = `五行の分布を見ると、あなたの中では「${maxElement}」の性質が最も強く、「${minElement}」の性質がやや弱い傾向があります。`;
  
  switch (balanceState) {
    case '偏り':
      analysis += `「${maxElement}」の性質が特に強いため、${elementTraits[maxElement].strength}。ただし、${elementTraits[maxElement].weakness}。バランスを取るために、${elementTraits[maxElement].balance}`;
      break;
    case '均衡':
      analysis += `五行のバランスが取れているため、状況に応じて様々な特性を発揮できる柔軟性があります。多面的な視点を持ち、環境の変化にも適応しやすい傾向があります。`;
      break;
    case '適度な変化':
      analysis += `「${maxElement}」の性質を中心としながらも、他の要素とのバランスも取れています。${elementTraits[maxElement].strength}。弱い「${minElement}」の性質を意識的に取り入れることで、より全体的な成長が期待できます。`;
      break;
  }
  
  return analysis;
}

// 体星の説明を取得する関数
function getBodyStarDescription(star: string) {
  const descriptions: Record<string, string> = {
    '水星': '知的で論理的な行動パターンがあります。情報を集め、分析してから行動する傾向があります。',
    '海王星': '直感に従って行動し、感覚的な判断をすることが多いです。芸術的な表現や人を助ける行動に出ることが多いです。',
    '冥王星': '意志力を持って行動し、全力で物事に取り組みます。変革や革新を起こす行動に出ることが多いです。',
    '木星': '前向きで積極的な行動パターンがあります。広い視野を持ち、成長につながる行動を選びます。',
    '土星': '計画的で慎重な行動パターンがあります。責任感を持って、着実に物事を進めます。',
    '金星': '調和を重視した行動パターンがあります。人間関係を円滑にし、美しさや快適さを求める行動をします。',
    '太陽': '自信を持って堂々と行動します。リーダーシップを発揮し、目立つ行動や創造的な活動に出ることが多いです。',
    '月星': '感情や直感に基づいて行動します。人を支援したり、家族や身近な人を大切にする行動に出ます。',
    '火星': 'エネルギッシュで積極的な行動パターンがあります。目標に向かって果敢に挑戦し、競争を厭いません。'
  };
  
  return descriptions[star] || '独自の行動パターンがあります。';
}

// 心星の説明を取得する関数
function getSpiritStarDescription(star: string) {
  const descriptions: Record<string, string> = {
    '水星': '知的で分析的な思考を持ちます。好奇心が強く、様々なことを学びたいと思う傾向があります。',
    '海王星': '繊細で感性豊かな内面を持ちます。芸術的な感覚や霊的なものに関心を持つ傾向があります。',
    '冥王星': '深く探求する思考を持ちます。物事の本質を見抜きたいという強い欲求があります。',
    '木星': '楽観的で広い視野を持つ思考があります。成長や意味を求める精神的な面があります。',
    '土星': '責任感が強く、秩序を求める内面があります。自己規律と現実的な判断を重視します。',
    '金星': '調和と美を重んじる感覚を持ちます。人との関係性を大切にし、平和を求める心があります。',
    '太陽': '自己表現と創造性を大切にする内面があります。自分の個性を発揮したいという欲求が強いです。',
    '月星': '感受性豊かで、情緒的な内面を持ちます。記憶力が良く、過去の経験が心に残りやすいです。',
    '火星': '情熱的で意欲的な内面を持ちます。競争心が強く、目標達成に向けて努力する精神があります。'
  };
  
  return descriptions[star] || '独自の内面的特性を持っています。';
}