import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 実際のデータ保存の代わりに、IDを生成して返す
    const resultId = uuidv4();

    return NextResponse.json({
      success: true,
      result: {
        id: resultId,
        ...data,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('結果の保存エラー:', error);
    return NextResponse.json(
      { error: '結果の保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
}