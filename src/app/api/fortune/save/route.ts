import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 結果を保存するディレクトリ（/tmpを使用）
const RESULTS_DIR = path.join('/tmp', 'fortune-results');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const data = await request.json();
    
    // バリデーション
    if (!data || !data.type || !data.result) {
      return NextResponse.json(
        { error: '保存に必要なデータが不足しています' },
        { status: 400 }
      );
    }
    
    // 結果IDを生成
    const resultId = uuidv4();
    
    // 保存するデータを作成
    const saveData = {
      id: resultId,
      type: data.type,
      result: data.result,
      userId: data.userId || null,
      createdAt: new Date().toISOString(),
    };
    
    // ファイルに保存
    const filePath = path.join(RESULTS_DIR, `${resultId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(saveData, null, 2));
    
    // ユーザーIDがある場合は、ユーザーの結果リストにも追加
    if (data.userId) {
      const userResultsDir = path.join(RESULTS_DIR, 'users');
      if (!fs.existsSync(userResultsDir)) {
        fs.mkdirSync(userResultsDir, { recursive: true });
      }
      
      const userResultsPath = path.join(userResultsDir, `${data.userId}.json`);
      let userResults = [];
      
      // 既存のユーザー結果があれば読み込む
      if (fs.existsSync(userResultsPath)) {
        const userResultsData = fs.readFileSync(userResultsPath, 'utf-8');
        userResults = JSON.parse(userResultsData);
      }
      
      // 新しい結果を追加
      userResults.push({
        id: resultId,
        type: data.type,
        createdAt: saveData.createdAt,
      });
      
      // ユーザー結果を保存
      fs.writeFileSync(userResultsPath, JSON.stringify(userResults, null, 2));
    }
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      message: '結果が正常に保存されました',
      id: resultId,
    });
  } catch (error) {
    console.error('結果保存エラー:', error);
    return NextResponse.json(
      { error: '結果の保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // ユーザーIDが指定されている場合は、そのユーザーの結果リストを返す
    if (userId) {
      const userResultsPath = path.join(RESULTS_DIR, 'users', `${userId}.json`);
      
      // ユーザーの結果リストが存在しない場合は空の配列を返す
      if (!fs.existsSync(userResultsPath)) {
        return NextResponse.json({ results: [] });
      }
      
      // ユーザーの結果リストを読み込む
      const userResultsData = fs.readFileSync(userResultsPath, 'utf-8');
      const userResults = JSON.parse(userResultsData);
      
      return NextResponse.json({ results: userResults });
    }
    
    // ユーザーIDが指定されていない場合はエラーを返す
    return NextResponse.json(
      { error: 'ユーザーIDが指定されていません' },
      { status: 400 }
    );
  } catch (error) {
    console.error('結果取得エラー:', error);
    return NextResponse.json(
      { error: '結果の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}