import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { MapPin, X, ChevronDown, Search, Check, Loader2, ArrowLeft, Luggage, Smartphone, Plane, UtensilsCrossed, Bed, Zap } from 'lucide-react';

interface Country {
  id: number;
  code: string;
  name: string;
  flag_emoji: string;
  tip_count?: number;
  view_count?: number;
}

interface Area {
  id: number;
  name: string;
  countries: Country[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
  country: {
    id: number;
    code: string;
    name: string;
    flag_emoji: string;
  };
  user: {
    id: number;
    name: string;
  };
}

// カテゴリのアイコンマッピング
const categoryIconMap: Record<string, React.ReactNode> = {
  '準備': <Luggage className="w-4 h-4" />,
  '通信': <Smartphone className="w-4 h-4" />,
  '移動': <Plane className="w-4 h-4" />,
  '食': <UtensilsCrossed className="w-4 h-4" />,
  '宿泊': <Bed className="w-4 h-4" />,
  '裏ワザ': <Zap className="w-4 h-4" />,
};

export function PostEditPage() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [countryId, setCountryId] = useState<number | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countrySearchInputRef = useRef<HTMLInputElement>(null);

  // 投稿データを取得
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPost(postId!, false);
        
        if (response.data?.post) {
          const postData = response.data.post;
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
          setCategory(postData.category || '');
          setCountryId(postData.country.id);
          
          // 権限チェック
          if (user && String(user.id) !== String(postData.user.id) && !user.admin) {
            navigate('/');
            return;
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('投稿の取得に失敗しました:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (postId && user) {
      fetchPost();
    }
  }, [postId, user, navigate]);

  // ドロップダウンの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 国一覧をエリア別に取得
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const [areasResponse, allCountriesResponse] = await Promise.all([
          apiClient.getCountriesByAreas(),
          apiClient.getCountries()
        ]);
        
        if (areasResponse.data && allCountriesResponse.data) {
          const areasData = areasResponse.data.areas;
          const allCountriesData = allCountriesResponse.data.countries;
          
          const countriesInAreas = new Set(
            areasData.flatMap(area => area.countries.map(c => c.id))
          );
          
          const countriesWithoutArea = allCountriesData.filter(
            country => !countriesInAreas.has(country.id)
          );
          
          if (countriesWithoutArea.length > 0) {
            const otherArea: Area = {
              id: -1,
              name: 'その他',
              countries: countriesWithoutArea.map(c => ({
                ...c,
                tip_count: 0,
                view_count: 0
              }))
            };
            setAreas([...areasData, otherArea]);
          } else {
            setAreas(areasData);
          }
          
          setCountries(allCountriesData);
        }
      } catch (error) {
        console.error('国一覧の取得に失敗しました:', error);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // カテゴリー一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getPostCategories();
        if (response.data) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('カテゴリー一覧の取得に失敗しました:', error);
      }
    };

    fetchCategories();
  }, []);

  // 検索に基づいて国をフィルタリング
  const filteredAreas = useMemo(() => {
    if (!countrySearch.trim()) return areas;
    
    const searchLower = countrySearch.toLowerCase();
    return areas.map(area => ({
      ...area,
      countries: area.countries.filter(country =>
        country.name.toLowerCase().includes(searchLower) ||
        country.code.toLowerCase().includes(searchLower)
      )
    })).filter(area => area.countries.length > 0);
  }, [areas, countrySearch]);

  const totalFilteredCountries = useMemo(() => {
    return filteredAreas.reduce((sum, area) => sum + area.countries.length, 0);
  }, [filteredAreas]);

  const selectedCountry = countries.find(country => country.id === countryId);

  const handleCountrySelect = (country: Country) => {
    setCountryId(country.id);
    setCountrySearch(country.name);
    setIsCountryDropdownOpen(false);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setIsCategoryDropdownOpen(false);
  };

  useEffect(() => {
    if (isCountryDropdownOpen && countrySearchInputRef.current) {
      setTimeout(() => countrySearchInputRef.current?.focus(), 100);
    }
  }, [isCountryDropdownOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!title.trim()) {
      setErrors(['タイトルを入力してください']);
      return;
    }

    if (!content.trim()) {
      setErrors(['本文を入力してください']);
      return;
    }

    if (!countryId) {
      setErrors(['国を選択してください']);
      return;
    }

    setSaving(true);

    try {
      const response = await apiClient.updatePost(postId!, {
        title: title.trim(),
        content: content.trim(),
        country_id: countryId,
      });

      if (response.data) {
        navigate(`/posts/${postId}`);
      } else {
        setErrors([response.error || '更新に失敗しました']);
      }
    } catch (error) {
      setErrors(['更新に失敗しました']);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ログインが必要です
          </h2>
          <button
            onClick={() => navigate('/auth')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログインページへ
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            投稿が見つかりません
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>戻る</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">投稿を編集</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <ul className="text-red-600 text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* タイトル入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="タイトルを入力"
              maxLength={100}
            />
          </div>

          {/* 本文入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">本文</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="本文を入力"
              maxLength={10000}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{content.length}/10000文字</p>
          </div>

          {/* カテゴリー選択 */}
          <div className="relative" ref={categoryDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between transition-all duration-200 ${
                isCategoryDropdownOpen 
                  ? 'border-blue-500 ring-2 ring-blue-100 bg-white' 
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {category && categoryIconMap[category] ? (
                  <span className="text-blue-500">{categoryIconMap[category]}</span>
                ) : (
                  <span className="w-4 h-4 rounded bg-gray-200"></span>
                )}
                <span className={category ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                  {category || 'カテゴリーを選択'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {category && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategory('');
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </div>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                <div className="p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                          category === cat 
                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className={category === cat ? 'text-blue-500' : 'text-gray-400'}>
                          {categoryIconMap[cat] || <span className="w-4 h-4"></span>}
                        </span>
                        <span className="font-medium">{cat}</span>
                        {category === cat && (
                          <Check className="w-4 h-4 ml-auto text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 国選択 */}
          <div className="relative" ref={countryDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">国</label>
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between transition-all duration-200 ${
                isCountryDropdownOpen 
                  ? 'border-blue-500 ring-2 ring-blue-100 bg-white' 
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${selectedCountry ? 'text-blue-500' : 'text-gray-400'}`} />
                {selectedCountry ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedCountry.flag_emoji}</span>
                    <span className="text-gray-900 font-medium">{selectedCountry.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">国を選択</span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCountryDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={countrySearchInputRef}
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="国名で検索..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {countrySearch && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCountrySearch('');
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {countrySearch && (
                    <p className="mt-2 text-xs text-gray-500">
                      {totalFilteredCountries}件の国が見つかりました
                    </p>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {countriesLoading ? (
                    <div className="px-4 py-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">読み込み中...</p>
                    </div>
                  ) : filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => (
                      <div key={area.id}>
                        <div className="sticky top-0 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            {area.name}
                          </span>
                        </div>
                        <div className="py-1">
                          {area.countries.map((country) => (
                            <button
                              key={country.id}
                              type="button"
                              onClick={() => handleCountrySelect(country)}
                              className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                                countryId === country.id 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{country.flag_emoji}</span>
                                <span className="font-medium">{country.name}</span>
                              </div>
                              {countryId === country.id && (
                                <Check className="w-4 h-4 text-blue-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-gray-500 text-sm">
                        「{countrySearch}」に該当する国が見つかりません
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ボタン */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin" />}
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

