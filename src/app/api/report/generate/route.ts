import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 結果データを保存しているディレクトリ
const RESULTS_DIR = path.join('/tmp', 'fortune-results');

export async function POST(request: Request) {
  try {
    const { resultId } = await request.json();

    // 結果ファイルを読み込む
    const filePath = path.join(RESULTS_DIR, `${resultId}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '指定された診断結果が見つかりません' },
        { status: 404 }
      );
    }

    const resultData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // レポートの内容を生成
    let reportContent = '';
    switch (resultData.type) {
      case 'mbti':
        reportContent = await generateMbtiReport(resultData.result);
        break;
      case 'animalFortune':
        reportContent = await generateAnimalReport(resultData.result);
        break;
      case 'numerology':
        reportContent = await generateNumerologyReport(resultData.result);
        break;
      case 'fourPillars':
        reportContent = await generateFourPillarsReport(resultData.result);
        break;
      case 'sanmei':
        reportContent = await generateSanmeiReport(resultData.result);
        break;
      default:
        throw new Error('未対応の診断タイプです');
    }

    return NextResponse.json({
      success: true,
      report: reportContent,
    });
  } catch (error) {
    console.error('レポート生成エラー:', error);
    return NextResponse.json(
      { error: 'レポートの生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

async function generateMbtiReport(result: any) {
  const prompt = `
以下のMBTI診断結果に基づいて、詳細なレポートを生成してください。レポートには、性格の特徴、キャリアアドバイス、人間関係のアドバイス、自己啓発のヒントを含めてください。

診断結果:
- タイプ: ${result.personalityType}
- 特徴: ${result.description}
- 強み: ${result.strengths.join(', ')}
- 弱み: ${result.weaknesses.join(', ')}
- キャリア適性: ${result.careerSuggestions.join(', ')}

レポートは以下の形式で作成してください：
1. 性格タイプの概要と特徴
2. キャリア開発のアドバイス
3. 人間関係の築き方
4. 自己啓発と成長のヒント
5. 注意点とストレス管理
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたは経験豊富なキャリアカウンセラーで、MBTI診断の専門家です。クライアントの性格タイプに基づいて、実践的で具体的なアドバイスを提供してください。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

async function generateAnimalReport(result: any) {
  const prompt = `
以下の動物占い診断結果に基づいて、詳細なレポートを生成してください。レポートには、性格の特徴、相性、行動パターン、アドバイスを含めてください。

診断結果:
- 動物: ${result.animal}
- 色: ${result.color}
- タイプ: ${result.animalType}
- 特徴: ${result.characteristics.join(', ')}
- 相性: ${JSON.stringify(result.compatibility)}

レポートは以下の形式で作成してください：
1. あなたの動物キャラクターの特徴
2. 行動パターンと思考傾向
3. 相性の良い相手との関係構築
4. 苦手な相手との付き合い方
5. 成長のためのアドバイス
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたは動物占いの専門家で、人々の性格や行動パターンを深く理解しています。クライアントの動物キャラクターに基づいて、実践的で具体的なアドバイスを提供してください。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

async function generateNumerologyReport(result: any) {
  const prompt = `
以下の数秘術診断結果に基づいて、詳細なレポートを生成してください。

診断結果:
- 運命数: ${result.destinyNumber}
- 個性数: ${result.personalityNumber}
- 魂の数: ${result.soulNumber}
- 相性の良い数: ${result.compatibility.join(', ')}

レポートは以下の形式で作成してください：
1. 数字が示すあなたの運命
2. 個性と行動パターン
3. 内なる願望と魂の目的
4. 相性と人間関係
5. 人生の課題と成長のヒント
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたは数秘術の専門家で、数字に秘められた意味を深く理解しています。クライアントの数字に基づいて、人生の指針となるアドバイスを提供してください。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

async function generateFourPillarsReport(result: any) {
  const prompt = `
以下の四柱推命診断結果に基づいて、詳細なレポートを生成してください。

診断結果:
- 天干地支: ${JSON.stringify(result.pillars)}
- 五行バランス: ${JSON.stringify(result.elements)}
- 特徴: ${result.characteristics.join(', ')}
- 強み: ${result.strengths.join(', ')}
- 弱み: ${result.weaknesses.join(', ')}

レポートは以下の形式で作成してください：
1. 命式の解説と基本性格
2. 五行バランスと相性
3. 人生の流れと運勢
4. 適職と才能の活かし方
5. 幸せな人生を送るためのアドバイス
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたは四柱推命の専門家で、天干地支と五行の意味を深く理解しています。クライアントの命式に基づいて、人生の指針となるアドバイスを提供してください。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

async function generateSanmeiReport(result: any) {
  const prompt = `
以下の算命学診断結果に基づいて、詳細なレポートを生成してください。

診断結果:
- 主星: ${result.mainStar}
- 体星: ${result.bodyStar}
- 心星: ${result.spiritStar}
- 特徴: ${result.characteristics.join(', ')}
- 相性: ${JSON.stringify(result.compatibility)}

レポートは以下の形式で作成してください：
1. 三星の意味と基本性格
2. 才能と適性
3. 人間関係と相性
4. 人生の転機とチャンス
5. 幸せな人生を送るためのアドバイス
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたは算命学の専門家で、三星の意味と人生の法則を深く理解しています。クライアントの命式に基づいて、人生の指針となるアドバイスを提供してください。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}