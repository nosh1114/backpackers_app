import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Search, ChevronDown, X, Send } from 'lucide-react';

interface Country {
  id: number;
  code: string;
  name: string;
  flag_emoji: string;
}

interface PostFormProps {
  fixedCountryId?: number; // 固定の国ID（国別ページ用）
  onPostCreated?: () => void; // 投稿作成後のコールバック
  placeholder?: string; // プレースホルダーテキスト
  compact?: boolean; // コンパクト表示モード
}

export function PostForm({ 
  fixedCountryId, 
  onPostCreated, 
  placeholder = "何か投稿してみましょう...",
  compact = false 
}: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [countryId, setCountryId] = useState<number | null>(fixedCountryId || null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const { user } = useAuth();

  // 国一覧を取得
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await apiClient.getCountries();
        if (response.data) {
          setCountries(response.data.countries);
        }
      } catch (error) {
        console.error('国一覧の取得に失敗しました:', error);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // 固定の国が設定されている場合、その国の情報を取得
  useEffect(() => {
    if (fixedCountryId && countries.length > 0) {
      const fixedCountry = countries.find(country => country.id === fixedCountryId);
      if (fixedCountry) {
        setCountrySearch(fixedCountry.name);
      }
    }
  }, [fixedCountryId, countries]);

  // 検索に基づいて国をフィルタリング
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    
    return countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countries, countrySearch]);

  // 選択された国を取得
  const selectedCountry = countries.find(country => country.id === countryId);

  // 選択された国をセット
  const handleCountrySelect = (country: Country) => {
    setCountryId(country.id);
    setCountrySearch(country.name);
    setIsCountryDropdownOpen(false);
  };

  // 国を検索
  const handleCountrySearchChange = (value: string) => {
    if (fixedCountryId) return; // 固定の国の場合は検索を無効化
    
    setCountrySearch(value);
    setIsCountryDropdownOpen(true);
    
    // 検索値が選択された国と一致しない場合、選択をクリア
    if (selectedCountry && value !== selectedCountry.name) {
      setCountryId(null);
    }
  };

  const clearCountrySelection = () => {
    if (fixedCountryId) return; // 固定の国の場合はクリアを無効化
    
    setCountryId(null);
    setCountrySearch('');
    setIsCountryDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    if (!title.trim() || countryId === null || !content.trim()) {
      setErrors(['タイトル、国、内容を入力してください']);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.createPost({
        title: title.trim(),
        content: content.trim(),
        country_id: countryId,
      });

      if (response.data) {
        // フォームをリセット
        setTitle('');
        setContent('');
        if (!fixedCountryId) {
          setCountryId(null);
          setCountrySearch('');
        }
        
        // コールバックを実行
        if (onPostCreated) {
          onPostCreated();
        }
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
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 mb-4">投稿するにはログインしてください</p>
        <button
          onClick={() => window.location.href = '/auth'}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          ログイン
        </button>
      </div>
    );
  }

  if (countriesLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <ul className="text-red-600 text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="タイトルを入力..."
            maxLength={100}
            required
          />
        </div>

        {!fixedCountryId && (
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => handleCountrySearchChange(e.target.value)}
                onFocus={() => setIsCountryDropdownOpen(true)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="国を選択..."
                autoComplete="off"
              />
              {countryId && (
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
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isCountryDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm ${
                        countryId === country.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{country.name}</span>
                        <span className="text-xs text-gray-500">{country.code}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500 text-center text-sm">
                    該当する国が見つかりません
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {fixedCountryId && selectedCountry && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>投稿先:</span>
            <span className="font-medium">{selectedCountry.flag_emoji} {selectedCountry.name}</span>
          </div>
        )}

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={compact ? 3 : 4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder={placeholder}
            maxLength={10000}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              {content.length}/10000文字
            </p>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim() || countryId === null}
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? '投稿中...' : '投稿'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
