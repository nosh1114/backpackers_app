import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Search, ChevronDown, X } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag_emoji: string;
}

export function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
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
          // APIでバックエンドから取得したデータをセット
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

  // 検索に基づいて国をフィルタリング
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    
    return countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countries, countrySearch]);

  // 選択された国を取得
  const selectedCountry = countries.find(country => country.code === countryCode);

  // 選択された国をセット
  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.code);
    setCountrySearch(country.name);
    setIsCountryDropdownOpen(false);
  };

  // 国を検索
  const handleCountrySearchChange = (value: string) => {
    setCountrySearch(value);
    setIsCountryDropdownOpen(true);
    
    // 検索値が選択された国と一致しない場合、選択をクリア
    if (selectedCountry && value !== selectedCountry.name) {
      setCountryCode('');
    }
  };

  const clearCountrySelection = () => {
    setCountryCode('');
    setCountrySearch('');
    setIsCountryDropdownOpen(false);
  };

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
              <div className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="country"
                    value={countrySearch}
                    onChange={(e) => handleCountrySearchChange(e.target.value)}
                    onFocus={() => setIsCountryDropdownOpen(true)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="国名または国コードで検索..."
                    autoComplete="off"
                  />
                  {countryCode && (
                    <button
                      type="button"
                      onClick={clearCountrySelection}
                      className="absolute inset-y-0 right-8 flex items-center pr-2"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isCountryDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                            countryCode === country.code ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{country.name}</span>
                            <span className="text-sm text-gray-500">{country.code}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-center">
                        該当する国が見つかりません
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectedCountry && (
                <p className="mt-1 text-sm text-green-600">
                  選択中: {selectedCountry.name} ({selectedCountry.code})
                </p>
              )}
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
