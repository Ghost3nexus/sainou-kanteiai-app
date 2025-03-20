export const mockResults = {
  mbti: {
    personalityType: 'INTJ',
    description: {
      title: '建築家型',
      full: '論理的で戦略的な思考を持ち、複雑な問題を解決することを得意とします。独創的なアイデアと強い意志を持って、目標達成に向けて努力します。'
    },
    strengths: [
      '分析的思考力が高い',
      '戦略的な計画を立てるのが得意',
      '独創的なアイデアを生み出せる',
      '知的好奇心が強い'
    ],
    weaknesses: [
      '完璧主義な傾向がある',
      '他人の感情に鈍感なことがある',
      '柔軟性に欠けることがある',
      '批判的になりすぎることがある'
    ],
    compatibleTypes: [
      {
        type: 'ENFP',
        compatibility: 85,
        reason: '直感的な理解と論理的思考のバランスが取れています'
      },
      {
        type: 'ENTP',
        compatibility: 80,
        reason: '知的な刺激を与え合える関係性を築けます'
      }
    ],
    careerSuggestions: [
      'システムアーキテクト',
      '戦略コンサルタント',
      '研究者',
      'プロジェクトマネージャー'
    ],
    summary: 'あなたは論理的思考と創造性を兼ね備えた、稀少な人材タイプです。戦略的な思考と独創的なアイデアを活かして、複雑な問題解決に取り組むことで最大の力を発揮できます。'
  },
  animalFortune: {
    animal: '虎',
    color: '赤',
    animalType: 'リーダー',
    characteristics: [
      '決断力がある',
      '責任感が強い',
      'カリスマ性がある',
      '目標に向かって突き進む'
    ],
    compatibility: {
      good: [
        { animal: '狼', color: '黒' },
        { animal: '鷲', color: '金' }
      ],
      bad: [
        { animal: '猿', color: '青' },
        { animal: '兎', color: '白' }
      ]
    },
    description: '赤い虎は、生まれながらのリーダーシップを持つ人物です。強い意志と決断力を持ち、周囲の人々を導く力があります。',
    summary: 'あなたは生まれながらのリーダーとしての資質を持っています。その決断力と責任感を活かし、チームを成功に導くことができるでしょう。'
  },
  numerology: {
    name: '山田太郎',
    destinyNumber: 1,
    personalityNumber: 3,
    soulNumber: 5,
    compatibility: [3, 5, 7],
    summary: '運命数1は、リーダーシップと独創性を表します。新しいことを始める力と、それを成し遂げる意志の強さを持っています。'
  },
  fourPillars: {
    pillars: {
      year: { heavenlyStem: '甲', earthlyBranch: '寅' },
      month: { heavenlyStem: '丙', earthlyBranch: '午' },
      day: { heavenlyStem: '戊', earthlyBranch: '申' },
      hour: { heavenlyStem: '庚', earthlyBranch: '子' }
    },
    elements: {
      木: 30,
      火: 25,
      土: 20,
      金: 15,
      水: 10
    },
    characteristics: [
      '創造性豊か',
      '行動力がある',
      '直感力が優れている'
    ],
    strengths: [
      '新しいアイデアを生み出す力',
      'リーダーシップ',
      '決断力'
    ],
    weaknesses: [
      '急いで判断することがある',
      '固執しすぎることがある'
    ],
    summary: '木の気が強く、創造性と成長力に恵まれています。新しいプロジェクトを始めるのに適した運気があります。'
  },
  sanmei: {
    mainStar: '天印星',
    bodyStar: '天梁星',
    spiritStar: '紫微星',
    characteristics: [
      '知的好奇心が強い',
      '創造性がある',
      'リーダーシップがある'
    ],
    compatibility: {
      good: ['天機星', '太陽星'],
      bad: ['七殺星', '破軍星']
    },
    lifeDirection: '学術研究や創造的な仕事で力を発揮できます。',
    summary: '紫微星が命宮に在することで、高い知性と指導力を持ち合わせています。'
  }
};