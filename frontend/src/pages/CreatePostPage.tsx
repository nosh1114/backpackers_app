import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { MapPin, Camera, X, ChevronDown, Search, Check, Luggage, Smartphone, Plane, UtensilsCrossed, Bed, Zap } from 'lucide-react';

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

// カテゴリのアイコンマッピング
const categoryIconMap: Record<string, React.ReactNode> = {
  '準備': <Luggage className="w-4 h-4" />,
  '通信': <Smartphone className="w-4 h-4" />,
  '移動': <Plane className="w-4 h-4" />,
  '食': <UtensilsCrossed className="w-4 h-4" />,
  '宿泊': <Bed className="w-4 h-4" />,
  '裏ワザ': <Zap className="w-4 h-4" />,
};

export function CreatePostPage() {
  const [searchParams] = useSearchParams();
  const countryIdParam = searchParams.get('country_id');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [countryId, setCountryId] = useState<number | null>(
    countryIdParam ? parseInt(countryIdParam) : null
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countrySearchInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;

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

  // 国一覧をエリア別に取得（エリアなしの国も含む）
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // 両方のAPIを並行して取得
        const [areasResponse, allCountriesResponse] = await Promise.all([
          apiClient.getCountriesByAreas(),
          apiClient.getCountries()
        ]);
        
        if (areasResponse.data && allCountriesResponse.data) {
          const areasData = areasResponse.data.areas;
          const allCountriesData = allCountriesResponse.data.countries;
          
          // エリアに属している国のIDを収集
          const countriesInAreas = new Set(
            areasData.flatMap(area => area.countries.map(c => c.id))
          );
          
          // エリアに属していない国を「その他」として追加
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
          
          // 全国リストをセット
          setCountries(allCountriesData);
          
          // URLパラメータで国IDが指定されている場合、その国をセット
          if (countryIdParam) {
            const country = allCountriesData.find(
              (c: Country) => c.id === parseInt(countryIdParam)
            );
            if (country) {
              setCountrySearch(country.name);
            }
          }
        }
      } catch (error) {
        console.error('国一覧の取得に失敗しました:', error);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, [countryIdParam]);

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

  // 検索に基づいて国をフィルタリング（エリア付き）
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

  // 検索結果のフラット化（マッチした国の合計数を取得）
  const totalFilteredCountries = useMemo(() => {
    return filteredAreas.reduce((sum, area) => sum + area.countries.length, 0);
  }, [filteredAreas]);

  // 選択された国を取得
  const selectedCountry = countries.find(country => country.id === countryId);

  // 国を選択
  const handleCountrySelect = (country: Country) => {
    setCountryId(country.id);
    setCountrySearch(country.name);
    setIsCountryDropdownOpen(false);
  };

  // カテゴリーを選択
  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setIsCategoryDropdownOpen(false);
  };

  // ドロップダウンを開いた時に検索入力にフォーカス
  useEffect(() => {
    if (isCountryDropdownOpen && countrySearchInputRef.current) {
      setTimeout(() => countrySearchInputRef.current?.focus(), 100);
    }
  }, [isCountryDropdownOpen]);

  // 画像を選択
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // ファイル数制限チェック
      if (images.length + newFiles.length >= MAX_IMAGES) {
        errors.push(`画像は最大${MAX_IMAGES}枚までアップロードできます`);
        break;
      }

      // ファイルサイズチェック（5MB）
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}は5MB以下にしてください`);
        continue;
      }

      // ファイル形式チェック
      const acceptableTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
      if (!acceptableTypes.includes(file.type)) {
        errors.push(`${file.name}はサポートされていない形式です（JPEG、PNG、GIF、WebP、HEICのみ）`);
        continue;
      }

      newFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    if (errors.length > 0) {
      setErrors(errors);
    }

    if (newFiles.length > 0) {
      setImages([...images, ...newFiles]);
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    }

    // input をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 画像追加ボタンクリック
  const handleImageAdd = () => {
    if (images.length < MAX_IMAGES && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 画像を削除
  const handleImageRemove = (index: number) => {
    // プレビューURLを解放
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };

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

    if (!agreedToTerms) {
      setErrors(['利用規約とプライバシーポリシーに同意してください']);
      return;
    }

    setLoading(true);

    try {
      // FormDataを使用して画像を含む投稿を作成
      const formData = new FormData();
      formData.append('post[title]', title.trim());
      formData.append('post[content]', content.trim());
      formData.append('post[country_id]', countryId.toString());
      if (category) {
        formData.append('post[category]', category);
      }
      
      // 画像を追加
      images.forEach((image) => {
        formData.append('post[images][]', image);
      });

      const response = await apiClient.createPostWithImages(formData);

      if (response.data) {
        // プレビューURLを解放
        imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
        // 投稿成功後、投稿詳細ページにリダイレクト
        navigate(`/posts/${response.data.post.id}`);
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
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ログインが必要です
          </h2>
          <p className="text-gray-600 mb-4">
            投稿を作成するにはログインしてください。
          </p>
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

  return (
    <div className="min-h-screen bg-white">

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
          {/* 画像アップロードセクション */}
          <div>
            {/* 非表示のファイル入力 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {/* 画像追加ボタン */}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="flex-shrink-0 w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{images.length}/{MAX_IMAGES}</span>
                </button>
              )}

              {/* アップロード済み画像のプレビュー */}
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative flex-shrink-0 w-24 h-24">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ※ JPEG、PNG、GIF、WebP形式（1枚あたり5MBまで、最大5枚）
            </p>
          </div>

          {/* タイトル入力 */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="【タイトル】魅力的なタイトルを記入しましょう"
              maxLength={100}
            />
          </div>

          {/* 本文入力 */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="【本文】行った人にしかわからない情報を記入しましょう
例) バスの乗り方、ニッチな食堂、空港の情報など
あなたしか知らない情報をシェアしましょう"
              maxLength={10000}
            />
          </div>

          {/* カテゴリー選択 - 改良版 */}
          <div className="relative" ref={categoryDropdownRef}>
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategory('');
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

          {/* 場所追加（国選択） - 改良版 */}
          <div className="relative" ref={countryDropdownRef}>
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
              <div className="flex items-center gap-2">
                {selectedCountry && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCountryId(null);
                      setCountrySearch('');
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isCountryDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* 検索バー */}
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

                {/* エリア別国一覧 */}
                <div className="max-h-72 overflow-y-auto">
                  {countriesLoading ? (
                    <div className="px-4 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">読み込み中...</p>
                    </div>
                  ) : filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => (
                      <div key={area.id}>
                        {/* エリアヘッダー */}
                        <div className="sticky top-0 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            {area.name}
                          </span>
                        </div>
                        {/* 国一覧 */}
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
                                {(country.tip_count ?? 0) > 0 && (
                                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {country.tip_count}件
                                  </span>
                                )}
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
                      <div className="text-gray-400 mb-2">
                        <Search className="w-8 h-8 mx-auto" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        「{countrySearch}」に該当する国が見つかりません
                      </p>
                      <button
                        type="button"
                        onClick={() => setCountrySearch('')}
                        className="mt-2 text-blue-500 text-sm hover:underline"
                      >
                        検索をクリア
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 利用規約・プライバシーポリシーへの同意 */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              ご利用規約、
              <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー
              </a>
              に同意します
            </label>
          </div>

          {/* 投稿ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? '投稿中...' : '投稿する'}
          </button>
        </form>
      </div>
    </div>
  );
}
