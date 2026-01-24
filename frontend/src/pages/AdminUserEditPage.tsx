import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Edit, Eye, Calendar, FileText } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface UserPost {
  id: number;
  title: string;
  category?: string;
  featured: boolean;
  country: {
    id: number;
    name: string;
    flag_emoji: string;
  };
  view_count: number;
  created_at: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  admin: boolean;
  created_at: string;
  updated_at: string;
  posts: UserPost[];
}

export function AdminUserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    admin: false,
  });

  useEffect(() => {
    if (!user || !user.admin) {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAdminUser(id!);

        if (response.data?.user) {
          const userData = response.data.user;
          setTargetUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            bio: userData.bio || '',
            admin: userData.admin,
          });
        } else {
          setError('ユーザーが見つかりません');
        }
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('名前を入力してください');
      return;
    }
    if (!formData.email.trim()) {
      alert('メールアドレスを入力してください');
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.updateAdminUser(id!, {
        name: formData.name,
        email: formData.email,
        bio: formData.bio || undefined,
        admin: formData.admin,
      });

      if (response.data) {
        navigate('/admin');
      } else {
        alert('更新に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  if (error || !targetUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'ユーザーが見つかりません'}</p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4">
              {targetUser.avatar_url ? (
                <img
                  src={targetUser.avatar_url}
                  alt={targetUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {targetUser.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ユーザーを編集</h1>
                <p className="text-gray-600 text-sm mt-1">
                  ID: {targetUser.id} | 登録日: {formatDate(targetUser.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 編集フォーム */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">ユーザー情報</h2>
                
                {/* 名前 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 自己紹介 */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    自己紹介
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* 管理者フラグ */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="admin"
                    checked={formData.admin}
                    onChange={(e) => setFormData({ ...formData, admin: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="admin" className="text-sm font-medium text-gray-700">
                    管理者権限を付与
                  </label>
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

          {/* ユーザーの投稿一覧 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    投稿一覧 ({targetUser.posts.length}件)
                  </h2>
                </div>
              </div>

              {targetUser.posts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {targetUser.posts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{post.country.flag_emoji}</span>
                            <span className="text-sm text-gray-500">{post.country.name}</span>
                            {post.category && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {post.category}
                              </span>
                            )}
                            {post.featured && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                特集
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900 truncate">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.view_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/admin/posts/${post.id}/edit`}
                          className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  このユーザーはまだ投稿していません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

