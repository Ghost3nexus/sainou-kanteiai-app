import { NextResponse } from 'next/server';
import { mockResults } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 実際のMBTI診断の代わりにモックデータを返す
    return NextResponse.json({
      success: true,
      result: mockResults.mbti
    });
  } catch (error) {
    console.error('MBTI診断エラー:', error);
    return NextResponse.json(
      { error: 'MBTI診断中にエラーが発生しました' },
      { status: 500 }
    );
  }
}