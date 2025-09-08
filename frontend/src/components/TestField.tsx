import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

const TestField: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ countries: Array<{ code: string; name: string }> } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getCountries();
        if (response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'データの取得に失敗しました');
        }
      } catch (err) {
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-red-500 py-4">エラー: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">REST API接続テスト</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <p className="text-green-800 font-medium">REST APIからの応答:</p>
        <p className="text-green-600 mt-2">
          国数: {data?.countries?.length || 0}カ国
        </p>
        <div className="mt-4">
          <p className="text-green-800 font-medium">最初の5カ国:</p>
          <ul className="text-green-600 mt-2">
            {data?.countries?.slice(0, 5).map((country, index) => (
              <li key={index}>{country.name} ({country.code})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestField; 