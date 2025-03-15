import { NextResponse } from 'next/server';

// モックユーザーデータ
const users = [
  {
    id: '1',
    name: '山田 太郎',
    email: 'yamada.taro@example.com',
    birthdate: '1985-05-15',
    department: '営業部',
    position: '課長',
    joinDate: '2010-04-01',
    personalityType: 'ESTJ',
    strengths: ['リーダーシップ', 'コミュニケーション力', '決断力'],
    weaknesses: ['完璧主義', '批判に弱い'],
    performanceScore: 85,
  },
  {
    id: '2',
    name: '佐藤 花子',
    email: 'sato.hanako@example.com',
    birthdate: '1990-08-23',
    department: '人事部',
    position: '係長',
    joinDate: '2015-04-01',
    personalityType: 'ENFJ',
    strengths: ['共感力', 'コミュニケーション力', '協調性'],
    weaknesses: ['優柔不断', '感情的になりやすい'],
    performanceScore: 92,
  },
  {
    id: '3',
    name: '鈴木 一郎',
    email: 'suzuki.ichiro@example.com',
    birthdate: '1988-12-10',
    department: '技術開発部',
    position: '主任',
    joinDate: '2012-04-01',
    personalityType: 'INTJ',
    strengths: ['分析力', '問題解決能力', '技術スキル'],
    weaknesses: ['過度な独立心', '人前で話すのが苦手'],
    performanceScore: 78,
  },
];

/**
 * GET /api/users
 * ユーザー一覧を取得するエンドポイント
 */
export async function GET(request: Request) {
  // URLからクエリパラメータを取得
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department');
  
  // 部署でフィルタリング（指定がある場合）
  let filteredUsers = users;
  if (department) {
    filteredUsers = users.filter(user => user.department === department);
  }
  
  // 遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    users: filteredUsers,
    total: filteredUsers.length,
  });
}

/**
 * POST /api/users
 * 新しいユーザー情報を登録するエンドポイント
 */
export async function POST(request: Request) {
  try {
    // リクエストボディからユーザーデータを取得
    const userData = await request.json();
    
    // バリデーション（実際のプロジェクトではより厳密に行う）
    if (!userData.name || !userData.email) {
      return NextResponse.json(
        { error: '名前とメールアドレスは必須です' },
        { status: 400 }
      );
    }
    
    // 新しいユーザーIDを生成（実際のプロジェクトではDBが自動生成）
    const newId = (users.length + 1).toString();
    
    // 新しいユーザーオブジェクトを作成
    const newUser = {
      id: newId,
      ...userData,
      performanceScore: Math.floor(Math.random() * 30) + 70, // 70-99のランダムなスコア
    };
    
    // ユーザーリストに追加（実際のプロジェクトではDBに保存）
    users.push(newUser);
    
    // 遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      message: 'ユーザー情報が正常に登録されました',
      user: newUser,
    });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}