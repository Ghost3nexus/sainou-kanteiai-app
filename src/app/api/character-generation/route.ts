import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, result } = data;

    let prompt = '';
    if (type === 'mbti') {
      prompt = `以下のMBTI性格タイプの人物をアニメ風のキャラクターとして描写してください。
性格タイプ: ${result.personalityType}
特徴:
- ${result.strengths.join('\n- ')}
- ${result.weaknesses.join('\n- ')}

以下の要素を含めて、300文字程度で魅力的なキャラクター設定を作成してください：
1. 外見的特徴（髪型、服装など）
2. 性格的特徴（コミュニケーションスタイル、行動パターンなど）
3. 趣味や好きなこと
4. 普段の口癖や特徴的な話し方
5. 周囲との関わり方`;
    } else if (type === 'animalFortune') {
      prompt = `以下の動物占いの結果をアニメ風のキャラクターとして描写してください。
動物: ${result.animal}
色: ${result.color}
タイプ: ${result.animalType}
特徴:
- ${result.characteristics.join('\n- ')}

以下の要素を含めて、300文字程度で魅力的なキャラクター設定を作成してください：
1. 動物の特徴を活かした外見（髪型、服装、アクセサリーなど）
2. 色のイメージを取り入れたデザイン要素
3. 性格的特徴（コミュニケーションスタイル、行動パターンなど）
4. 趣味や好きなこと
5. 普段の口癖や特徴的な話し方`;
    } else {
      return NextResponse.json(
        { error: '未対応の占いタイプです' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたは占い結果に基づいて魅力的なアニメキャラクターを設定する専門家です。ユーザーの性格や特徴を活かしながら、親しみやすく個性的なキャラクター設定を作成してください。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
    });

    const characterDescription = completion.choices[0].message.content;

    // キャラクター画像生成（DALL-E）
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create an anime-style character portrait based on this description: ${characterDescription}. The style should be colorful and appealing, with clear facial features and expressions that reflect the personality. Include relevant symbols or elements that represent their traits. Make it suitable for a profile picture.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    const imageUrl = imageResponse.data[0].url;

    return NextResponse.json({
      success: true,
      character: {
        description: characterDescription,
        imageUrl: imageUrl,
      },
    });
  } catch (error) {
    console.error('キャラクター生成エラー:', error);
    return NextResponse.json(
      { error: 'キャラクターの生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}