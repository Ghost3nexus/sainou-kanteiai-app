import { NextResponse } from 'next/server';

/**
 * POST /api/parse/mbti
 * MBTI心理診断を行うエンドポイント
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
    await new Promise(resolve => setTimeout(resolve, 1300));
    
    // モックの解析結果を生成
    const analysisResult = generateMockMbtiAnalysis(data);
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result: analysisResult,
    });
  } catch (error) {
    console.error('MBTI解析エラー:', error);
    return NextResponse.json(
      { error: 'MBTI解析の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * モックのMBTI解析結果を生成する関数
 */
function generateMockMbtiAnalysis(data: any) {
  // 入力データに基づいて、一貫性のあるランダムな結果を生成
  const nameHash = hashString(data.name); // 名前からハッシュ値を生成
  
  // 入力データからMBTIタイプを取得（存在する場合）
  let personalityType = data.personalityType || '';
  
  // MBTIタイプが指定されていない場合、名前のハッシュ値に基づいてランダムに生成
  if (!personalityType) {
    const mbtiTypes = [
      'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
      'ISTP', 'ISFP', 'INFP', 'INTP',
      'ESTP', 'ESFP', 'ENFP', 'ENTP',
      'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
    ];
    personalityType = mbtiTypes[nameHash % mbtiTypes.length];
  }
  
  // 各指標のスコアを生成
  const generateDimensionScore = (dimension: string) => {
    // 名前とディメンションに基づいて一貫性のあるスコアを生成
    const dimensionHash = hashString(data.name + dimension);
    return 50 + (dimensionHash % 51); // 50-100の範囲
  };
  
  // 各次元の説明
  const dimensionDescriptions = {
    E: '外向型（Extraversion）：エネルギーを外部から得る傾向があり、社交的で活動的です。',
    I: '内向型（Introversion）：エネルギーを内部から得る傾向があり、静かで内省的です。',
    S: '感覚型（Sensing）：具体的な事実や詳細に注目し、現実的です。',
    N: '直感型（iNtuition）：パターンや可能性に注目し、想像力豊かです。',
    T: '思考型（Thinking）：論理と客観性に基づいて決断します。',
    F: '感情型（Feeling）：価値観と人間関係に基づいて決断します。',
    J: '判断型（Judging）：計画的で組織的なアプローチを好みます。',
    P: '知覚型（Perceiving）：柔軟で適応力のあるアプローチを好みます。',
  };
  
  // 各MBTIタイプの説明
  const typeDescriptions: Record<string, string> = {
    'ISTJ': '「管理者」：実践的で事実に基づいた思考の持ち主。信頼性があり、詳細志向で、強い責任感を持っています。',
    'ISFJ': '「擁護者」：非常に献身的で温かく、常に人々を守る準備ができています。信頼性が高く、細部に注意を払います。',
    'INFJ': '「提唱者」：静かな神秘主義者であり、理想主義者でもあります。高い創造性と洞察力を持ち、強い信念を持っています。',
    'INTJ': '「建築家」：想像力豊かな戦略家。あらゆることに対して改善策を見つける分析的な思考の持ち主です。',
    'ISTP': '「巨匠」：大胆で実践的な問題解決者。あらゆる種類のツールに熟練しています。',
    'ISFP': '「冒険家」：柔軟で魅力的な芸術家。常に新しい経験や感覚を探しています。',
    'INFP': '「仲介者」：詩的で親切、利他的な性格。常に善を見出し、より良い世界を作るために努力します。',
    'INTP': '「論理学者」：発明家タイプの思想家。知識に対する飽くなき好奇心を持っています。',
    'ESTP': '「起業家」：スマートでエネルギッシュ、非常に知覚力が高いです。リスクを恐れず、刺激を求めます。',
    'ESFP': '「エンターテイナー」：自発的で活気があり、熱狂的です。人生は楽しむためにあると考えています。',
    'ENFP': '「広報運動家」：熱心で創造的、社交的で可能性を見る力に長けています。常に新しいプロジェクトや人々とのつながりを求めています。',
    'ENTP': '「討論者」：賢くて好奇心旺盛な思想家。知的挑戦を恐れません。',
    'ESTJ': '「幹部」：管理者で、伝統と秩序を重んじます。物事が円滑に進むように努めます。',
    'ESFJ': '「領事官」：非常に思いやりがあり、社交的で人気があります。他者を助けることに情熱を注いでいます。',
    'ENFJ': '「主人公」：カリスマ的で感化力のあるリーダー。他者を鼓舞することができます。',
    'ENTJ': '「指揮官」：大胆で想像力豊かな強いリーダー。常に道を切り開き、目標を達成します。',
  };
  
  // 各タイプの職業適性
  const careerSuggestions: Record<string, string[]> = {
    'ISTJ': ['会計士', '財務アナリスト', 'プロジェクトマネージャー', 'システム管理者', '法律専門家'],
    'ISFJ': ['看護師', '教師', '人事マネージャー', 'カスタマーサービス担当', 'ソーシャルワーカー'],
    'INFJ': ['カウンセラー', '心理学者', 'ライター', 'デザイナー', 'マーケティングコンサルタント'],
    'INTJ': ['科学者', 'プログラマー', '経営コンサルタント', 'システムアナリスト', '投資銀行家'],
    'ISTP': ['エンジニア', '技術者', 'パイロット', 'データアナリスト', '法執行官'],
    'ISFP': ['グラフィックデザイナー', 'ファッションデザイナー', '写真家', '音楽家', 'インテリアデザイナー'],
    'INFP': ['作家', 'グラフィックデザイナー', 'カウンセラー', '心理学者', '人事開発スペシャリスト'],
    'INTP': ['ソフトウェア開発者', '研究者', '大学教授', 'システムアナリスト', '建築家'],
    'ESTP': ['起業家', '営業担当', 'マーケター', 'スポーツコーチ', '緊急対応員'],
    'ESFP': ['イベントプランナー', '営業担当', 'ツアーガイド', 'レクリエーションディレクター', 'フライトアテンダント'],
    'ENFP': ['広報担当', 'マーケティングディレクター', 'コンサルタント', 'ジャーナリスト', 'アーティスト'],
    'ENTP': ['起業家', '弁護士', 'コンサルタント', 'クリエイティブディレクター', '発明家'],
    'ESTJ': ['ビジネスアナリスト', '保険代理店', '軍人', '判事', '学校管理者'],
    'ESFJ': ['教師', '医療従事者', 'セールスマネージャー', 'イベントプランナー', 'ソーシャルワーカー'],
    'ENFJ': ['教師', 'カウンセラー', '人事マネージャー', '営業トレーナー', '政治家'],
    'ENTJ': ['企業幹部', '起業家', '弁護士', '経営コンサルタント', '政治家'],
  };
  
  // 各タイプの強みと弱み
  const typeStrengthsWeaknesses: Record<string, { strengths: string[], weaknesses: string[] }> = {
    'ISTJ': {
      strengths: ['信頼性', '実践的', '組織的', '責任感', '詳細志向'],
      weaknesses: ['融通が利かない', '変化に抵抗', '感情表現が苦手', '批判的になりやすい'],
    },
    'ISFJ': {
      strengths: ['忠実', '思いやり', '信頼性', '観察力', '実践的'],
      weaknesses: ['批判に敏感', '変化を好まない', '自己主張が弱い', '過度に献身的'],
    },
    'INFJ': {
      strengths: ['創造的', '洞察力', '決断力', '情熱的', '利他的'],
      weaknesses: ['完璧主義', '燃え尽き症候群', '批判に敏感', '秘密主義'],
    },
    'INTJ': {
      strengths: ['戦略的思考', '独立心', '分析力', '決断力', '知識欲'],
      weaknesses: ['傲慢になりやすい', '感情表現が苦手', '過度に批判的', '人間関係構築が苦手'],
    },
    'ISTP': {
      strengths: ['論理的', '冷静', '実践的', '柔軟性', '危機対応力'],
      weaknesses: ['無謀', '感情表現が苦手', '約束を守らない', '長期計画が苦手'],
    },
    'ISFP': {
      strengths: ['芸術的', '感受性', '忠実', '適応力', '思いやり'],
      weaknesses: ['衝突回避', '批判に敏感', '長期計画が苦手', '自己主張が弱い'],
    },
    'INFP': {
      strengths: ['理想主義', '適応力', '創造性', '忠実', '思いやり'],
      weaknesses: ['非現実的', '自己批判', '実用性に欠ける', '優柔不断'],
    },
    'INTP': {
      strengths: ['分析力', '独創性', 'オープンマインド', '客観性', '知的好奇心'],
      weaknesses: ['過度な分析', '社交性の欠如', '優柔不断', '実用性に欠ける'],
    },
    'ESTP': {
      strengths: ['行動力', '問題解決能力', '現実的', '適応力', '説得力'],
      weaknesses: ['衝動的', '退屈しやすい', '規則を無視', '長期計画が苦手'],
    },
    'ESFP': {
      strengths: ['社交性', '実用的', '観察力', '適応力', '熱意'],
      weaknesses: ['衝動的', '集中力散漫', '長期計画が苦手', '批判に敏感'],
    },
    'ENFP': {
      strengths: ['熱意', '創造性', '社交性', '適応力', '洞察力'],
      weaknesses: ['優柔不断', '集中力散漫', '実用性に欠ける', '過度な感情移入'],
    },
    'ENTP': {
      strengths: ['革新的', '知的好奇心', '適応力', '資源活用力', '問題解決能力'],
      weaknesses: ['議論好き', '集中力散漫', '規則を無視', '実行力に欠ける'],
    },
    'ESTJ': {
      strengths: ['組織力', '忠実', '実用的', '信頼性', '決断力'],
      weaknesses: ['融通が利かない', '感情表現が苦手', '批判的', '伝統に固執'],
    },
    'ESFJ': {
      strengths: ['協力的', '忠実', '思いやり', '実用的', '社交性'],
      weaknesses: ['批判に敏感', '承認欲求', '変化に弱い', '自己犠牲的'],
    },
    'ENFJ': {
      strengths: ['カリスマ性', '利他的', '信頼性', '洞察力', '説得力'],
      weaknesses: ['過度な感情移入', '優柔不断', '批判に敏感', '自己犠牲的'],
    },
    'ENTJ': {
      strengths: ['決断力', '効率性', '自信', '戦略的思考', 'リーダーシップ'],
      weaknesses: ['傲慢', '感情表現が苦手', '過度に批判的', '忍耐力不足'],
    },
  };
  
  // 各次元のスコアを計算
  const dimensions = {
    E: personalityType.includes('E') ? generateDimensionScore('E') : 100 - generateDimensionScore('I'),
    I: personalityType.includes('I') ? generateDimensionScore('I') : 100 - generateDimensionScore('E'),
    S: personalityType.includes('S') ? generateDimensionScore('S') : 100 - generateDimensionScore('N'),
    N: personalityType.includes('N') ? generateDimensionScore('N') : 100 - generateDimensionScore('S'),
    T: personalityType.includes('T') ? generateDimensionScore('T') : 100 - generateDimensionScore('F'),
    F: personalityType.includes('F') ? generateDimensionScore('F') : 100 - generateDimensionScore('T'),
    J: personalityType.includes('J') ? generateDimensionScore('J') : 100 - generateDimensionScore('P'),
    P: personalityType.includes('P') ? generateDimensionScore('P') : 100 - generateDimensionScore('J'),
  };
  
  // 解析結果オブジェクトを作成
  return {
    personalityType,
    typeDescription: typeDescriptions[personalityType],
    dimensions,
    dimensionDescriptions,
    strengths: typeStrengthsWeaknesses[personalityType].strengths,
    weaknesses: typeStrengthsWeaknesses[personalityType].weaknesses,
    careerSuggestions: careerSuggestions[personalityType],
    compatibleTypes: getCompatibleTypes(personalityType),
    recommendations: [
      `${personalityType}タイプの強みである${typeStrengthsWeaknesses[personalityType].strengths[0]}と${typeStrengthsWeaknesses[personalityType].strengths[1]}を活かせる役割を担当することで、パフォーマンスが向上します。`,
      `${typeStrengthsWeaknesses[personalityType].weaknesses[0]}という弱みに注意し、意識的に改善することで、より効果的に業務を遂行できます。`,
      `${careerSuggestions[personalityType][0]}や${careerSuggestions[personalityType][1]}などの職種が適性に合っています。キャリア開発の参考にしてください。`,
    ],
  };
}

