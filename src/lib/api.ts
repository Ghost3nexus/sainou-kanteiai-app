/**
 * APIとの連携を行うユーティリティ関数
 *
 * このファイルでは、バックエンドAPIとの通信に必要な関数を定義しています。
 * 実際のプロジェクトでは、環境変数からAPIのベースURLを取得するなど、
 * より柔軟な設定が必要になる場合があります。
 */

// APIレスポンスの型定義
// ユーザー情報の型定義
export type UserInfo = {
  id: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export type ApiResponse<T> = {
  success: boolean;
  result?: T;
  message?: string;
  error?: string;
  user?: UserInfo;
};

// 数値解析結果の型定義
export type NumberAnalysisResult = {
  performanceScore: number;
  categoryScores: {
    leadership: number;
    communication: number;
    technicalSkills: number;
    problemSolving: number;
    teamwork: number;
    creativity: number;
  };
  timeSeriesData: Array<{ month: string; value: number }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  potentialScore: number;
};

// 時空間解析結果の型定義
export type TimeSpaceAnalysisResult = {
  adaptabilityScore: number;
  timePerformance: Array<{ time: string; score: number }>;
  optimalTime: string;
  environmentPerformance: Array<{ environment: string; score: number }>;
  optimalEnvironment: string;
  teamSizePerformance: Array<{ size: string; score: number }>;
  optimalTeamSize: string;
  seasonalPerformance: Array<{ season: string; score: number }>;
  optimalSeason: string;
  recommendations: string[];
  adaptabilityTrend: Array<{ month: string; value: number }>;
};

// MBTI解析結果の型定義
export type MbtiAnalysisResult = {
  personalityType: string;
  typeDescription: string;
  dimensions: Record<string, number>;
  dimensionDescriptions: Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  careerSuggestions: string[];
  compatibleTypes: Array<{ type: string; compatibility: number; reason: string }>;
  recommendations: string[];
};

// 数秘術結果の型定義
export type NumerologyResult = {
  name: string;
  destinyNumber: number;
  personalityNumber: number;
  soulNumber: number;
  compatibility: number[];
  destinyDescription: string;
  personalityDescription: string;
  soulDescription: string;
  summary: string;
};

// 四柱推命結果の型定義
export type FourPillarsResult = {
  name?: string;
  birthdate: string;
  birthtime: string;
  gender: string;
  elements: Record<string, number>;
  pillars: Array<{
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  }>;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  lifeDirection: string;
  compatibility: Record<string, string[]>;
  summary: string;
};

// 算命学結果の型定義
export type SanmeiResult = {
  name?: string;
  birthdate: string;
  birthtime?: string;
  gender: string;
  mainStar: string;
  bodyStar: string;
  spiritStar: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  lifeDirection: string;
  compatibility: {
    good: string[];
    bad?: string[];
  };
  summary: string;
  elements: Record<string, number>;
  fourPillars: Record<string, {
    stem: string;
    branch: string;
  }>;
  majorFortunes: Array<{
    age: number;
    year: number;
    stem: string;
    branch: string;
    isCurrent: boolean;
    description: string;
  }>;
  annualFortunes: Array<{
    year: number;
    stem: string;
    branch: string;
    compatibility: string;
    description: string;
  }>;
};

// MBTI占い結果の型定義
export type MbtiFortuneResult = {
  personalityType: string;
  description: {
    title: string;
    full: string;
  };
  strengths: string[];
  weaknesses: string[];
  compatibleTypes: Array<{
    type: string;
    compatibility: number;
    reason: string;
  }>;
  careerSuggestions: string[];
  summary: string;
};

// 動物占い結果の型定義
export type AnimalFortuneResult = {
  animal: string;
  color: string;
  animalType: string;
  characteristics: string[];
  animalCharacteristic: string;
  colorCharacteristic: string;
  compatibility: {
    good: Array<{ animal: string; color: string }>;
    bad: Array<{ animal: string; color: string }>;
  };
  advice: string;
  description: string;
  summary: string;
};

// 占い結果の型定義（共通）
export type FortuneResult =
  | NumerologyResult
  | FourPillarsResult
  | SanmeiResult
  | MbtiFortuneResult
  | AnimalFortuneResult;

// APIのベースURL
// 実際のプロジェクトでは環境変数から取得することが推奨されます
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';
const API_BASE_URL = '/api'; // 開発環境ではNext.jsのAPI Routesを使用

// 共通のフェッチオプション
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * APIリクエストを送信する汎用関数
 * @param endpoint APIエンドポイント
 * @param method HTTPメソッド
 * @param data リクエストボディに含めるデータ
 * @param options その他のフェッチオプション
 * @returns レスポンスデータ
 */
// APIリクエストデータの型定義
export type ApiRequestData = Record<string, unknown>;

async function fetchAPI<T>(
  endpoint: string,
  method: string = 'GET',
  data?: ApiRequestData,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const fetchOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    method,
  };

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, fetchOptions);

    // レスポンスが成功しなかった場合はエラーをスロー
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `APIリクエストが失敗しました: ${response.status}`
      );
    }

    // 204 No Contentの場合は空のオブジェクトを返す
    if (response.status === 204) {
      return {} as T;
    }

    // JSONレスポンスをパース
    return await response.json();
  } catch (error) {
    console.error('APIリクエストエラー:', error);
    throw error;
  }
}

/**
 * 数値解析APIを呼び出す関数
 * @param data 解析に必要なデータ
 * @returns 解析結果
 */
