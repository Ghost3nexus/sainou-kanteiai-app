import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 会社情報を保存するディレクトリ
const COMPANIES_DIR = path.join(process.cwd(), 'data', 'companies');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(COMPANIES_DIR)) {
  fs.mkdirSync(COMPANIES_DIR, { recursive: true });
}

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  employees: Array<{
    id: string;
    name: string;
    email?: string;
    department?: string;
    position?: string;
    createdAt: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // バリデーション
    if (!data.name) {
      return NextResponse.json(
        { error: '会社名は必須です' },
        { status: 400 }
      );
    }
    
    // 会社IDを生成
    const companyId = uuidv4();
    
    // 保存するデータを作成
    const company: Company = {
      id: companyId,
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      employees: [],
    };
    
    // ファイルに保存
    const filePath = path.join(COMPANIES_DIR, `${companyId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(company, null, 2));
    
    return NextResponse.json({
      success: true,
      message: '会社情報が正常に保存されました',
      company,
    });
  } catch (error) {
    console.error('会社情報保存エラー:', error);
    return NextResponse.json(
      { error: '会社情報の保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const companies: Company[] = [];
    
    // 会社情報ディレクトリ内のすべてのファイルを読み込む
    const files = fs.readdirSync(COMPANIES_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(COMPANIES_DIR, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        companies.push(JSON.parse(data));
      }
    }
    
    // 会社名でソート
    companies.sort((a, b) => a.name.localeCompare(b.name));
    
    return NextResponse.json({ companies });
  } catch (error) {
    console.error('会社情報取得エラー:', error);
    return NextResponse.json(
      { error: '会社情報の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}