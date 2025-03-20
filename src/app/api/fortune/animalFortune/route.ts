import { NextResponse } from 'next/server';
import { mockResults } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 実際の動物占い診断の代わりにモックデータを返す
    return NextResponse.json({
      success: true,
      result: mockResults.animalFortune
    });
  } catch (error) {
    console.error('動物占い診断エラー:', error);
    return NextResponse.json(
      { error: '動物占い診断中にエラーが発生しました' },
      { status: 500 }
    );
  }
}