export async function fetchNumberAnalysis(data: ApiRequestData): Promise<ApiResponse<NumberAnalysisResult>> {
  return fetchAPI<ApiResponse<NumberAnalysisResult>>('/parse/number', 'POST', data);
}

/**
 * 時空間解析APIを呼び出す関数
 * @param data 解析に必要なデータ
 * @returns 解析結果
 */
export async function fetchTimeSpaceAnalysis(data: ApiRequestData): Promise<ApiResponse<TimeSpaceAnalysisResult>> {
  return fetchAPI<ApiResponse<TimeSpaceAnalysisResult>>('/parse/time-space', 'POST', data);
}

/**
 * 心理診断APIを呼び出す関数
 * @param data 診断に必要なデータ
 * @returns 診断結果
 */
export async function fetchMbtiAnalysis(data: ApiRequestData): Promise<ApiResponse<MbtiAnalysisResult>> {
  return fetchAPI<ApiResponse<MbtiAnalysisResult>>('/parse/mbti', 'POST', data);
}

/**
 * ユーザー情報を送信する関数
 * @param userData ユーザー情報
 * @returns 処理結果
 */
export async function submitUserInfo(userData: ApiRequestData): Promise<ApiResponse<UserInfo>> {
  return fetchAPI<ApiResponse<any>>('/users', 'POST', userData);
}

/**
 * 全ユーザーのリストを取得する関数
 * @param params クエリパラメータ
 * @returns ユーザーリスト
 */
export async function fetchUsers(params?: Record<string, string>) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchAPI(`/users${queryString}`);
}

/**
 * 特定のユーザー情報を取得する関数
 * @param userId ユーザーID
 * @returns ユーザー情報
 */
export async function fetchUserById(userId: string) {
  return fetchAPI(`/users/${userId}`);
}

/**
 * 部署別の統計情報を取得する関数
 * @param departmentId 部署ID（省略可）
 * @returns 統計情報
 */
export async function fetchDepartmentStats(departmentId?: string) {
  const endpoint = departmentId ? `/stats/departments/${departmentId}` : '/stats/departments';
  return fetchAPI(endpoint);
}

/**
 * チーム相性情報を取得する関数
 * @param teamId チームID
 * @returns 相性情報
 */
export async function fetchTeamCompatibility(teamId: string) {
  return fetchAPI(`/teams/${teamId}/compatibility`);
}

/**
 * 育成プランを取得する関数
 * @param userId ユーザーID
 * @returns 育成プラン
 */
export async function fetchDevelopmentPlan(userId: string) {
  return fetchAPI(`/users/${userId}/development-plan`);
}

/**
 * ダッシュボード用のサマリーデータを取得する関数
 * @param params フィルターパラメータ
 * @returns ダッシュボードデータ
 */
export async function fetchDashboardSummary(params?: Record<string, string>) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchAPI(`/dashboard/summary${queryString}`);
}

/**
 * 数秘術の診断を行う関数
 * @param data 診断に必要なデータ
 * @returns 診断結果
 */
export async function fetchNumerologyFortune(data: ApiRequestData): Promise<ApiResponse<NumerologyResult>> {
  return fetchAPI<ApiResponse<NumerologyResult>>('/fortune/numerology', 'POST', data);
}

/**
 * 四柱推命の診断を行う関数
 * @param data 診断に必要なデータ
 * @returns 診断結果
 */
export async function fetchFourPillarsFortune(data: ApiRequestData): Promise<ApiResponse<FourPillarsResult>> {
  return fetchAPI<ApiResponse<FourPillarsResult>>('/fortune/fourPillars', 'POST', data);
}

/**
 * 算命学の診断を行う関数
 * @param data 診断に必要なデータ
 * @returns 診断結果
 */
export async function fetchSanmeiFortune(data: ApiRequestData): Promise<ApiResponse<SanmeiResult>> {
  return fetchAPI<ApiResponse<SanmeiResult>>('/fortune/sanmei', 'POST', data);
}

/**
 * MBTIの診断を行う関数
 * @param data 診断に必要なデータ
 * @returns 診断結果
 */
export async function fetchMbtiFortune(data: ApiRequestData): Promise<ApiResponse<MbtiFortuneResult>> {
  return fetchAPI<ApiResponse<MbtiFortuneResult>>('/fortune/mbti', 'POST', data);
}

/**
 * 動物占いの診断を行う関数
 * @param data 診断に必要なデータ
 * @returns 診断結果
 */
export async function fetchAnimalFortune(data: ApiRequestData): Promise<ApiResponse<AnimalFortuneResult>> {
  return fetchAPI<ApiResponse<AnimalFortuneResult>>('/fortune/animalFortune', 'POST', data);
}

/**
 * 占い結果を保存する関数
 * @param data 保存するデータ
 * @returns 保存結果
 */
export async function saveFortuneResult(data: ApiRequestData): Promise<ApiResponse<{ id: string }>> {
  return fetchAPI<ApiResponse<{ id: string }>>('/fortune/save', 'POST', data);
}

/**
 * 保存された占い結果を取得する関数
 * @param resultId 結果ID
 * @returns 占い結果
 */
export async function fetchFortuneResult(resultId: string): Promise<ApiResponse<FortuneResult>> {
  return fetchAPI(`/fortune/save/${resultId}`);
}

/**
 * ユーザーの占い結果リストを取得する関数
 * @param userId ユーザーID
 * @returns 占い結果リスト
 */
export async function fetchUserFortuneResults(userId: string): Promise<ApiResponse<FortuneResult[]>> {
  return fetchAPI<ApiResponse<any[]>>(`/fortune/save?userId=${userId}`);
}