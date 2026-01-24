import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, X, ChevronRight } from 'lucide-react';
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

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isSearched, setIsSearched] = useState(!!initialQuery);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // モックのサジェストデータ
  const suggestions = [
    'シンガポール',
    'シドニー',
    'シカゴ',
    'シエラレオネ',
    'シャワー',
    '日本',
    'タイ',
    'アメリカ'
  ];

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    // フォーカス設定
    if (!initialQuery) {
      inputRef.current?.focus();
    }
  }, []);

  const handleSearch = async (searchQuery: string = query) => {
    // 
    if (!searchQuery.trim()) return;
    
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

  // 
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // 検索ワードをクリア
  const clearSearch = () => {
    setQuery('');
    setIsSearched(false);
    setPosts([]);
    inputRef.current?.focus();
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
             onChange={(e) => setQuery(e.target.value)}
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
            {/* フィルタリングしたサジェストを表示 */}
            {suggestions
              .filter(s => !query || s.toLowerCase().includes(query.toLowerCase()))
              .map((suggestion, index) => (
              <div 
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-50 cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Search size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{suggestion}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            ))}
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