/**
 * 互換性のあるMBTIタイプを取得する関数
 */
function getCompatibleTypes(personalityType: string): { type: string; compatibility: number; reason: string }[] {
  // 実際のプロジェクトでは、より詳細な互換性ロジックを実装
  const allTypes = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
  ];
  
  // 互換性のある上位3タイプをランダムに選択
  const compatibleTypes = allTypes
    .filter(type => type !== personalityType)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(type => {
      const compatibility = Math.floor(Math.random() * 21) + 80; // 80-100の範囲
      let reason = '';
      
      // 互換性の理由をタイプに基づいて生成
      if (type[0] === personalityType[0]) { // E/I
        reason = `同じ${type[0] === 'E' ? '外向的' : '内向的'}なエネルギーの方向性を持っています。`;
      } else if (type[1] === personalityType[1]) { // S/N
        reason = `同じ${type[1] === 'S' ? '具体的' : '抽象的'}な情報収集スタイルを持っています。`;
      } else if (type[2] === personalityType[2]) { // T/F
        reason = `同じ${type[2] === 'T' ? '論理的' : '感情的'}な意思決定プロセスを持っています。`;
      } else if (type[3] === personalityType[3]) { // J/P
        reason = `同じ${type[3] === 'J' ? '計画的' : '柔軟'}な生活スタイルを持っています。`;
      } else {
        reason = '互いの違いを補完し合える関係性です。';
      }
      
      return { type, compatibility, reason };
    })
    .sort((a, b) => b.compatibility - a.compatibility);
  
  return compatibleTypes;
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