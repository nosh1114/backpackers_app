import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, getFullImageUrl } from '../lib/api';
import { User, Edit, Save, X, Camera, Plus, Mail, Pencil, Trash2, MoreHorizontal, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCountryImageUrl } from '../lib/countryImages';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  bio?: string;
  avatar_url?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category?: string;
  images?: string[];
  country?: {
    id: number;
    code: string;
    name: string;
    flag_emoji: string;
    image_url?: string;
  };
  country_code?: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [menuOpenPostId, setMenuOpenPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  // フォーム状態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar_url: ''
  });

  // プロフィール情報を取得
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getCurrentUser();
        
        if (response.data) {
          const profileData = response.data.user;
          setProfile(profileData);
          setFormData({
            name: profileData.name || '',
            email: profileData.email || '',
            bio: profileData.bio || '',
            avatar_url: profileData.avatar_url || ''
          });
        } else {
          setError(response.error || 'プロフィールの取得に失敗しました');
        }
      } catch (err) {
        setError('プロフィールの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ユーザーの投稿を取得
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setPostsLoading(true);
        if (user?.id) {
          const response = await apiClient.getUserPosts(user.id, { page: 1, per_page: 10 });
          
          if (response.data) {
            setUserPosts(response.data.posts);
          }
        }
      } catch (err) {
        console.error('投稿の取得に失敗しました:', err);
      } finally {
        setPostsLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  // ブックマークした投稿を取得
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setBookmarksLoading(true);
        const response = await apiClient.getBookmarks();
        
        if (response.data) {
          setBookmarkedPosts(response.data.posts);
        }
      } catch (err) {
        console.error('ブックマークの取得に失敗しました:', err);
      } finally {
        setBookmarksLoading(false);
      }
    };

    if (user && activeTab === 'bookmarks') {
      fetchBookmarks();
    }
  }, [user, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.updateUser({
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      });

      if (response.data) {
        setSuccess('プロフィールが更新されました');
        setIsEditing(false);
        setProfile(response.data.user);
        await refreshUser();
      } else {
        setError(response.error || 'プロフィールの更新に失敗しました');
      }
    } catch (err) {
      setError('プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('この投稿を削除しますか？この操作は取り消せません。')) return;
    
    try {
      setDeletingPostId(postId);
      const response = await apiClient.deletePost(postId);
      
      if (response.data) {
        setUserPosts(userPosts.filter(p => p.id !== postId));
        setSuccess('投稿を削除しました');
      } else {
        setError('削除に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      setError('削除に失敗しました');
    } finally {
      setDeletingPostId(null);
      setMenuOpenPostId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 投稿の画像URLを取得（優先順位: 記事の画像 > 国の画像 > デフォルト）
  const getPostImageUrl = (post: Post): string => {
    // 1. 記事に添付された画像があればそれを使う
    if (post.images && post.images.length > 0 && post.images[0]) {
      return getFullImageUrl(post.images[0]) || post.images[0];
    }
    // 2. 国の画像（DBから）
    if (post.country?.image_url) {
      return post.country.image_url;
    }
    // 3. 国名からフォールバック
    if (post.country?.name) {
      return getCountryImageUrl(post.country.name);
    }
    // 4. デフォルト画像
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80';
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">マイページ</h1>
          <p className="text-gray-600">プロフィールと投稿を管理できます</p>
        </div>
        <Link
          to="/create-post"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新しい投稿
        </Link>
      </div>

      {/* エラー・成功メッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* プロフィール情報 */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">プロフィール</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>編集</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="自己紹介を入力してください"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">アバターURL</label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? '保存中...' : '保存'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>キャンセル</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{profile?.name}</h3>
                    <p className="text-gray-600">{profile?.email}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <div>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{profile?.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 投稿・ブックマーク一覧 */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* タブ */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <Plus size={18} />
                投稿一覧
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <Bookmark size={18} />
                ブックマーク
              </button>
            </div>
            
            {/* 投稿一覧タブ */}
            {activeTab === 'posts' && (postsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">まだ投稿がありません</p>
                <Link
                  to="/create-post"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  最初の投稿を作成する
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex h-40">
                      {/* 画像セクション */}
                      <div className="w-1/3 relative flex-shrink-0 overflow-hidden">
                        <img 
                          src={getPostImageUrl(post)} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* コンテンツセクション */}
                      <div className="w-2/3 p-4 flex flex-col justify-between min-w-0">
                        <div className="flex-1 min-h-0 overflow-hidden">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link to={`/posts/${post.id}`} className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">{post.title}</h3>
                            </Link>
                            <div className="relative flex-shrink-0">
                              <button
                                onClick={() => setMenuOpenPostId(menuOpenPostId === post.id ? null : post.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                              {menuOpenPostId === post.id && (
                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                                  <Link
                                    to={`/posts/${post.id}/edit`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Pencil size={14} />
                                    <span>編集</span>
                                  </Link>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    disabled={deletingPostId === post.id}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    <Trash2 size={14} />
                                    <span>{deletingPostId === post.id ? '削除中...' : '削除'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <Link to={`/posts/${post.id}`}>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                              {post.content}
                            </p>
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 text-xs pt-2 border-t border-gray-100 flex-wrap">
                          {post.category && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium truncate max-w-[120px]">
                              {post.category}
                            </span>
                          )}
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium truncate max-w-[120px]">
                            {post.country?.name || post.country_code}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* ブックマーク一覧タブ */}
            {activeTab === 'bookmarks' && (bookmarksLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : bookmarkedPosts.length === 0 ? (
              <div className="text-center py-8">
                <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ブックマークした投稿がありません</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarkedPosts.map((post) => (
                  <Link key={post.id} to={`/posts/${post.id}`} className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex h-40">
                      {/* 画像セクション */}
                      <div className="w-1/3 relative flex-shrink-0 overflow-hidden">
                        <img 
                          src={getPostImageUrl(post)} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* コンテンツセクション */}
                      <div className="w-2/3 p-4 flex flex-col justify-between min-w-0">
                        <div className="flex-1 min-h-0 overflow-hidden">
                          <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-tight">{post.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                            {post.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs pt-2 border-t border-gray-100 flex-wrap">
                          {post.category && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium truncate max-w-[120px]">
                              {post.category}
                            </span>
                          )}
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium truncate max-w-[120px]">
                            {post.country?.name || post.country_code}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 