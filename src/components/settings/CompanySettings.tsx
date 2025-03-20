'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/app/api/companies/route';

export default function CompanySettings() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
  });

  // 会社一覧を取得
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        if (data.companies) {
          setCompanies(data.companies);
        }
      } catch (err) {
        setError('会社情報の取得に失敗しました');
        console.error('会社情報取得エラー:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // 会社を追加
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCompanyName }),
      });

      const data = await response.json();
      if (data.success) {
        setCompanies([...companies, data.company]);
        setNewCompanyName('');
      } else {
        setError(data.error || '会社の追加に失敗しました');
      }
    } catch (err) {
      setError('会社の追加中にエラーが発生しました');
      console.error('会社追加エラー:', err);
    }
  };

  // 従業員を追加
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !newEmployee.name.trim()) return;

    try {
      const response = await fetch(`/api/companies/${selectedCompany.id}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });

      const data = await response.json();
      if (data.success) {
        // 会社情報を更新
        const updatedCompanies = companies.map(company => {
          if (company.id === selectedCompany.id) {
            return {
              ...company,
              employees: [...company.employees, data.employee],
            };
          }
          return company;
        });
        setCompanies(updatedCompanies);
        setSelectedCompany(updatedCompanies.find(c => c.id === selectedCompany.id) || null);
        setNewEmployee({ name: '', email: '', department: '', position: '' });
      } else {
        setError(data.error || '従業員の追加に失敗しました');
      }
    } catch (err) {
      setError('従業員の追加中にエラーが発生しました');
      console.error('従業員追加エラー:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* 会社追加フォーム */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">会社を追加</h3>
        <form onSubmit={handleAddCompany} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              会社名
            </label>
            <input
              type="text"
              id="companyName"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="株式会社〇〇"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            追加
          </button>
        </form>
      </div>

      {/* 会社一覧と従業員管理 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">会社一覧と従業員管理</h3>
        
        {companies.length === 0 ? (
          <p className="text-gray-500">登録されている会社はありません</p>
        ) : (
          <div className="space-y-6">
            {/* 会社選択 */}
            <div>
              <label htmlFor="selectCompany" className="block text-sm font-medium text-gray-700">
                会社を選択
              </label>
              <select
                id="selectCompany"
                value={selectedCompany?.id || ''}
                onChange={(e) => {
                  const company = companies.find(c => c.id === e.target.value);
                  setSelectedCompany(company || null);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">選択してください</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 選択された会社の従業員一覧と追加フォーム */}
            {selectedCompany && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-2">
                    {selectedCompany.name}の従業員一覧
                  </h4>
                  {selectedCompany.employees.length === 0 ? (
                    <p className="text-gray-500">従業員は登録されていません</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              名前
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              メールアドレス
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              部署
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              役職
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedCompany.employees.map(employee => (
                            <tr key={employee.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {employee.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {employee.email || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {employee.department || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {employee.position || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 従業員追加フォーム */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">従業員を追加</h4>
                  <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
                          名前 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="employeeName"
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700">
                          メールアドレス
                        </label>
                        <input
                          type="email"
                          id="employeeEmail"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="employeeDepartment" className="block text-sm font-medium text-gray-700">
                          部署
                        </label>
                        <input
                          type="text"
                          id="employeeDepartment"
                          value={newEmployee.department}
                          onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="employeePosition" className="block text-sm font-medium text-gray-700">
                          役職
                        </label>
                        <input
                          type="text"
                          id="employeePosition"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      従業員を追加
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}