'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  totalTests: number;
  testTypeDistribution: Record<string, number>;
  mbtiDistribution: Record<string, number>;
  animalDistribution: Record<string, { total: number; byColor: Record<string, number> }>;
  averageAge: number;
  genderDistribution: Record<string, number>;
  timeOfDayDistribution: Record<string, number>;
  monthlyTrends: Record<string, number>;
  compatibilityStats: {
    mbti: Record<string, { matches: number; averageScore: number }>;
    animal: Record<string, { matches: number; averageScore: number }>;
  };
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CDEF', '#FF9AA2', '#B5EAD7', '#C7CEEA', '#E2F0CB'
];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
        データが見つかりません
      </div>
    );
  }

  // 月別トレンドデータの整形
  const monthlyTrendsData = Object.entries(data.monthlyTrends).map(([month, count]) => ({
    month,
    count
  }));

  // テストタイプ分布データの整形
  const testTypeData = Object.entries(data.testTypeDistribution).map(([type, count]) => ({
    type: type === 'numerology' ? '数秘術' :
          type === 'fourPillars' ? '四柱推命' :
          type === 'sanmei' ? '算命学' :
          type === 'mbti' ? 'MBTI' :
          type === 'animalFortune' ? '動物占い' : type,
    count
  }));

  // MBTI分布データの整形
  const mbtiData = Object.entries(data.mbtiDistribution).map(([type, count]) => ({
    type,
    count
  }));

  return (
    <div className="space-y-8">
      {/* 概要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">総テスト数</h3>
          <p className="text-3xl font-bold text-indigo-600">{data.totalTests}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">平均年齢</h3>
          <p className="text-3xl font-bold text-indigo-600">{data.averageAge}歳</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">最も人気の診断</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {testTypeData.sort((a, b) => b.count - a.count)[0]?.type || '-'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">最も多いMBTI</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {mbtiData.sort((a, b) => b.count - a.count)[0]?.type || '-'}
          </p>
        </div>
      </div>

      {/* 月別トレンド */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">月別診断数の推移</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="診断数" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* テストタイプ分布 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">診断タイプの分布</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={testTypeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {testTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MBTI分布 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">MBTI分布</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mbtiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="人数" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 時間帯分布 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">時間帯別診断数</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(data.timeOfDayDistribution).map(([hour, count]) => ({
                hour,
                count
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="診断数" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}