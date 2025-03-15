'use client';

import { useEffect, useRef } from 'react';

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
};

type ChartProps = {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar';
  data: ChartData;
  title?: string;
  height?: number;
  width?: number;
  className?: string;
};

export default function DashboardChart({ 
  type, 
  data, 
  title, 
  height = 300, 
  width = 400,
  className = ''
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // このコンポーネントは、実際のプロジェクトではChart.jsなどのライブラリを使用して
    // 実装されます。ここではモックの表示のみを行います。
    
    if (chartRef.current) {
      // 実際のプロジェクトでは、以下のようなコードでChart.jsを初期化します
      /*
      import Chart from 'chart.js/auto';
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type,
        data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: !!title,
              text: title || '',
            },
          },
        },
      });
      
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
      */
    }
  }, [type, data, title]);

  // モック表示用のスタイル
  const chartColors = {
    bar: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    line: 'bg-gradient-to-r from-green-400 to-teal-500',
    pie: 'bg-gradient-to-r from-purple-500 to-pink-500',
    doughnut: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    radar: 'bg-gradient-to-r from-red-500 to-pink-500',
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
      
      {/* 実際のプロジェクトでは、以下のcanvasにChart.jsがレンダリングされます */}
      {/* <canvas ref={chartRef} height={height} width={width}></canvas> */}
      
      {/* モック表示用 */}
      <div 
        ref={chartRef}
        className={`flex items-center justify-center ${chartColors[type]} text-white rounded-lg`}
        style={{ height: `${height}px`, width: '100%' }}
      >
        <div className="text-center p-4">
          <p className="text-xl font-bold mb-2">{type.charAt(0).toUpperCase() + type.slice(1)} Chart</p>
          <p className="text-sm opacity-80">
            {data.labels.length} ラベル, {data.datasets.length} データセット
          </p>
          <p className="text-xs mt-4 opacity-70">
            実際のプロジェクトでは、ここにChart.jsによる{type}チャートが表示されます
          </p>
        </div>
      </div>
      
      {/* データの概要を表示（モック用） */}
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">データ概要:</p>
        <ul className="mt-1 space-y-1">
          {data.datasets.map((dataset, index) => (
            <li key={index} className="flex justify-between">
              <span>{dataset.label}:</span>
              <span className="font-medium">
                平均: {Math.round(dataset.data.reduce((a, b) => a + b, 0) / dataset.data.length)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}