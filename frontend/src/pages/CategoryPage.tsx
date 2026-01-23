import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { apiClient } from '../lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
  featured?: boolean;
  img?: string;
  country: {
    id: number;
    code: string;
    name: string;
    flag_emoji: string;
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
}

// カテゴリーIDと実際のカテゴリー名のマッピング
// 複数のカテゴリーにマッピングできるように配列で管理
const categoryMapping: { [key: string]: string[] } = {
  'preparation': ['ビザ', 'お金', '決済'], // 準備 → ビザ、お金、決済
  'communication': ['sim'], // 通信 → sim
  'transport': ['交通', '移動'], // 移動 → 交通、移動
  'food': ['レストラン'], // 食 → レストラン
  'accommodation': ['宿', '日本宿'], // 宿泊 → 宿、日本宿
  'tips': ['お得情報'], // 裏ワザ → お得情報
};

// カテゴリー名からIDを取得
const getCategoryIdFromName = (name: string): string | null => {
  const entry = Object.entries(categoryMapping).find(([_, value]) => value === name);
  return entry ? entry[0] : null;
};

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'recent' | 'popular'>('popular');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  } | null>(null);

  // URLパラメータからカテゴリーを取得
  const categoryParam = categoryId || searchParams.get('category') || '';
  const categoryNames = categoryMapping[categoryParam] || [categoryParam];

  useEffect(() => {
    fetchPosts();
  }, [categoryParam, sort, page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // 複数のカテゴリーにマッピングされている場合は、すべてのカテゴリーの投稿を取得
      const response = await apiClient.getPosts({
        page,
        per_page: 20,
        category: categoryNames.length > 0 ? categoryNames : undefined,
        sort
      });

      if (response.data) {
        setPosts(response.data.posts);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort: 'recent' | 'popular') => {
    setSort(newSort);
    setPage(1);
  };

  const categoryDisplayName: { [key: string]: string } = {
    'preparation': '準備',
    'communication': '通信',
    'transport': '移動',
    'food': '食',
    'accommodation': '宿泊',
    'tips': '裏ワザ',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryDisplayName[categoryParam] || categoryParam || 'カテゴリー'}
          </h1>
          <p className="text-gray-600 mt-2">
            {pagination ? `${pagination.total_count}件の投稿` : '投稿を読み込み中...'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-gray-600">並び替え:</span>
            <button
              onClick={() => handleSortChange('popular')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              人気順
            </button>
            <button
              onClick={() => handleSortChange('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === 'recent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              新着順
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* ページネーション */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 inline" />
                  前へ
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.total_pages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.total_pages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.total_pages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === pagination.total_pages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  次へ
                  <ChevronRight className="h-4 w-4 inline" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              投稿が見つかりませんでした
            </h3>
            <p className="text-gray-600">
              {categoryNames.length > 0 ? `${categoryDisplayName[categoryParam] || categoryNames.join('、')}カテゴリーの投稿はまだありません` : '投稿がありません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

