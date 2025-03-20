import { NextResponse } from 'next/server';
import { mockResults } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 実際の数秘術診断の代わりにモックデータを返す
    return NextResponse.json({
      success: true,
      result: mockResults.numerology
    });
  } catch (error) {
    console.error('数秘術診断エラー:', error);
    return NextResponse.json(
      { error: '数秘術診断中にエラーが発生しました' },
      { status: 500 }
    );
  }
}