import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { apiClient } from '../lib/api';
import { PostCard } from '../components/PostCard';

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
  featured?: boolean;
  country: {
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
  created_at: string;
  updated_at: string;
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
  images?: string[];
}

interface Country {
  id: number;
  code: string;
  name: string;
}

export function PostsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isFeatured = searchParams.get('featured') === 'true' || location.pathname === '/featured';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 投稿一覧と国一覧を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // 投稿一覧を取得
        const postsResponse = await apiClient.getPosts({
          page: 1,
          per_page: 20,
          country_id: selectedCountry ? parseInt(selectedCountry) : undefined,
          featured: isFeatured ? true : undefined
        });

        // 国一覧を取得
        const countriesResponse = await apiClient.getCountries();

        if (postsResponse.data) {
          setPosts(postsResponse.data.posts);
        } else {
          setError(postsResponse.error || '投稿の取得に失敗しました');
        }

        if (countriesResponse.data) {
          setCountries(countriesResponse.data.countries);
        }
      } catch (err) {
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry, isFeatured]);

  const handleCountryFilter = (countryId: string) => {
    setSelectedCountry(countryId);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">投稿の読み込み中にエラーが発生しました: {error}</p>
        </div>
      </div>
    );
  }

  const filteredPosts = isFeatured 
    ? posts 
    : posts.filter(post => 
        searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 ${isFeatured ? '' : 'mb-8'}`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isFeatured ? '特集記事' : '投稿一覧'}
          </h1>
          <p className="text-gray-600">
            {isFeatured 
              ? '厳選された特集記事をご覧いただけます' 
              : 'バックパッカーの旅の情報を共有しましょう'
            }
          </p>
        </div>
        {!isFeatured && (
          <Link
            to="/create-post"
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新しい投稿
          </Link>
        )}
      </div>

      {/* フィルター */}
      {!isFeatured && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 国別フィルター */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                国で絞り込み
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべての国</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id.toString()}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 検索 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                検索
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルや内容で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 投稿リスト */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {isFeatured ? '特集記事がありません' : '投稿がありません'}
            </p>
            {!isFeatured && (
              <Link
                to="/create-post"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                最初の投稿を作成する
              </Link>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))
        )}
      </div>
    </div>
  );
}
