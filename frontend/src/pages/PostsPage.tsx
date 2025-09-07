import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { apiClient } from '../lib/api';

interface Post {
  id: string;
  title: string;
  content: string;
  country_code: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

interface Country {
  code: string;
  name: string;
}

export function PostsPage() {
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
          country_code: selectedCountry || undefined
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
  }, [selectedCountry]);

  const handleCountryFilter = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const filteredPosts = posts.filter(post => 
    searchQuery === '' || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">投稿一覧</h1>
          <p className="text-gray-600">バックパッカーの旅の情報を共有しましょう</p>
        </div>
        <Link
          to="/create-post"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新しい投稿
        </Link>
      </div>

      {/* フィルター */}
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
                <option key={country.code} value={country.code}>
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

      {/* 投稿リスト */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">投稿がありません</p>
            <Link
              to="/create-post"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              最初の投稿を作成する
            </Link>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 gap-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {getCountryName(post.country_code)}
                    </span>
                    <span>by {post.user.name}</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                <p className="line-clamp-3">
                  {post.content.length > 200 
                    ? `${post.content.substring(0, 200)}...` 
                    : post.content
                  }
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  続きを読む →
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
