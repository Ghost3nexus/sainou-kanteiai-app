import { NextResponse } from 'next/server';

/**
 * POST /api/fortune/mbti
 * MBTI診断を行うエンドポイント
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const data = await request.json();
    
    // バリデーション
    if (!data || !data.personalityType) {
      return NextResponse.json(
        { error: '診断に必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // MBTI診断結果を生成
    const result = generateMbtiResult(data.personalityType);
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('MBTI診断エラー:', error);
    return NextResponse.json(
      { error: 'MBTI診断の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * MBTI診断結果を生成する関数
 * @param personalityType MBTIタイプ（例: INTJ）
 * @returns MBTI診断結果
 */
function generateMbtiResult(personalityType: string) {
  // MBTIタイプの説明
  const typeDescriptions: Record<string, { title: string; full: string }> = {
    'ISTJ': {
      title: '管理者タイプ',
      full: '実践的で事実に基づいた思考の持ち主。信頼性があり、詳細志向で、強い責任感を持っています。'
    },
    'ISFJ': {
      title: '擁護者タイプ',
      full: '非常に献身的で温かく、常に人々を守る準備ができています。信頼性が高く、細部に注意を払います。'
    },
    'INFJ': {
      title: '提唱者タイプ',
      full: '静かな神秘主義者であり、理想主義者でもあります。高い創造性と洞察力を持ち、強い信念を持っています。'
    },
    'INTJ': {
      title: '建築家タイプ',
      full: '想像力豊かな戦略家。あらゆることに対して改善策を見つける分析的な思考の持ち主です。'
    },
    'ISTP': {
      title: '巨匠タイプ',
      full: '大胆で実践的な問題解決者。あらゆる種類のツールに熟練しています。'
    },
    'ISFP': {
      title: '冒険家タイプ',
      full: '柔軟で魅力的な芸術家。常に新しい経験や感覚を探しています。'
    },
    'INFP': {
      title: '仲介者タイプ',
      full: '詩的で親切、利他的な性格。常に善を見出し、より良い世界を作るために努力します。'
    },
    'INTP': {
      title: '論理学者タイプ',
      full: '発明家タイプの思想家。知識に対する飽くなき好奇心を持っています。'
    },
    'ESTP': {
      title: '起業家タイプ',
      full: 'スマートでエネルギッシュ、非常に知覚力が高いです。リスクを恐れず、刺激を求めます。'
    },
    'ESFP': {
      title: 'エンターテイナータイプ',
      full: '自発的で活気があり、熱狂的です。人生は楽しむためにあると考えています。'
    },
    'ENFP': {
      title: '広報運動家タイプ',
      full: '熱心で創造的、社交的で可能性を見る力に長けています。常に新しいプロジェクトや人々とのつながりを求めています。'
    },
    'ENTP': {
      title: '討論者タイプ',
      full: '賢くて好奇心旺盛な思想家。知的挑戦を恐れません。'
    },
    'ESTJ': {
      title: '幹部タイプ',
      full: '管理者で、伝統と秩序を重んじます。物事が円滑に進むように努めます。'
    },
    'ESFJ': {
      title: '領事官タイプ',
      full: '非常に思いやりがあり、社交的で人気があります。他者を助けることに情熱を注いでいます。'
    },
    'ENFJ': {
      title: '主人公タイプ',
      full: 'カリスマ的で感化力のあるリーダー。他者を鼓舞することができます。'
    },
    'ENTJ': {
      title: '指揮官タイプ',
      full: '大胆で想像力豊かな強いリーダー。常に道を切り開き、目標を達成します。'
    }
  };
  
  // 強みと弱み
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
  
  // キャリア適性
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
  
  // 相性の良いタイプ
  const getCompatibleTypes = (type: string) => {
    const compatibilityMap: Record<string, { types: string[], reason: string }> = {
      'ISTJ': { 
        types: ['ESFP', 'ESTP'], 
        reason: '異なる視点からの意見交換が成長につながります。' 
      },
      'ISFJ': { 
        types: ['ENFP', 'ENTP'], 
        reason: '社交性と内向性のバランスが取れた関係を築けます。' 
      },
      'INFJ': { 
        types: ['ENTP', 'ENFP'], 
        reason: '深い理解と知的な刺激を与え合える関係です。' 
      },
      'INTJ': { 
        types: ['ENFP', 'ENTP'], 
        reason: '互いの違いを補完し合える関係性です。' 
      },
      'ISTP': { 
        types: ['ESFJ', 'ENFJ'], 
        reason: '実践的な視点と人間関係のバランスが取れます。' 
      },
      'ISFP': { 
        types: ['ENTJ', 'ESTJ'], 
        reason: '感性と論理性が補完し合う関係です。' 
      },
      'INFP': { 
        types: ['ENTJ', 'ENFJ'], 
        reason: '理想と現実のバランスが取れた関係を築けます。' 
      },
      'INTP': { 
        types: ['ENFJ', 'ENTJ'], 
        reason: '論理的思考と感情的理解が補完し合います。' 
      },
      'ESTP': { 
        types: ['ISFJ', 'ISTJ'], 
        reason: '行動力と安定性のバランスが取れます。' 
      },
      'ESFP': { 
        types: ['ISTJ', 'ISFJ'], 
        reason: '社交性と内向性が補完し合う関係です。' 
      },
      'ENFP': { 
        types: ['INTJ', 'INFJ'], 
        reason: '創造性と分析力が融合した関係を築けます。' 
      },
      'ENTP': { 
        types: ['INFJ', 'INTJ'], 
        reason: '革新性と洞察力が補完し合います。' 
      },
      'ESTJ': { 
        types: ['ISFP', 'INFP'], 
        reason: '組織力と創造性のバランスが取れます。' 
      },
      'ESFJ': { 
        types: ['ISTP', 'INTP'], 
        reason: '社交性と論理性が融合した関係を築けます。' 
      },
      'ENFJ': { 
        types: ['ISTP', 'INTP'], 
        reason: 'リーダーシップと分析力が補完し合います。' 
      },
      'ENTJ': { 
        types: ['ISFP', 'INFP'], 
        reason: '決断力と感受性のバランスが取れた関係を築けます。' 
      },
    };
    
    const compatibleInfo = compatibilityMap[type];
    if (!compatibleInfo) return [];
    
    return compatibleInfo.types.map(compatibleType => ({
      type: compatibleType,
      compatibility: 80 + Math.floor(Math.random() * 15), // 80-94の範囲
      reason: compatibilityMap[type].reason
    }));
  };
  
  // 結果を返す
  return {
    personalityType,
    description: typeDescriptions[personalityType],
    strengths: typeStrengthsWeaknesses[personalityType].strengths,
    weaknesses: typeStrengthsWeaknesses[personalityType].weaknesses,
    compatibleTypes: getCompatibleTypes(personalityType),
    careerSuggestions: careerSuggestions[personalityType],
    summary: `あなたは${personalityType}型（${typeDescriptions[personalityType].title}）です。
${typeDescriptions[personalityType].full}

【強み】
${typeStrengthsWeaknesses[personalityType].strengths.join('、')}

【弱み・課題】
${typeStrengthsWeaknesses[personalityType].weaknesses.join('、')}

【キャリア適性】
${careerSuggestions[personalityType].join('、')}

${personalityType}型の人は、${getCompatibleTypes(personalityType).map(t => t.type).join('、')}型の人と特に良い相性があります。`,
  };
}