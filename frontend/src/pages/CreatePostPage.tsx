import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';

interface Country {
  code: string;
  name: string;
}

export function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 国一覧を取得
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await apiClient.getCountries();
        if (response.data) {
          setCountries(response.data.countries);
        } else {
          setErrors([response.error || '国一覧の取得に失敗しました']);
        }
      } catch (error) {
        setErrors(['国一覧の取得に失敗しました']);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    if (!title.trim() || !content.trim() || !countryCode) {
      setErrors(['タイトル、内容、国を入力してください']);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.createPost({
        title: title.trim(),
        content: content.trim(),
        country_code: countryCode
      });

      if (response.data) {
        // 投稿成功後、投稿一覧ページにリダイレクト
        navigate('/posts');
      } else {
        setErrors([response.error || '投稿に失敗しました']);
      }
    } catch (error) {
      setErrors(['投稿に失敗しました']);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            ログインが必要です
          </h2>
          <p className="text-center text-gray-600 mb-4">
            投稿を作成するにはログインしてください。
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            ログインページへ
          </button>
        </div>
      </div>
    );
  }

  if (countriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            新しい投稿を作成
          </h1>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <ul className="text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="投稿のタイトルを入力してください"
                maxLength={100}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {title.length}/100文字
              </p>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                国 *
              </label>
              <select
                id="country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">国を選択してください</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                内容 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="投稿の内容を入力してください"
                maxLength={10000}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {content.length}/10000文字
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '投稿中...' : '投稿する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
