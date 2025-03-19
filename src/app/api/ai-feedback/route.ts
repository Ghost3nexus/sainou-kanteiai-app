import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// OpenAI APIの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 結果を保存するディレクトリ
const RESULTS_DIR = path.join(process.cwd(), 'data', 'fortune-results');

export async function POST(request: Request) {
  try {
    const { resultId } = await request.json();
    
    if (!resultId) {
      return NextResponse.json(
        { error: '結果IDが指定されていません' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(RESULTS_DIR, `${resultId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '指定された結果が見つかりません' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const resultData = JSON.parse(fileContent);
    
    // AIフィードバックを生成
    const feedback = await generateAIFeedback(resultData);
    
    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('AIフィードバックエラー:', error);
    return NextResponse.json(
      { error: 'AIフィードバックの生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// AIフィードバックを生成する関数
async function generateAIFeedback(resultData: any) {
  const type = resultData.type;
  const result = resultData.result.result;
  
  // 占いタイプに応じたプロンプトを作成
  let prompt = '';
  
  switch (type) {
    case 'numerology':
      prompt = `
        以下の数秘術診断結果に基づいて、パーソナライズされたキャリアアドバイスと自己啓発のためのフィードバックを提供してください。
        
        名前: ${result.name}
        運命数: ${result.destinyNumber}
        個性数: ${result.personalityNumber}
        魂の数: ${result.soulNumber}
        
        運命数の意味: ${result.destinyDescription}
        個性数の意味: ${result.personalityDescription}
        魂の数の意味: ${result.soulDescription}
        
        総合診断: ${result.summary}
        
        以下の点について具体的なアドバイスを提供してください：
        1. キャリア開発のための具体的なステップ
        2. 強みを活かすための実践的な方法
        3. 弱みを克服するための戦略
        4. 人間関係を向上させるためのヒント
        5. 自己成長のための習慣や活動
      `;
      break;
      
    case 'fourPillars':
      prompt = `
        以下の四柱推命診断結果に基づいて、パーソナライズされたキャリアアドバイスと自己啓発のためのフィードバックを提供してください。
        
        生年月日: ${result.birthdate}
        生まれた時間: ${result.birthtime}
        性別: ${result.gender}
        
        五行バランス: ${JSON.stringify(result.elements)}
        四柱: ${JSON.stringify(result.pillars)}
        性格特性: ${result.characteristics.join(', ')}
        強み: ${result.strengths.join(', ')}
        弱み: ${result.weaknesses.join(', ')}
        人生の方向性: ${result.lifeDirection}
        
        総合診断: ${result.summary}
        
        以下の点について具体的なアドバイスを提供してください：
        1. キャリア開発のための具体的なステップ
        2. 強みを活かすための実践的な方法
        3. 弱みを克服するための戦略
        4. 人間関係を向上させるためのヒント
        5. 自己成長のための習慣や活動
      `;
      break;
      
    case 'sanmei':
      prompt = `
        以下の算命学診断結果に基づいて、パーソナライズされたキャリアアドバイスと自己啓発のためのフィードバックを提供してください。
        
        生年月日: ${result.birthdate}
        生まれた時間: ${result.birthtime || '不明'}
        性別: ${result.gender}
        
        主星: ${result.mainStar}
        体星: ${result.bodyStar}
        心星: ${result.spiritStar}
        
        五行バランス: ${JSON.stringify(result.elements)}
        性格特性: ${result.characteristics.join(', ')}
        強み: ${result.strengths.join(', ')}
        弱み: ${result.weaknesses.join(', ')}
        人生の方向性: ${result.lifeDirection}
        
        総合診断: ${result.summary}
        
        以下の点について具体的なアドバイスを提供してください：
        1. キャリア開発のための具体的なステップ
        2. 強みを活かすための実践的な方法
        3. 弱みを克服するための戦略
        4. 人間関係を向上させるためのヒント
        5. 自己成長のための習慣や活動
      `;
      break;
      
    case 'mbti':
      prompt = `
        以下のMBTI診断結果に基づいて、パーソナライズされたキャリアアドバイスと自己啓発のためのフィードバックを提供してください。
        
        性格タイプ: ${result.personalityType}
        タイプの説明: ${result.description.full}
        強み: ${result.strengths.join(', ')}
        弱み: ${result.weaknesses.join(', ')}
        キャリア提案: ${result.careerSuggestions.join(', ')}
        
        総合診断: ${result.summary}
        
        以下の点について具体的なアドバイスを提供してください：
        1. このMBTIタイプに最適な職場環境
        2. チームでの効果的な協力方法
        3. ストレス管理のための戦略
        4. コミュニケーションスキルの向上方法
        5. 個人的な成長のための習慣や活動
      `;
      break;
      
    case 'animalFortune':
      prompt = `
        以下の動物占い診断結果に基づいて、パーソナライズされたキャリアアドバイスと自己啓発のためのフィードバックを提供してください。
        
        動物: ${result.animal}
        色: ${result.color}
        タイプ: ${result.animalType}
        
        性格特性: ${result.characteristics.join(', ')}
        動物の特徴: ${result.animalCharacteristic}
        色の特徴: ${result.colorCharacteristic}
        アドバイス: ${result.advice}
        
        総合診断: ${result.summary}
        
        以下の点について具体的なアドバイスを提供してください：
        1. この動物タイプに最適な職場環境
        2. チームでの効果的な協力方法
        3. ストレス管理のための戦略
        4. コミュニケーションスキルの向上方法
        5. 個人的な成長のための習慣や活動
      `;
      break;
      
    default:
      prompt = `
        以下の診断結果に基づいて、パーソナライズされたキャリアアドバイスと自己啓発のためのフィードバックを提供してください。
        
        診断タイプ: ${type}
        診断結果: ${JSON.stringify(result)}
        
        以下の点について具体的なアドバイスを提供してください：
        1. キャリア開発のための具体的なステップ
        2. 強みを活かすための実践的な方法
        3. 弱みを克服するための戦略
        4. 人間関係を向上させるためのヒント
        5. 自己成長のための習慣や活動
      `;
  }
  
  try {
    // OpenAI APIを使用してフィードバックを生成
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "あなたは才能開発と自己啓発の専門家です。占い結果に基づいて、実用的で具体的なアドバイスを提供してください。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    const feedbackText = response.choices[0].message.content || '申し訳ありませんが、フィードバックを生成できませんでした。';
    
    // フィードバックを構造化
    const feedback = {
      type: type,
      resultId: resultData.id,
      generatedAt: new Date().toISOString(),
      content: feedbackText,
      sections: extractSections(feedbackText),
    };
    
    return feedback;
  } catch (error) {
    console.error('OpenAI API エラー:', error);
    
    // エラーが発生した場合はデフォルトのフィードバックを返す
    return {
      type: type,
      resultId: resultData.id,
      generatedAt: new Date().toISOString(),
      content: '申し訳ありませんが、AIフィードバックの生成中にエラーが発生しました。後でもう一度お試しください。',
      sections: {
        'エラー': 'AIフィードバックの生成中にエラーが発生しました。後でもう一度お試しください。'
      },
      error: true,
    };
  }
}

// フィードバックからセクションを抽出する関数
function extractSections(text: string) {
  const sections: Record<string, string> = {};
  
  // 数字+ドット+スペースで始まる行を見つける
  const sectionRegex = /(\d+\.\s+[^\n]+)([\s\S]*?)(?=\d+\.\s+|$)/g;
  let match;
  
  while ((match = sectionRegex.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    sections[title] = content;
  }
  
  // セクションが見つからない場合は全体を1つのセクションとして扱う
  if (Object.keys(sections).length === 0) {
    sections['フィードバック'] = text;
  }
  
  return sections;
}