import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, X, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { apiClient } from '../lib/api';
import { SearchResultCard } from '../components/SearchResultCard';

// 型定義
interface Post {
  id: number;
  title: string;
  content: string;
  images?: string[];
  country?: {
    id: number;
    code: string;
    name: string;
    flag_emoji: string;
    image_url?: string;
  };
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  view_count?: number;
}

interface Country {
  id: number;
  code: string;
  name: string;
  flag_emoji: string;
}

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isSearched, setIsSearched] = useState(!!initialQuery);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 検索履歴をローカルストレージから読み込む
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('検索履歴の読み込みに失敗しました:', e);
      }
    }
  }, []);

  // 国名とカテゴリーを取得
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const [countriesRes, categoriesRes] = await Promise.all([
          apiClient.getCountries(),
          apiClient.getPostCategories()
        ]);
        
        if (countriesRes.data?.countries) {
          setCountries(countriesRes.data.countries);
        }
        if (categoriesRes.data?.categories) {
          setCategories(categoriesRes.data.categories);
        }
      } catch (error) {
        console.error('サジェストデータの取得に失敗しました:', error);
      }
    };
    
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    // フォーカス設定
    if (!initialQuery) {
      inputRef.current?.focus();
    }
  }, []);

  // 検索履歴に追加
  const addToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const trimmedQuery = searchQuery.trim();
    const newHistory = [
      trimmedQuery,
      ...searchHistory.filter(item => item !== trimmedQuery)
    ].slice(0, MAX_HISTORY_ITEMS);
    
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    // 検索履歴に追加
    addToHistory(searchQuery);
    
    // loadingをtrueにする
    setLoading(true);
    // 検索結果の画面に遷移する
    setIsSearched(true);
    try {
      console.log('検索実行:', searchQuery);
      const response = await apiClient.searchPosts(searchQuery);
      console.log('検索レスポンス:', response);
      
      if (response.error) {
        console.error('検索エラー:', response.error);
        setPosts([]);
        return;
      }
      
      if (response.data) {
        const filteredPosts = response.data.posts || [];
        console.log('検索結果数:', filteredPosts.length);
        setPosts(filteredPosts);
      } else {
        console.log('データなし');
        setPosts([]);
      }
    } catch (error) {
      console.error('検索エラー:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // サジェスト候補を生成
  const suggestions = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    const results: Array<{ type: 'country' | 'category' | 'history'; text: string; icon?: React.ReactNode }> = [];
    
    // 検索履歴
    searchHistory
      .filter(item => !query || item.toLowerCase().includes(lowerQuery))
      .forEach(item => {
        results.push({ type: 'history', text: item, icon: <Clock size={16} className="text-gray-400" /> });
      });
    
    // 国名
    countries
      .filter(country => !query || country.name.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .forEach(country => {
        results.push({ type: 'country', text: country.name, icon: <span>{country.flag_emoji}</span> });
      });
    
    // カテゴリー
    categories
      .filter(cat => !query || cat.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(cat => {
        results.push({ type: 'category', text: cat, icon: <TrendingUp size={16} className="text-gray-400" /> });
      });
    
    // 重複を削除
    const uniqueResults = results.filter((item, index, self) => 
      index === self.findIndex(t => t.text === item.text)
    );
    
    return uniqueResults.slice(0, 10);
  }, [query, countries, categories, searchHistory]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // 検索履歴を削除
  const removeFromHistory = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  // 検索ワードをクリア
  const clearSearch = () => {
    setQuery('');
    setIsSearched(false);
    setPosts([]);
    inputRef.current?.focus();
  };

  // 入力変更時のデバウンス処理
  const handleQueryChange = (value: string) => {
    setQuery(value);
    
    // デバウンスタイマーをクリア
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // 入力が空の場合は検索結果をクリア
    if (!value.trim()) {
      setIsSearched(false);
      setPosts([]);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white z-50 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="text-gray-500 p-1">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 relative bg-gray-100 rounded-full flex items-center px-4 py-2.5">
           <Search size={18} className="text-gray-400 mr-2 shrink-0"/>
           <input
             ref={inputRef}
             className="bg-transparent w-full outline-none text-base placeholder-gray-400"
             value={query}
             onChange={(e) => handleQueryChange(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="検索キーワードを入力"
           />
           {query && (
             <button onClick={clearSearch} className="ml-2 text-gray-400 hover:text-gray-600 p-0.5 bg-gray-200 rounded-full">
               <X size={14} />
             </button>
           )}
        </div>
        <button 
          onClick={() => handleSearch()} 
          className="text-blue-600 font-bold text-sm whitespace-nowrap px-1"
        >
          検索する
        </button>
      </div>

      {/* コンテンツ */}
      <div className="pb-20">
        {!isSearched ? (
          // 検索入力時（サジェスト画面）
          <div className="py-2">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div 
                  key={`${suggestion.type}-${suggestion.text}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex items-center justify-between px-6 py-4 border-b border-gray-50 cursor-pointer active:bg-gray-50 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {suggestion.icon || <Search size={18} className="text-gray-400 shrink-0" />}
                    <span className="font-medium text-gray-900 truncate">{suggestion.text}</span>
                    {suggestion.type === 'history' && (
                      <button
                        onClick={(e) => removeFromHistory(suggestion.text, e)}
                        className="ml-auto text-gray-300 hover:text-gray-500 p-1"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {suggestion.type !== 'history' && (
                    <ChevronRight size={18} className="text-gray-300 shrink-0" />
                  )}
                </div>
              ))
            ) : query ? (
              <div className="px-6 py-8 text-center text-gray-400">
                <p>候補が見つかりませんでした</p>
              </div>
            ) : (
              <div className="px-6 py-4">
                <p className="text-sm text-gray-500 mb-2">検索候補</p>
                <p className="text-xs text-gray-400">キーワードを入力すると候補が表示されます</p>
              </div>
            )}
          </div>
        ) : (
          // 検索結果画面
          <div className="px-4 py-4 space-y-4">
            <h2 className="text-sm font-bold text-gray-500 mb-2">
              「{query}」の検索結果 ({posts.length}件)
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <SearchResultCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">検索結果が見つかりませんでした</p>
                <button 
                  onClick={clearSearch}
                  className="mt-4 text-blue-600 font-medium text-sm"
                >
                  検索ワードを変えてみる
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

