import { NextResponse } from 'next/server';
import { mockResults } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 実際の四柱推命診断の代わりにモックデータを返す
    return NextResponse.json({
      success: true,
      result: mockResults.fourPillars
    });
  } catch (error) {
    console.error('四柱推命診断エラー:', error);
    return NextResponse.json(
      { error: '四柱推命診断中にエラーが発生しました' },
      { status: 500 }
    );
  }
}