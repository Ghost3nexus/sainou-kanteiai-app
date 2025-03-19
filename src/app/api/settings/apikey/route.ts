import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 設定を保存するディレクトリ
const SETTINGS_DIR = path.join(process.cwd(), 'data', 'settings');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(SETTINGS_DIR)) {
  fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// APIキー設定ファイルのパス
const API_KEY_PATH = path.join(SETTINGS_DIR, 'api_keys.json');

// APIキーを取得
export async function GET() {
  try {
    // 設定ファイルが存在しない場合は空のオブジェクトを返す
    if (!fs.existsSync(API_KEY_PATH)) {
      return NextResponse.json({
        openai: '',
      });
    }
    
    // 設定ファイルを読み込む
    const fileContent = fs.readFileSync(API_KEY_PATH, 'utf-8');
    const apiKeys = JSON.parse(fileContent);
    
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('APIキー取得エラー:', error);
    return NextResponse.json(
      { error: 'APIキーの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// APIキーを保存
export async function POST(request: Request) {
  try {
    const { openai } = await request.json();
    
    // バリデーション
    if (openai === undefined) {
      return NextResponse.json(
        { error: 'OpenAI APIキーが指定されていません' },
        { status: 400 }
      );
    }
    
    // 既存の設定を読み込む
    let apiKeys = { openai: '' };
    if (fs.existsSync(API_KEY_PATH)) {
      const fileContent = fs.readFileSync(API_KEY_PATH, 'utf-8');
      apiKeys = JSON.parse(fileContent);
    }
    
    // APIキーを更新
    apiKeys.openai = openai;
    
    // 設定を保存
    fs.writeFileSync(API_KEY_PATH, JSON.stringify(apiKeys, null, 2));
    
    // 環境変数を更新（サーバーサイドのみ）
    process.env.OPENAI_API_KEY = openai;
    
    return NextResponse.json({
      success: true,
      message: 'APIキーが正常に保存されました',
    });
  } catch (error) {
    console.error('APIキー保存エラー:', error);
    return NextResponse.json(
      { error: 'APIキーの保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
}