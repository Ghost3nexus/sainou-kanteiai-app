import { NextResponse } from 'next/server';
import { mockResults } from '@/lib/mockData';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // IDに基づいてモックデータから適切な結果を返す
    // 実際のアプリケーションでは、このIDを使ってデータベースから結果を取得する
    const resultId = params.id;
    
    // ランダムにモックデータから結果を選択
    const types = Object.keys(mockResults) as (keyof typeof mockResults)[];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const result = mockResults[randomType];

    return NextResponse.json({
      success: true,
      result: {
        id: resultId,
        type: randomType,
        result: result,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('結果の取得エラー:', error);
    return NextResponse.json(
      { error: '結果の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
