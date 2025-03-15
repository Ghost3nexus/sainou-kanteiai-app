'use client';

import { useState } from 'react';
import { 
  submitUserInfo, 
  fetchNumberAnalysis, 
  fetchTimeSpaceAnalysis, 
  fetchMbtiAnalysis,
  NumberAnalysisResult,
  TimeSpaceAnalysisResult,
  MbtiAnalysisResult
} from '@/lib/api';

type FormData = {
  name: string;
  birthdate: string;
  department: string;
  position: string;
  joinDate: string;
  email: string;
  personalityType: string;
  strengths: string[];
  weaknesses: string[];
};

const initialFormData: FormData = {
  name: '',
  birthdate: '',
  department: '',
  position: '',
  joinDate: '',
  email: '',
  personalityType: '',
  strengths: [],
  weaknesses: [],
};

const personalityTypes = [
  { value: 'ISTJ', label: 'ISTJ - 管理者' },
  { value: 'ISFJ', label: 'ISFJ - 擁護者' },
  { value: 'INFJ', label: 'INFJ - 提唱者' },
  { value: 'INTJ', label: 'INTJ - 建築家' },
  { value: 'ISTP', label: 'ISTP - 巨匠' },
  { value: 'ISFP', label: 'ISFP - 冒険家' },
  { value: 'INFP', label: 'INFP - 仲介者' },
  { value: 'INTP', label: 'INTP - 論理学者' },
  { value: 'ESTP', label: 'ESTP - 起業家' },
  { value: 'ESFP', label: 'ESFP - エンターテイナー' },
  { value: 'ENFP', label: 'ENFP - 広報運動家' },
  { value: 'ENTP', label: 'ENTP - 討論者' },
  { value: 'ESTJ', label: 'ESTJ - 幹部' },
  { value: 'ESFJ', label: 'ESFJ - 領事官' },
  { value: 'ENFJ', label: 'ENFJ - 主人公' },
  { value: 'ENTJ', label: 'ENTJ - 指揮官' },
];

const strengthOptions = [
  '分析力', 'コミュニケーション力', 'リーダーシップ', '創造性', '問題解決能力',
  '適応力', '忍耐力', '協調性', '自己管理能力', '技術スキル', '戦略的思考',
  '決断力', '交渉力', '共感力', '詳細への注意', '時間管理能力'
];

const weaknessOptions = [
  '優柔不断', '完璧主義', '批判に弱い', '過度な自己批判', '過度な競争心',
  'マルチタスクが苦手', '変化への抵抗', '感情的になりやすい', '人前で話すのが苦手',
  '締め切りを守れない', '委任が苦手', '過度な独立心', '忍耐力不足', '詳細への注意不足',
  'フィードバックを求めない', '過度な自信'
];

const departments = [
  '営業部', '技術開発部', 'マーケティング部', '人事部', '財務部',
  'カスタマーサポート部', '経営企画部', '法務部', '総務部', '広報部'
];

const positions = [
  '一般社員', '主任', '係長', '課長', '部長', '次長', '本部長', '取締役', '執行役員', '社長'
];

type AnalysisResult = {
  numberAnalysis: NumberAnalysisResult | null;
  timeSpaceAnalysis: TimeSpaceAnalysisResult | null;
  mbtiAnalysis: MbtiAnalysisResult | null;
};

