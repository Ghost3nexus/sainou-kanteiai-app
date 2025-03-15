import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 結果を保存するディレクトリ
const RESULTS_DIR = path.join(process.cwd(), 'data', 'fortune-results');

/**
 * GET /api/fortune/save/[id]
 * 特定の占い結果を取得するエンドポイント
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resultId = params.id;
    
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
    const result = JSON.parse(fileContent);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('結果取得エラー:', error);
    return NextResponse.json(
      { error: '結果の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/fortune/save/[id]
 * 特定の占い結果を削除するエンドポイント
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resultId = params.id;
    
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
    
    // 結果ファイルを読み込んでユーザーIDを取得
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const result = JSON.parse(fileContent);
    const userId = result.userId;
    
    // 結果ファイルを削除
    fs.unlinkSync(filePath);
    
    // ユーザーIDがある場合は、ユーザーの結果リストからも削除
    if (userId) {
      const userResultsPath = path.join(RESULTS_DIR, 'users', `${userId}.json`);
      
      if (fs.existsSync(userResultsPath)) {
        const userResultsData = fs.readFileSync(userResultsPath, 'utf-8');
        let userResults = JSON.parse(userResultsData);
        
        // 削除対象の結果を除外
        userResults = userResults.filter((item: any) => item.id !== resultId);
        
        // ユーザー結果を保存
        fs.writeFileSync(userResultsPath, JSON.stringify(userResults, null, 2));
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '結果が正常に削除されました',
    });
  } catch (error) {
    console.error('結果削除エラー:', error);
    return NextResponse.json(
      { error: '結果の削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
}