import { NextResponse } from 'next/server';
import { mockResults } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 実際の算命学診断の代わりにモックデータを返す
    return NextResponse.json({
      success: true,
      result: mockResults.sanmei
    });
  } catch (error) {
    console.error('算命学診断エラー:', error);
    return NextResponse.json(
      { error: '算命学診断中にエラーが発生しました' },
      { status: 500 }
    );
  }
}