export default function UserInfoForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    numberAnalysis: null,
    timeSpaceAnalysis: null,
    mbtiAnalysis: null,
  });
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'strengths' | 'weaknesses') => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          [category]: [...prev[category], value],
        };
      } else {
        return {
          ...prev,
          [category]: prev[category].filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setShowResults(false);
    
    try {
      // ユーザー情報をAPIに送信
      const userResponse = await submitUserInfo(formData);
      console.log('ユーザー情報送信結果:', userResponse);
      
      // 各解析エンジンにデータを送信して結果を取得
      const [numberResult, timeSpaceResult, mbtiResult] = await Promise.all([
        fetchNumberAnalysis(formData),
        fetchTimeSpaceAnalysis(formData),
        fetchMbtiAnalysis(formData),
      ]);
      
      // 解析結果を保存
      setAnalysisResult({
        numberAnalysis: numberResult.result || null,
        timeSpaceAnalysis: timeSpaceResult.result || null,
        mbtiAnalysis: mbtiResult.result || null,
      });
      
      setSubmitSuccess(true);
      setShowResults(true);
      
      // 成功メッセージを5秒後に非表示
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('エラー:', error);
      setSubmitError('データの送信中にエラーが発生しました。後でもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setFormData(initialFormData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">従業員情報入力</h2>
      
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          情報が正常に送信されました。診断結果を表示しています。
        </div>
      )}
      
      {submitError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      {!showResults ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="山田 太郎"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="yamada.taro@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                生年月日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                入社日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                部署 <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                <option value="">選択してください</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                役職 <span className="text-red-500">*</span>
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                <option value="">選択してください</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 性格タイプ */}
          <div>
            <label htmlFor="personalityType" className="block text-sm font-medium text-gray-700 mb-1">
              MBTI性格タイプ
            </label>
            <select
              id="personalityType"
              name="personalityType"
              value={formData.personalityType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              <option value="">選択してください（任意）</option>
              {personalityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              MBTIタイプがわからない場合は空欄のままでも構いません。
            </p>
          </div>
          
          {/* 強み */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              強み（最大5つまで選択）
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {strengthOptions.map((strength) => (
                <div key={strength} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`strength-${strength}`}
                    name="strengths"
                    value={strength}
                    checked={formData.strengths.includes(strength)}
                    onChange={(e) => handleCheckboxChange(e, 'strengths')}
                    disabled={formData.strengths.length >= 5 && !formData.strengths.includes(strength)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`strength-${strength}`} className="ml-2 text-sm text-gray-700">
                    {strength}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* 弱み */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              改善したい点（最大5つまで選択）
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {weaknessOptions.map((weakness) => (
                <div key={weakness} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`weakness-${weakness}`}
                    name="weaknesses"
                    value={weakness}
                    checked={formData.weaknesses.includes(weakness)}
                    onChange={(e) => handleCheckboxChange(e, 'weaknesses')}
                    disabled={formData.weaknesses.length >= 5 && !formData.weaknesses.includes(weakness)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`weakness-${weakness}`} className="ml-2 text-sm text-gray-700">
                    {weakness}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? '送信中...' : '診断を実行する'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* 解析結果表示 */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">
              {formData.name}さんの診断結果
            </h3>
            <p className="text-gray-700 mb-2">
              部署: {formData.department} / 役職: {formData.position}
            </p>
          </div>

          {/* 数値解析結果 */}
          {analysisResult.numberAnalysis && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                パフォーマンス分析
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">総合スコア</h4>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                      {analysisResult.numberAnalysis.performanceScore}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">現在のパフォーマンス</p>
                      <p className="text-sm text-indigo-600 font-medium">
                        潜在能力スコア: {analysisResult.numberAnalysis.potentialScore}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">カテゴリ別スコア</h4>
                  <div className="space-y-2">
                    {Object.entries(analysisResult.numberAnalysis.categoryScores).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className="w-32 text-sm text-gray-600">
                          {key === 'leadership' && 'リーダーシップ'}
                          {key === 'communication' && 'コミュニケーション'}
                          {key === 'technicalSkills' && '技術スキル'}
                          {key === 'problemSolving' && '問題解決能力'}
                          {key === 'teamwork' && 'チームワーク'}
                          {key === 'creativity' && '創造性'}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">強みと改善点</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">強み</h5>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {analysisResult.numberAnalysis.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">改善点</h5>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {analysisResult.numberAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">推奨アクション</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {analysisResult.numberAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 時空間解析結果 */}
          {analysisResult.timeSpaceAnalysis && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                環境適応性分析
              </h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">適応性スコア: {analysisResult.timeSpaceAnalysis.adaptabilityScore}</h4>
                <p className="text-gray-600">
                  環境変化への適応能力を示すスコアです。高いスコアは、様々な環境や状況に柔軟に対応できることを示しています。
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">最適な時間帯</h4>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-xl font-semibold text-indigo-800">{analysisResult.timeSpaceAnalysis.optimalTime}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      この時間帯に重要なタスクをスケジュールすることで、パフォーマンスを最大化できます。
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {analysisResult.timeSpaceAnalysis.timePerformance.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-40 text-sm text-gray-600">{item.time}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{item.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">最適な環境</h4>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-xl font-semibold text-indigo-800">{analysisResult.timeSpaceAnalysis.optimalEnvironment}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      この環境での作業が最も効果的です。可能な限りこの環境を活用しましょう。
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {analysisResult.timeSpaceAnalysis.environmentPerformance.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-40 text-sm text-gray-600">{item.environment}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{item.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">最適なチーム規模</h4>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-xl font-semibold text-indigo-800">{analysisResult.timeSpaceAnalysis.optimalTeamSize}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      このチーム規模で最高のパフォーマンスを発揮します。プロジェクト編成の参考にしてください。
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">最適な季節</h4>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-xl font-semibold text-indigo-800">{analysisResult.timeSpaceAnalysis.optimalSeason}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      この季節に重要なプロジェクトを計画することで、より良い結果が期待できます。
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">推奨アクション</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {analysisResult.timeSpaceAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* MBTI解析結果 */}
          {analysisResult.mbtiAnalysis && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                性格タイプ分析
              </h3>
              
              <div className="mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                      {analysisResult.mbtiAnalysis.personalityType}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-indigo-800">
                        {analysisResult.mbtiAnalysis.personalityType}型
                      </h4>
                      <p className="text-sm text-gray-600">
                        {analysisResult.mbtiAnalysis.typeDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">性格特性</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">内向的 (I)</span>
                        <span className="text-sm font-medium text-gray-600">外向的 (E)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${analysisResult.mbtiAnalysis.dimensions.E}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">現実的 (S)</span>
                        <span className="text-sm font-medium text-gray-600">直感的 (N)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${analysisResult.mbtiAnalysis.dimensions.N}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">論理的 (T)</span>
                        <span className="text-sm font-medium text-gray-600">感情的 (F)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${analysisResult.mbtiAnalysis.dimensions.F}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">計画的 (J)</span>
                        <span className="text-sm font-medium text-gray-600">柔軟 (P)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${analysisResult.mbtiAnalysis.dimensions.P}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">強みと弱み</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">強み</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {analysisResult.mbtiAnalysis.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">弱み</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {analysisResult.mbtiAnalysis.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">キャリア適性</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {analysisResult.mbtiAnalysis.careerSuggestions.map((career, index) => (
                      <li key={index}>{career}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">相性の良いタイプ</h4>
                  <div className="space-y-3">
                    {analysisResult.mbtiAnalysis.compatibleTypes.map((type, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-indigo-600">{type.type}型</span>
                          <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                            相性 {type.compatibility}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{type.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">推奨アクション</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {analysisResult.mbtiAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              新しい診断を開始
            </button>
          </div>
        </div>
      )}
    </div>
  );
}