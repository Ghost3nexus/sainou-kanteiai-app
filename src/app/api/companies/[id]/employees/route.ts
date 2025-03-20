import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Company } from '../../route';

// 会社情報を保存するディレクトリ（/tmpを使用）
const COMPANIES_DIR = path.join('/tmp', 'companies');

// 会社情報を読み込む
function getCompany(companyId: string): Company | null {
  try {
    const filePath = path.join(COMPANIES_DIR, `${companyId}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('会社情報読み込みエラー:', error);
    return null;
  }
}

// 会社情報を保存
function saveCompany(company: Company): boolean {
  try {
    const filePath = path.join(COMPANIES_DIR, `${company.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(company, null, 2));
    return true;
  } catch (error) {
    console.error('会社情報保存エラー:', error);
    return false;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const company = getCompany(companyId);
    
    if (!company) {
      return NextResponse.json(
        { error: '指定された会社が見つかりません' },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    
    // バリデーション
    if (!data.name) {
      return NextResponse.json(
        { error: '従業員名は必須です' },
        { status: 400 }
      );
    }
    
    // 従業員データを作成
    const employee = {
      id: uuidv4(),
      name: data.name,
      email: data.email || null,
      department: data.department || null,
      position: data.position || null,
      createdAt: new Date().toISOString(),
    };
    
    // 従業員を追加
    company.employees.push(employee);
    company.updatedAt = new Date().toISOString();
    
    // 会社情報を更新
    if (!saveCompany(company)) {
      return NextResponse.json(
        { error: '従業員情報の保存中にエラーが発生しました' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '従業員が正常に追加されました',
      employee,
    });
  } catch (error) {
    console.error('従業員追加エラー:', error);
    return NextResponse.json(
      { error: '従業員の追加中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const company = getCompany(companyId);
    
    if (!company) {
      return NextResponse.json(
        { error: '指定された会社が見つかりません' },
        { status: 404 }
      );
    }
    
    // 従業員を名前でソート
    const sortedEmployees = [...company.employees].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    
    return NextResponse.json({ employees: sortedEmployees });
  } catch (error) {
    console.error('従業員一覧取得エラー:', error);
    return NextResponse.json(
      { error: '従業員一覧の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}