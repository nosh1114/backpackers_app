import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Country {
  id: number;
  code: string;
  name: string;
  flag_emoji: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
  featured: boolean;
  country: {
    id: number;
    name: string;
    flag_emoji: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  view_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  '宿泊', '食事', '交通', '観光', 'ショッピング', '文化', '安全', 'その他',
  'お金', '決済', '移動', '日本宿', 'ビザ', '治安', 'sim'
];

export function AdminPostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    country_id: 0,
    featured: false,
  });

  useEffect(() => {
    if (!user || !user.admin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 投稿データと国リストを並行取得
        const [postResponse, countriesResponse] = await Promise.all([
          apiClient.getAdminPost(id!),
          apiClient.getCountries()
        ]);

        if (postResponse.data?.post) {
          const postData = postResponse.data.post;
          setPost(postData);
          setFormData({
            title: postData.title,
            content: postData.content,
            category: postData.category || '',
            country_id: postData.country.id,
            featured: postData.featured,
          });
        } else {
          setError('投稿が見つかりません');
        }

        if (countriesResponse.data?.countries) {
          setCountries(countriesResponse.data.countries);
        }
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('タイトルを入力してください');
      return;
    }
    if (!formData.content.trim()) {
      alert('内容を入力してください');
      return;
    }
    if (!formData.country_id) {
      alert('国を選択してください');
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.updateAdminPost(id!, {
        title: formData.title,
        content: formData.content,
        category: formData.category || undefined,
        country_id: formData.country_id,
        featured: formData.featured,
      });

      if (response.data) {
        navigate('/admin');
      } else {
        alert('更新に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating post:', err);
      alert('更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !user.admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '投稿が見つかりません'}</p>
          <Link to="/admin" className="text-blue-600 hover:underline">
            管理画面に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">投稿を編集</h1>
              <p className="text-gray-600 text-sm mt-1">
                投稿者: {post.user.name} ({post.user.email})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="タイトルを入力"
              />
            </div>

            {/* 内容 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                placeholder="内容を入力"
              />
            </div>

            {/* 国 */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                国 <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                value={formData.country_id}
                onChange={(e) => setFormData({ ...formData, country_id: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>国を選択</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.flag_emoji} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* カテゴリー */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリー
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">カテゴリーなし</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 特集 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                特集記事として表示
              </label>
            </div>
          </div>

          {/* メタ情報 */}
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">閲覧数:</span> {post.view_count}
              </div>
              <div>
                <span className="font-medium">いいね数:</span> {post.likes_count}
              </div>
              <div>
                <span className="font-medium">作成日:</span> {new Date(post.created_at).toLocaleString('ja-JP')}
              </div>
              <div>
                <span className="font-medium">更新日:</span> {new Date(post.updated_at).toLocaleString('ja-JP')}
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex items-center justify-end gap-4">
            <Link
              to="/admin"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

